# 本地运行


## 安装 `POSTGRES`

复制一份 `.env.example` 并将其重命名为 `.env`

```env
# 数据库地址
DATABASE_URL="postgresql://user:password@localhost:5432/nextpush"



# Access passsword
CODE=""

# Postgres
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=nextpush

# 文件上传token
BLOB_READ_WRITE_TOKEN=""
```

安装依赖并启动，推荐使用 `pnpm`

```sh
pnpm i
pnpm run  dev
```

用浏览器打开 http://localhost:3000


### Docker部署
本项目包含了 `Dockerfile` 和 `docker-compose.yml` 文件。
`Dockfile` 用于构建 `nextpush` 服务image，`docker-compose.yml` 用于启动 `nextpush` 和一个 `PostgresSQl`。

快速启动项目，执行以下命令：
```sh
docker compose up
```

用浏览器打开 http://localhost:3000 。