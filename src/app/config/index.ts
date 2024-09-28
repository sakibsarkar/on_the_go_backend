import dotenv from "dotenv";
dotenv.config();
const Config = {
  dbUser: process.env.MONGO_NAME,
  dbPass: process.env.MONGO_PASS,
  dbName: process.env.MONGO_DB,
  bcrypt_salt_rounds: process.env.SALT_ROUND,
  nodeEnv: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
};

export default Config;
