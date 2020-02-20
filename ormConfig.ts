import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { DatabaseType } from 'typeorm';

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;
const DB_TYPE: DatabaseType = 'mysql';

export const ormConfig: MysqlConnectionOptions = {
    type: DB_TYPE,
    host: DB_HOST,
    port: +DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [__dirname + '/src/database/entity/**/{*.ts,*.js}'],
    synchronize: true, // dont use in prod
    logging: false // this is personal preference
};
