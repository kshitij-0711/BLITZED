import "dotenv/config";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const ENV = {
  PORT: getEnvVar("PORT"),
  MONGO_URI: getEnvVar("MONGO_URI"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  NODE_ENV: getEnvVar("NODE_ENV"),
  CLIENT_URL: getEnvVar("CLIENT_URL"),
  RESEND_API_KEY: getEnvVar("RESEND_API_KEY"),
  EMAIL_FROM: getEnvVar("EMAIL_FROM"),
  EMAIL_FROM_NAME: getEnvVar("EMAIL_FROM_NAME"),
  CLOUDINARY_CLOUD_NAME: getEnvVar("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnvVar("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnvVar("CLOUDINARY_API_SECRET"),
  ARCJET_KEY: getEnvVar("ARCJET_KEY"),
  ARCJET_ENV: getEnvVar("ARCJET_ENV"),
};
