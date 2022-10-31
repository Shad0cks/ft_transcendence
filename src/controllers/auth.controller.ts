import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Intra42AuthGuard } from 'src/guards/intra42.guard';
import { AuthService } from 'src/services/auth.service';

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

  @Get('logout')
  logoutAction(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie('jwt', { httpOnly: true });
  }
}
