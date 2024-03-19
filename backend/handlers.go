package main

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"eilefsen.net/backend/models"
)

func FetchAllThoughts(w http.ResponseWriter, r *http.Request) {
	thoughts, err := models.AllThoughts()
	if err == models.ErrResourceNotFound {
		slog.Error("FetchAllThoughts: No thoughts found", "error", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if err != nil {
		slog.Error(err.Error())
	}
	slog.Debug("FetchAllThoughts", "thoughts", thoughts)

	responseJSON, err := json.Marshal(thoughts)
	if err != nil {
		slog.Error(err.Error())
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}
