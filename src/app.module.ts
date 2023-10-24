import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoDbConfig } from './config/mongo.config';
import { WorkModule } from './work/work.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoDbConfig
    }),
    AuthModule,
    UserModule,
    WorkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
