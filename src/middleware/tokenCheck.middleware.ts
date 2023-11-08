import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class tokenCheckMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService ){}
  async use(req, res, next) {
    let token = req.headers;
console.log(token)
        if(!token) {
            throw new HttpException('token is required', 401);
        }

        if (!token.match(/Bearer\s(\S+)/)) {
            throw new HttpException('Unsupported token', 401);
        }
        const [ tokenType, tokenValue ] = token.split(' ');
        try {
            const result = await this.authService.issueTokenPair(tokenValue);
            req.user = result;
            next();
        } catch (e) {
            throw new HttpException(e.message, 401);
        }
    // Проверка токена авторизации или других методов аутентификации
    // Если пользователь аутентифицирован, вы можете сохранить его данные в req.user
    // Предполагаем, что здесь хранятся данные аутентифицированного пользователя
    next();
  }
}