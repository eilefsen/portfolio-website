package main

import (
	"log/slog"
	"net/http"
	"strings"

	"eilefsen.net/backend/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func BasicAuth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var creds models.Credentials
		var ok bool
		creds.Username, creds.Password, ok = r.BasicAuth()
		if !ok {
			unauthorizedHandler(w)
			return
		}

		users, err := models.GetUsersByName(creds.Username)
		if err == models.ErrResourceNotFound {
			slog.Error("login: No users found", "error", err)
			unauthorizedHandler(w)
			return
		}
		if err != nil {
			slog.Error("Could not get user", "username", creds.Username)
			unauthorizedHandler(w)
			return
		}

		if len(users) > 1 {
			slog.Info("Multiple users with the same name, defaulting to the lowest ID", "name", creds.Username)
		}
		u := users[0]
		for _, user := range users {
			if user.ID < u.ID {
				u = user
			}
		}

		err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(creds.Password))
		if err != nil {
			unauthorizedHandler(w)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func TokenAuth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" || tokenString == "Bearer" {
			cookie, err := r.Cookie("token")
			tokenString = cookie.Value
			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				slog.Error("TokenAuth r.Cookie():", "err", err)
				return
			}
		}
		tokenString = strings.ReplaceAll(tokenString, "Bearer ", "")

		claims := &CustomClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
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
		if !token.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func unauthorizedHandler(w http.ResponseWriter) {
	w.Header().Set("WWW-Authenticate", `Basic realm="restricted", charset="UTF-8"`)
	http.Error(w, "Unauthorized", http.StatusUnauthorized)
}
