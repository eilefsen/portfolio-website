package models

import (
	"database/sql"
	"log/slog"
)

var db *sql.DB

func InitDB(dataSourceName string) error {
	var err error
	db, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		return err
	}
	return db.Ping()
}

type ThoughtNoID struct {
	Heading         string `json:"heading"`
	Body            string `json:"body"`
	DateTimeCreated string `json:"dateTimeCreated"`
}
type Thought struct {
	ThoughtNoID
	ID uint32 `json:"id"`
}

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type User struct {
	Credentials
	SuperUser bool   `json:"superuser"`
	ID        uint32 `json:"id"`
}

func GetUser(id uint32) (User, error) {
	var u User
	row := db.QueryRow("select * from user where user.id = ?", id)
	err := row.Scan(
		&u.ID,
		&u.Username,
		&u.Password,
		&u.SuperUser,
	)
	if err != nil {
		return User{}, err
	}
	return u, err
}

func GetUserByName(name string) (User, error) {
	var u User
	row := db.QueryRow("select * from user where user.username = ?", name)
	err := row.Scan(
		&u.ID,
		&u.Username,
		&u.Password,
		&u.SuperUser,
	)
	if err != nil {
		return User{}, err
	}
	return u, err
}

func AllThoughts() ([]Thought, error) {
	var thoughts []Thought
	rows, err := db.Query("select * from thought")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var t Thought
		err := rows.Scan(
			&t.ID,
			&t.Heading,
			&t.Body,
			&t.DateTimeCreated,
		)
		if err != nil {
			return nil, err
		}
		thoughts = append(thoughts, t)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if len(thoughts) == 0 {
		return nil, ErrResourceNotFound
	}
	return thoughts, err
}

func NewThought(thought ThoughtNoID) (Thought, error) {
	var t Thought
	res, err := db.Exec(
		`INSERT INTO thought (heading, body, datetime_created) VALUES ( ?, ?, ?)`,
		thought.Heading,
		thought.Body,
		thought.DateTimeCreated,
	)
	if err != nil {
		return t, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return t, err
	}
	t.ID = uint32(id)
	t.ThoughtNoID = thought
	slog.Info("models.NewThought", "t", t)
	return t, nil
}
