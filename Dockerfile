FROM golang:1.24

WORKDIR backend/app

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./

RUN go build -o app
RUN go run backend/main.go


# Optional: Log files that exist
RUN ls -l /app

EXPOSE 8080
CMD ["sh", "-c", "echo 'starting container' && ls -l /app && ./app"]

