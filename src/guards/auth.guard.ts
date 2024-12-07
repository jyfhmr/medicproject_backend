import { CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject('AUTH_SERVICE')
        private readonly authClient: ClientProxy,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const req = context.switchToHttp().getRequest();

        try {
            const res = await this.authClient
                .send(
                    { role: 'auth', cmd: 'check' },
                    { jwt: req.headers['authorization']?.split(' ')[1] },
                )
                .pipe(timeout(5000))
                .toPromise();

            req['user'] = res;
            return res;
        } catch (err) {
            Logger.error(err);
            return false;
        }
    }
}
