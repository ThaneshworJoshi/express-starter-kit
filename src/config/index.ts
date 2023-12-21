import dotenv from 'dotenv'

dotenv.config()

export const configKeys = {
  PORT: process.env.PORT ?? '',

  MONGO_DB_URL: process.env.DATABASE! ?? '',

  DB_NAME: process.env.DB_NAME ?? '',

  JWT_SECRET: process.env.JWT_SECRET ?? '',

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET! ?? '',

  NODE_ENV: process.env.NODE_ENV ?? '',

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',

  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',

  GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL ?? '',
}

export default configKeys
