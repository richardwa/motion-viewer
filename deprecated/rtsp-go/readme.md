# Prompt

write a go lang server to convert rtsp stream using ffmpeg to copy to mkv format and stream it to client with inline html to play the stream. take the rtsp url from query params. server and port should come from command line parameters.

# to cross compile (on powershell)

$env:GOOS = "linux"
$env:GOARCH = "amd64"
go build main.go -o bin/rtsp-mkv-linux

# go http server to remux rtsp into mkv using ffmpeg copy

go run main.go -addr=:8000
