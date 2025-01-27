import config from './../config/config';
import knex from 'knex';

const createDbCon = () => {
  console.log('new pool connection...');
  const connection = knex({
    client: 'pg',
    connection: {
      host: config.DB_HOST,
      port: parseInt(config.DB_PORT),
      user: config.DB_USER,
      password: config.DB_PASS,
      database: config.DB_NAME,
      dateStrings: true,
      // ssl: {
      //   rejectUnauthorized: false,
      // },
    },
    pool: {
      min: 0,
      max: 100,
    },
  });

  console.log('Shanta Property Database Connected');
  return connection;
};

export const db = createDbCon();
