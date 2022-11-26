import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Jwt2faGuard extends AuthGuard('2fajwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
