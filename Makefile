APP	= ft_transcendence

all: $(APP)

$(APP):
	docker-compose up --build -d

db:
	docker-compose up --build -d db

down:
	docker-compose down

reset-db: down db

re: down all