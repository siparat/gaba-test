# Запуск

## Клонирование репозитория
```bash
git clone https://github.com/siparat/gaba-test
cd gaba-test
```

## Клонирование .env
```bash
cp .env.example .env
```

## Поднятие бд
```bash
docker compose up -d
```

## Установка зависимостей
```bash
npm i
```

## Активация миграций
```bash
npm run migrate:deploy
```

## Генерация типов Prisma
```bash
npm run generate
```

## Запуск
```bash
npm run build
npm run start:prod
```

## Swagger
<a href="http://localhost:3000/openapi">http://localhost:3000/openapi</a>

## Запуск тестов
```bash 
npm run test
```