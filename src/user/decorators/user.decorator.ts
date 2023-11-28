import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { User } from '../Schemas/user.schema'

type TypeData = keyof User

export const UserDec = createParamDecorator(
	(data: TypeData, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
	
		const user = request.user
		
		return data ? user[data] : user
	}
)
