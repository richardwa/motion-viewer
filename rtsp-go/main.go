package main

import (
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os/exec"
)

func main() {
	addr := flag.String("addr", ":8000", "address to listen on")
	flag.Parse()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}

		w.Header().Set("Content-Type", "text/html")
		htmlContent := `
			<!DOCTYPE html>
			<html>
			<head>
				<title>Video Stream</title>
			</head>
			<body>
				<video autoplay muted src="/stream?url=rtsp://admin:tAThGG2NAr5vjY5@192.168.2.21/Streaming/Channels/101/" controls></video>
			</body>
			</html>
		`
		fmt.Fprint(w, htmlContent)
	})

	http.HandleFunc("/stream", func(w http.ResponseWriter, r *http.Request) {
		url := r.URL.Query().Get("url")
		if url == "" {
			http.Error(w, "Missing 'url' parameter", http.StatusBadRequest)
			return
		}

		cmd := exec.Command("ffmpeg", "-i", url, "-c", "copy", "-f", "matroska", "pipe:1")
		stdout, err := cmd.StdoutPipe()
		if err != nil {
			log.Println("Failed to create stdout pipe:", err)
			return
		}
		defer stdout.Close()

		if err := cmd.Start(); err != nil {
			log.Println("Failed to start ffmpeg:", err)
			return
		}
		defer cmd.Wait()

		w.Header().Set("Content-Type", "video/x-matroska")

		_, err = io.Copy(w, stdout)
		if err != nil {
			log.Println("Failed to stream video:", err)
			return
		}
	})

	log.Printf("Server running at http://localhost%s\n", *addr)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
