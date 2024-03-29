package main

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
	"time"

	"eilefsen.net/backend/models"
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

	users, err := models.GetUsersByName(creds.Username)
	if err == models.ErrResourceNotFound {
		slog.Error("login: No users found", "error", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if err != nil {
		slog.Error("login: Could not get user", "username", creds.Username)
		w.WriteHeader(http.StatusUnauthorized)
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
		slog.Info("login: Invalid login", "username", creds.Username)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	tokenExpire := time.Now().Add(5 * time.Minute)
	tokenString, err := NewTokenString(u, tokenExpire)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		slog.Error("login:", "err", err)
		return
	}
	w.WriteHeader(http.StatusOK)
	responseJSON, err := json.Marshal(tokenString)
	if err != nil {
		slog.Error(err.Error())
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}

func fetchAllThoughts(w http.ResponseWriter, r *http.Request) {
	thoughts, err := models.AllThoughts()
	if err == models.ErrResourceNotFound {
		slog.Error("FetchAllThoughts: No thoughts found", "error", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if err != nil {
		slog.Error(err.Error())
	}

	responseJSON, err := json.Marshal(thoughts)
	if err != nil {
		slog.Error(err.Error())
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
