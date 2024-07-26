## Intro

This project requires you to get:

- Discord bot ID
- Discord channel ID
- Discord Server ID
- Giphy api key, as per https://developers.giphy.com/docs/api/endpoint#trending

## Setup

Create your .env file and populate it with:

    DATABASE_URL=./data/database.db
    DISCORD_BOT_ID=MarstMA.GjrstpB.zlRarstFpZp7arst(example)
    DISCORD_CHANNEL_ID=123456890(example)
    DISCORD_SERVER_ID=1234567890(example)
    GIPHY_API_KEY=5h3424u35h2ienk435kin(example)

```bash
npm install

```

## Run migrations

```bash
npm run migrate:latest

```

## Running the tests

```bash
npm run test

```

## Running the server

In development mode:

```bash
npm run dev
```

## Playing around

Run the server, customize and then send API requests from the REST client file:
rest.client.test.http
