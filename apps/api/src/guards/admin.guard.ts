import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from 'express';
import { JwtPayload } from "@app/common/types";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.get('authorization')?.replace('Bearer', '').trim();
    if (!token) throw new ForbiddenException('Forbidden');
    const user = this.jwtService.verify(token) as JwtPayload;
    return user.isAdmin;
  }
}

