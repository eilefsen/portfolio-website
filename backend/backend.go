package main

import (
	"log/slog"
	"net/http"
	"os"
	"time"

	"eilefsen.net/backend/models"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/httprate"
	"github.com/go-sql-driver/mysql"
	"github.com/lmittmann/tint"
)

func main() {
	slog.SetDefault(slog.New(
		tint.NewHandler(os.Stdout, &tint.Options{
			Level: slog.LevelDebug,
		}),
	))
	dbcfg := mysql.Config{
		User:                 os.Getenv("DBUSER"),
		Passwd:               os.Getenv("DBPASS"),
		Net:                  "tcp",
		Addr:                 "127.0.0.1:3306",
		DBName:               os.Getenv("DBNAME"),
		AllowNativePasswords: true,
	}
	err := models.InitDB(dbcfg.FormatDSN())
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}
	slog.Info("DB connected.", "Addr", dbcfg.Addr, "DBName", dbcfg.DBName)

	rt := chi.NewRouter()
	rt.Use(middleware.Logger)
	rt.Use(httprate.Limit(
		20,            // requests
		5*time.Second, // per duration
		httprate.WithLimitHandler(func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, "You've been rate limited", http.StatusTooManyRequests)
		}),
	))
	rt.Get("/api/thoughts", fetchAllThoughts)
	rt.Post("/api/auth/login", login)
	rt.Post("/api/thoughts/create", BasicAuth(createThought))
	http.ListenAndServe(":"+os.Getenv("BACKEND_PORT"), rt)
}
