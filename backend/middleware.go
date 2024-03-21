package main

import (
	"log/slog"
	"net/http"

	"eilefsen.net/backend/models"
	"golang.org/x/crypto/bcrypt"
)

func BasicAuth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		username, password, ok := r.BasicAuth()

		if !ok {
			unauthorizedHandler(w)
			return
		}

		superuser, err := models.GetUser(1)
		if err != nil {
			slog.Error("Could not get superuser.", "ID", 1)
		}

		err = bcrypt.CompareHashAndPassword([]byte(superuser.Password), []byte(password))
		if err != nil {
			unauthorizedHandler(w)
		}

		if superuser.Username == username {
			next.ServeHTTP(w, r)
			return
		}
		unauthorizedHandler(w)
	})
}

func unauthorizedHandler(w http.ResponseWriter) {
	w.Header().Set("WWW-Authenticate", `Basic realm="restricted", charset="UTF-8"`)
	http.Error(w, "Unauthorized", http.StatusUnauthorized)
}
