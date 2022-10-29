import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallBack } from 'passport-42';
import { UserDTO } from 'src/dto/user.dto';

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, 'intra42') {
  constructor() {
    super({
      clientID: process.env.UID_42,
      clientSecret: process.env.SECRET_42,
      callbackURL: process.env.REDIRECT_URI_42,
      scope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallBack,
  ): Promise<void> {
    const user: UserDTO = {
      nickname: profile.username,
      twofa_enabled: false,
      avatar: profile._json.image_url,
      wins: 0,
      losses: 0,
    };
    done(null, { ...user, accessToken });
  }
}
