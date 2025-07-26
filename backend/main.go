package main

//create account
//login
//get username

import (
	"database/sql"
	"encoding/json"

	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"

	_ "github.com/lib/pq"
)

type AccountDetails struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Message struct {
	Text string `json:"text"`
}

func getenv(envName string) string {
	return os.Getenv(envName)
}

func main() {
	fmt.Println("App is started")
	godotenv.Load()
	// user := getenv("USER")
	password := getenv("PASSWORD")
	dbname := getenv("DBNAME")
	host := getenv("HOST")
	postgresPort := getenv("POSTGRESPORT")

	fmt.Println(password)

	mux := http.NewServeMux()

	connStr := fmt.Sprintf("user=postgres password=%s dbname=%s host=%s port=%s sslmode=disable", password, dbname, host, postgresPort)
	fmt.Println(connStr)
	conn, err := sql.Open("postgres", connStr)
	if err != nil {
		fmt.Println("error")
	}

	mux.HandleFunc("/create-account", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			fmt.Println("Not a post method")
		}

		var acc AccountDetails
		err := json.NewDecoder(r.Body).Decode(&acc)
		if err != nil {
			fmt.Println("yo shit fucked", err)
		}
		var userNameExists bool
		queryStr := "SELECT EXISTS(SELECT 1 FROM users WHERE user_id = $1)"
		queryError := conn.QueryRow(queryStr, acc.Username).Scan(&userNameExists)
		if queryError != nil {
			fmt.Println("there was an error: ", queryError)
			return
		}
		if userNameExists {
			w.WriteHeader(http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Username Already Exists",
			})
			fmt.Println("username is taken")
			fmt.Println("username is taken")
			return
		}

		query := "INSERT INTO users (user_id, password) VALUES ($1, $2)"
		_, queryErr := conn.Exec(query, acc.Username, acc.Password)
		if queryErr != nil {
			fmt.Println("yo shit fucked", queryErr)
		}
		fmt.Println("user is created")
	})

	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			fmt.Println("Not a post method")
		}

		var acc AccountDetails
		err := json.NewDecoder(r.Body).Decode(&acc)
		if err != nil {
			fmt.Println("Did not decode", err)
		}
		var userExists bool
		queryStr := "SELECT EXISTS(SELECT 1 FROM users WHERE user_id = $1 AND password = $2)"
		queryError := conn.QueryRow(queryStr, acc.Username, acc.Password).Scan(&userExists)
		fmt.Println("users exists: ", userExists)
		if queryError != nil {
			fmt.Println("there was an error with querying: ", queryError)
			return
		}
		if !userExists {
			w.WriteHeader(http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{
				"message": "user does not exists",
			})
			fmt.Println("user does not exists")
			return
		}
		fmt.Println("User does exist")

	})

	mux.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "You fucked up", http.StatusMethodNotAllowed)
			return
		}
		fmt.Println("Hello")
	})

	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(mux)

	serverErr := http.ListenAndServe(":8080", handler)
	if serverErr != nil {
		fmt.Println(serverErr)
	}

}
