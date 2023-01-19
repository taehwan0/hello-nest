import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'buddy',
  password: '',
  database: 'nest',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
