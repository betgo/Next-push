# Local Run

## Install `POSTGRES`

Make a copy of `.env.example` and rename it to `.env`

```env
# Database URL
DATABASE_URL="postgresql://user:password@localhost:5432/nextpush"



# Access password
CODE=""

# Postgres
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=nextpush

# File upload token
BLOB_READ_WRITE_TOKEN=""
```

安装依赖并启动，推荐使用 `pnpm`

```sh
pnpm i
pnpm run  dev
```

Open in browser <http://localhost:3000>

### Docker Deployment

This project includes `Dockerfile` and `docker-compose.yml` files. The `Dockerfile` is used to build the nextpush service image, and `docker-compose.yml` is used to start the `nextpush` and a `PostgresSQL` instance.

To quickly start the project, execute the following command:

```sh
docker compose up
```

Open in browser <http://localhost:3000>
