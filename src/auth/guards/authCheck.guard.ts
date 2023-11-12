import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Contractor, User } from "src/user/Schemas/user.schema";

export class AuthCheckContractor implements CanActivate{
    constructor(private reflector:Reflector){}

    canActivate(context: ExecutionContext): any  {
        const request = context.switchToHttp().getRequest<{contractor: Contractor}>()
        const user = request.contractor

        if(!user) throw new ForbiddenException('У вас нет прав')

        return user.isContractor
    }
}