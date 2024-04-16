package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"eilefsen.net/backend/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func login(w http.ResponseWriter, r *http.Request) {
	var creds models.Credentials

	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		// If the structure of the body is wrong, return an HTTP error
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	u, err := models.GetUserByName(creds.Username)
	if err != nil {
		slog.Error("login: Could not get user", "username", creds.Username)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(creds.Password))
	if err != nil {
		slog.Info("login: Invalid login", "username", creds.Username)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	atExpire := time.Now().Add(5 * time.Minute)
	rtExpire := time.Now().Add(24 * time.Hour)
	atString, err := NewAccessTokenString(u, atExpire)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		slog.Error("login: NewAccessTokenString:", "err", err)
		return
	}
	rtString, err := NewRefreshTokenString(u, rtExpire)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		slog.Error("login: NewRefreshTokenString:", "err", err)
		return
	}
	atCookie := http.Cookie{
		Name:     "access_token",
		Value:    atString,
		HttpOnly: true,
		Path:     "/",
		Expires:  atExpire,
		Secure:   true, // enable for production
		SameSite: http.SameSiteLaxMode,
		Domain:   os.Getenv("DOMAIN"),
	}

	http.SetCookie(w, &atCookie)
	rtCookie := http.Cookie{
		Name:     "refresh_token",
		Value:    rtString,
		HttpOnly: true,
		Path:     "/",
		Expires:  rtExpire,
		Secure:   true, // enable for production
		SameSite: http.SameSiteLaxMode,
		Domain:   os.Getenv("DOMAIN"),
	}

	http.SetCookie(w, &rtCookie)
}

func authRefreshHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	rtString := cookie.Value
	rt, err := jwt.Parse(rtString, func(token *jwt.Token) (any, error) {
		return settings.Key, nil
	})
	if err != nil {
		if err == jwt.ErrTokenInvalidClaims {
			w.WriteHeader(http.StatusUnauthorized)
			slog.Error("TokenAuth:", "err", err)
			return
		}
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			slog.Error("TokenAuth:", "err", err)
			return
		}
		slog.Error("TokenAuth:", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if !rt.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	var subject string
	subject, err = rt.Claims.GetSubject()
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	var userID uint32
	userID, err = ParseUint32(subject)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	u, err := models.GetUser(userID)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	atExpire := time.Now().Add(5 * time.Minute)
	atString, err := NewAccessTokenString(u, atExpire)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		slog.Error("refresh: NewAccessTokenString:", "err", err)
		return
	}
	atCookie := http.Cookie{
		Name:     "access_token",
		Value:    atString,
		HttpOnly: true,
		Path:     "/",
		Expires:  atExpire,
		// Secure:   true, // enable for production
		SameSite: http.SameSiteLaxMode,
		Domain:   os.Getenv("DOMAIN"),
	}

	http.SetCookie(w, &atCookie)
}

func logoutHandler(w http.ResponseWriter, _ *http.Request) {
	c := &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Domain:   os.Getenv("DOMAIN"),
	}
	http.SetCookie(w, c)

	c = &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Domain:   os.Getenv("DOMAIN"),
	}
	http.SetCookie(w, c)
}

func authStatusHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func fetchAllThoughts(w http.ResponseWriter, r *http.Request) {
	thoughts, err := models.AllThoughts()
	if err == models.ErrResourceNotFound {
		w.WriteHeader(http.StatusNoContent)
		return
	} else if err != nil {
		slog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	responseJSON, err := json.Marshal(thoughts)
	if err != nil {
		slog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}

func createThought(w http.ResponseWriter, r *http.Request) {
	var t models.ThoughtNoID

	err := json.NewDecoder(r.Body).Decode(&t)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	insertedThought, err := models.NewThought(t)
	if err != nil {
		slog.Error(err.Error())
	}
	responseJSON, err := json.Marshal(insertedThought)
	if err != nil {
		slog.Error(err.Error())
	}
	slog.Debug("createThought", "thought", t, "insertedThought", insertedThought, "responseJSON", string(responseJSON))
	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}

func uploadPicture(w http.ResponseWriter, r *http.Request) {
	var p models.PictureUpload

	const MAX_UPLOAD_SIZE = (1024 * 1024) * 8 // 8MB
	r.Body = http.MaxBytesReader(w, r.Body, MAX_UPLOAD_SIZE)
	if err := r.ParseMultipartForm(MAX_UPLOAD_SIZE); err != nil {
		http.Error(w, "The uploaded file is too big. Please choose an file that's less than 1MB in size", http.StatusBadRequest)
		return
	}

	file, fileHeader, err := r.FormFile("image")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	err = os.MkdirAll("./uploads", os.ModePerm)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	dst, err := os.Create(fmt.Sprintf("./uploads/%d%s", time.Now().Unix(), filepath.Ext(fileHeader.Filename)))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the filesystem
	// at the specified destination
	_, err = io.Copy(dst, file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var pic models.PictureNoID
	pic.PictureUpload = p

	pic.ImgSrc = dst.Name()

	insertedPicture, err := models.NewPicture(pic)
	if err != nil {
		slog.Error(err.Error())
	}
	responseJSON, err := json.Marshal(insertedPicture)
	if err != nil {
		slog.Error(err.Error())
	}
	slog.Debug("uploadPicture", "picture", p, "insertedPicture", insertedPicture, "responseJSON", string(responseJSON))
	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}
