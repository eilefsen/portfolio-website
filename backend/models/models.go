package models

import (
	"database/sql"
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

type Thought struct {
	Heading         string `json:"heading"`
	Body            string `json:"body"`
	DateTimeCreated string `json:"dateTimeCreated"`
	ID              uint32 `json:"id"`
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
