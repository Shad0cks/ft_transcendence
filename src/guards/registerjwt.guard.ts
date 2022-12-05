import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RegisterjwtGuard extends AuthGuard('registerjwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
