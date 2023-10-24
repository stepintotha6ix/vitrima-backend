import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
	HttpCode,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto, LoginDto } from './dto/auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() createAuthDto: AuthDto) {
		return this.authService.register(createAuthDto)
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(@Body() tokenDto: RefreshTokenDto) {
		return this.authService.getNewTokens(tokenDto)
	}
	
}
