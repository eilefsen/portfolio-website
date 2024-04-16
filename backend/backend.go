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

func init() {
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
}

func main() {
	rt := chi.NewRouter()
	rt.Use(middleware.Logger)
	rt.Use(httprate.Limit(
		20,            // requests
		5*time.Second, // per duration
		httprate.WithLimitHandler(func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, "You've been rate limited", http.StatusTooManyRequests)
		}),
	))

	// protected routes
	rt.Group(func(rt chi.Router) {
		rt.Post("/api/thoughts/create", SuperUserAuth(createThought))
		rt.Post("/api/img/upload", SuperUserAuth(uploadPicture))
		rt.Post("/api/auth/status", TokenAuth(authStatusHandler))
		rt.Post("/api/auth/refresh", authRefreshHandler)
	})
	// unprotected routes
	rt.Group(func(rt chi.Router) {
		rt.Get("/api/thoughts", fetchAllThoughts)
		rt.Get("/api/img/all", fetchAllPictures)
		rt.Post("/api/auth/login", login)
		rt.Post("/api/auth/logout", logoutHandler)
	})
	http.ListenAndServe(":"+os.Getenv("BACKEND_PORT"), rt)
}
