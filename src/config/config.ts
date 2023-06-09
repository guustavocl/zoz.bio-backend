import dotenv from "dotenv";
dotenv.config();

const list: { [key: string]: any } = {
  production: {
    host: process.env.PROD_MONGO_HOST,
    port: process.env.PROD_MONGO_PORT,
    db: process.env.PROD_MONGO_DB || "",
    username: process.env.PROD_MONGO_USERNAME,
    password: process.env.PROD_MONGO_PASSWORD,
  },
  development: {
    host: process.env.DEV_MONGO_HOST,
    port: process.env.DEV_MONGO_PORT,
    db: process.env.DEV_MONGO_DB || "",
    username: process.env.DEV_MONGO_USERNAME,
    password: process.env.DEV_MONGO_PASSWORD,
  },
};

const getMongoUrl = (mode = "development") => {
  return `mongodb://${list[mode].username}:${list[mode].password}@${list[mode].host}:${list[mode].port}/${list[mode].db}?authSource=admin`;
};

export const config = {
  mongo: {
    url: getMongoUrl(process.env.NODE_MODE),
  },
  server: {
    port: process.env.NODE_MODE === "production" ? 3000 : 3100,
  },
  apiUrl: process.env.NODE_MODE === "production" ? "https://api.zoz.bio/" : "http://127.0.0.1:3100/",
};

// example url: mongodb://user:passwd@host:27117/zoz?authSource=admin
