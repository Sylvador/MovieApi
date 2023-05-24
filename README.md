## Description

Movie API

## Installation

Для запуска необходим Docker.
В .development.env необходимо для переменных *_QUEUE заменить postfix на уникальный постфикс, чтобы избежать проблем с потерей сообщений в RabbitMQ, и добавить переменную FRONT_PORT, значением которой будет порт вашего frontend приложения

## Запуск приложения

```bash
docker-compose up
```

## Swagger Документация

Документация по api находится на localhost:5000/api<br>
Каждый метод можно тестировать же

## Тест

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
