import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { getMongoDbConfig } from './config/mongo.config';
import { WorkModule } from './work/work.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:  getMongoDbConfig
    }),
    AuthModule,
    UserModule,
    WorkModule,
    HttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
