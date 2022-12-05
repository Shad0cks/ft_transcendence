import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { Intra42Strategy } from './strategies/Intra42.startegy';
import { UserModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/Jwt.strategy';
import { twofaJwtStrategy } from './strategies/2faJwt.strategy';
import { registerJwtStrategy } from './strategies/registerJwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    Intra42Strategy,
    JwtStrategy,
    twofaJwtStrategy,
    registerJwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
