import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserModel } from "src/user/Schemas/user.model";

export class OnlyAdminGuard implements CanActivate{
    constructor(private reflector:Reflector){}

    canActivate(context: ExecutionContext): boolean  {
        const request = context.switchToHttp().getRequest<{user: UserModel}>()
        const user = request.user

        if(!user.isAdmin) throw new ForbiddenException('У вас нет прав')

        return user.isAdmin
    }
}