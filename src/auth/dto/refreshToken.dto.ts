import { IsString } from "class-validator";

export class RefreshTokenDto{
    @IsString({message: 'токен не является строкой'})
    refreshToken: string 
}