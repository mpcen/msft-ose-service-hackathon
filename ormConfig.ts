import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { DatabaseType } from 'typeorm';

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
const DB_TYPE: DatabaseType = 'mysql';
const DB_PORT = 3306;

export const ormConfig: MysqlConnectionOptions = {
    type: DB_TYPE,
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [__dirname + '/src/entity/**/*.ts'],
    synchronize: true, // dont use in prod
    logging: false // this is personal preference
};
