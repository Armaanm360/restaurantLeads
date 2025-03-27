"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db2 = exports.db = void 0;
const config_1 = __importDefault(require("./../config/config"));
const knex_1 = __importDefault(require("knex"));
const createDbCon = () => {
    console.log('New MySQL pool connection...');
    const connection = (0, knex_1.default)({
        client: 'mysql2',
        connection: {
            host: config_1.default.DB_HOST,
            port: parseInt(config_1.default.DB_PORT),
            user: config_1.default.DB_USER,
            password: config_1.default.DB_PASS,
            database: config_1.default.DB_NAME,
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
    const connection = (0, knex_1.default)({
        client: 'mysql2',
        connection: {
            host: config_1.default.DB_HOST2,
            port: parseInt(config_1.default.DB_PORT),
            user: config_1.default.DB_USER2,
            password: config_1.default.DB_PASS2,
            database: config_1.default.DB_NAME2,
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
exports.db = createDbCon();
exports.db2 = createDbCon2();
