import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Intra42AuthGuard } from 'src/guards/auth.guard';
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
  handleRedirect(@Req() req: any) {
    return this.authService.logUserIn(req);
  }
}
