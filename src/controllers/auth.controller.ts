import { Controller, Get, Req, Res, UseGuards, Param } from '@nestjs/common';
import { Response } from 'express';
import { Intra42AuthGuard } from 'src/guards/intra42.guard';
import { AuthService } from 'src/services/auth.service';
import { Jwt2faGuard } from 'src/guards/2fajwt.guard';
import { ReqUser } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { RegisterjwtGuard } from 'src/guards/registerjwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('42/login')
  @UseGuards(Intra42AuthGuard)
  handleLogin() {
    return;
  }

  @Get('42/redirect')
  @UseGuards(Intra42AuthGuard)
  handleRedirect(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.logUserIn(req, res, false);
  }

  @Get('42/register/:nickname/:avatar')
  @UseGuards(RegisterjwtGuard)
  handleRedirectRegister(
    @ReqUser() user: User,
    @Res({ passthrough: true }) res: Response,
    @Param('nickname') nickname: string,
    @Param('avatar') avatar: string,
  ) {
    if (nickname.length > 10) {
<<<<<<< HEAD
      res.redirect('http://localhost:3000/register/?error=true');
=======
      res.redirect('http://localhost:3000/register/?error=2');
>>>>>>> da65c44fd5d43479324a1108252ade77f826220e
      return;
    }
    if (avatar !== 'default')
      user.avatar =
        'https://avataruserstorage.blob.core.windows.net/avatarimg/' + avatar;
    user.twofa_secret = nickname;
    return this.authService.logUserIn({ user: user }, res, true);
  }

  @Get('42/2faredirect/:token')
  @UseGuards(Jwt2faGuard)
  handle2faRedirect(
    @ReqUser() user: User,
    @Res({ passthrough: true }) res: Response,
    @Param('token') token: string,
  ) {
    return this.authService.valide2fa(user, res, token);
  }

  @Get('logout')
  logoutAction(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie('jwt', { httpOnly: true });
  }
}
