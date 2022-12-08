import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { ChatSocketModule } from './socket/chat.socket.module';
import { ChatModule } from './chat.module';
import { GameModule } from './socket/game.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ChatSocketModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ChatModule,
    ChatSocketModule,
    // GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
