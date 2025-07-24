FROM golang:1.24

WORKDIR /app

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./

RUN go build -o app || (echo "Build failed!" && exit 1)
RUN chmod +x app

# Optional: Log files that exist
RUN ls -l /app

EXPOSE 8080
CMD ["sh", "-c", "echo 'starting container' && ls -l /app && ./app"]

