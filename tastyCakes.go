package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		template.Must(template.New("index.html").ParseFiles("index.html")).Execute(w, nil)
	}
}

func main() {
	fileServer := http.FileServer(http.Dir("static"))
	frontend := http.FileServer(http.Dir("dist"))
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))
	http.Handle("/dist/", http.StripPrefix("/dist/", frontend))
	http.HandleFunc("/", indexHandler)
	port := os.Getenv("port")
	if port == "" {
		port = "8000"
	}
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
