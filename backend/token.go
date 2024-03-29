package main

import (
	"os"
	"time"

	"eilefsen.net/backend/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type CustomClaims struct {
	jwt.RegisteredClaims
	SuperUser bool `json:"superUser"`
}

type JWTSettings struct {
	SigningMethod jwt.SigningMethod
	Key           []byte
}

var settings = JWTSettings{
	SigningMethod: jwt.SigningMethodHS256,
	Key:           []byte(uuid.New().String()),
}

func NewToken(u models.User) *jwt.Token {
	expirationTime := time.Now().Add(5 * time.Minute)
	claims := CustomClaims{
		SuperUser: u.SuperUser,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   u.Username,
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(settings.SigningMethod, claims)
	return token
}

func NewTokenString(u models.User, expirationTime time.Time) (string, error) {
	claims := CustomClaims{
		SuperUser: u.SuperUser,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   u.Username,
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(settings.SigningMethod, claims)
	tokenString, err := token.SignedString(settings.Key)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
