import { Controller, Get, Req, Res, UseGuards, Param } from '@nestjs/common';
import { Response } from 'express';
import { Intra42AuthGuard } from 'src/guards/intra42.guard';
import { AuthService } from 'src/services/auth.service';
import { Jwt2faGuard } from 'src/guards/2fajwt.guard';
import { ReqUser } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';

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
    return this.authService.logUserIn(req, res);
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
