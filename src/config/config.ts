import dotenv from "dotenv";
dotenv.config();

let list: { [key: string]: any } = {
  prod: {
    host: process.env.PROD_MONGO_HOST,
    port: process.env.PROD_MONGO_PORT,
    db: process.env.PROD_MONGO_DB || "",
    username: process.env.PROD_MONGO_USERNAME,
    password: process.env.PROD_MONGO_PASSWORD,
  },
  dev: {
    host: process.env.DEV_MONGO_HOST,
    port: process.env.DEV_MONGO_PORT,
    db: process.env.DEV_MONGO_DB || "",
    username: process.env.DEV_MONGO_USERNAME,
    password: process.env.DEV_MONGO_PASSWORD,
  },
};

const getMongoUrl = (mode = "dev") => {
  return `mongodb://${list[mode].username}:${list[mode].password}@${list[mode].host}:${list[mode].port}/${list[mode].db}?authSource=admin`;
};

export const config = {
  mongo: {
    url: getMongoUrl(process.env.NODE_MODE),
  },
  server: {
    port: process.env.NODE_MODE === "prod" ? 3000 : 3100,
  },
  apiUrl:
    process.env.NODE_MODE === "prod"
      ? "https://api.zoz.gg/"
      : "http://127.0.0.1:3100/",
};

// example url: mongodb://user:passwd@host:27117/zoz?authSource=admin
