import config from './../config/config';
import knex from 'knex';

const createDbCon = () => {
  console.log('New MySQL pool connection...');
  const connection = knex({
    client: 'mysql2',
    connection: {
      host: config.DB_HOST,
      port: parseInt(config.DB_PORT),
      user: config.DB_USER,
      password: config.DB_PASS,
      database: config.DB_NAME,
      timezone: 'UTC',
      supportBigNumbers: true,
      dateStrings: true,
    },
    pool: {
      min: 0,
      max: 100,
    },
  });

  console.log('MySQL Server 1 Connected');
  return connection;
};

const createDbCon2 = () => {
  console.log('New MySQL pool connection...');
  const connection = knex({
    client: 'mysql2',
    connection: {
      host: config.DB_HOST2,
      port: parseInt(config.DB_PORT),
      user: config.DB_USER2,
      password: config.DB_PASS2,
      database: config.DB_NAME2,
      timezone: 'UTC',
      supportBigNumbers: true,
      dateStrings: true,
    },
    pool: {
      min: 0,
      max: 100,
    },
  });

  console.log('MySQL Server 2 Connected');
  return connection;
};

export const db = createDbCon();
export const db2 = createDbCon2();
