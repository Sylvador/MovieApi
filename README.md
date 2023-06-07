## Description

Movie API

## Installation

Для запуска необходим Docker.
В .development.env необходимо для переменных *_QUEUE заменить postfix на уникальный постфикс, чтобы избежать проблем с потерей сообщений в RabbitMQ, и добавить переменную FRONT_PORT, значением которой будет порт вашего frontend приложения

## Запуск приложения

```bash
docker-compose up
```

## Восстановление бэкапа бд

Эти действия выполнять после запуска контейнеров.

1. Узнаём id контейнеров postgres_movie и postgres_user
```bash
docker ps
```
2. Загружаем бэкап movie(Он уже находится в контейнере)
```bash
docker exec -i <ID КОНТЕЙНЕРА postgres_movie> pg_restore --verbose --clean --no-acl --no-owner -h localhost -U postgres -d movie /dbbackup/movie-backup.sql
```
3. Загружаем бэкап user
```bash
docker exec -i <ID КОНТЕЙНЕРА postgres_user> pg_restore --verbose --clean --no-acl --no-owner -h localhost -U postgres -d userdb /dbbackup/user-backup.sql
```
4. Готово!
## Swagger Документация

Документация по api находится на localhost:5000/api<br>
Каждый метод можно тестировать там же

## Тест

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
