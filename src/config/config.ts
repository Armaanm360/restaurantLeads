import dotenv from 'dotenv';
import path from 'path';

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Env types
interface ENV {
  PORT: number | undefined;
  DB_NAME: string | undefined;
  DB_PASS: string | undefined;
  DB_USER: string | undefined;
  DB_PORT: string | undefined;
  DB_HOST: string | undefined;
  DB_NAME2: string | undefined;
  DB_HOST2: string | undefined;
  DB_USER2: string | undefined;
  DB_PASS2: string | undefined;
  AWS_S3_BUCKET: string | undefined;
  AWS_S3_ACCESS_KEY: string | undefined;
  AWS_S3_SECRET_KEY: string | undefined;
  MISTRAL_API_KEY: string | undefined;
}

// Config types
interface Config {
  PORT: number;
  DB_NAME: string;
  DB_PASS: string;
  DB_USER: string;
  DB_PORT: string;
  DB_HOST: string;
  DB_NAME2: string;
  DB_HOST2: string;
  DB_USER2: string;
  DB_PASS2: string;
  AWS_S3_BUCKET: string;
  AWS_S3_ACCESS_KEY: string;
  AWS_S3_SECRET_KEY: string;
  MISTRAL_API_KEY: string;
}

// Loading process.env as  ENV interface
const getConfig = (): ENV => {
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : 8484,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME2: process.env.DB_NAME2,
    DB_HOST2: process.env.DB_HOST2,
    DB_USER2: process.env.DB_USER2,
    DB_PASS2: process.env.DB_PASS2,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`);
    }
  }
  return config as Config;
};

export default getSanitzedConfig(getConfig());
