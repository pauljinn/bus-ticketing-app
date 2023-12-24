postgresinit:  
	@docker run --name postgres15 -p 5433:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=123456 -d postgres:15-alpine

# To run postgres terminal
postgres: 
	@docker exec -it postgres15 psql

