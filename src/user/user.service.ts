import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserSchema } from './Schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  
constructor(@InjectModel('User') private readonly UserSchema){}

  async ById(_id: string) {
    const user = await this.UserSchema.findById(_id)
    if(!user) throw new NotFoundException('Пользователь не найден')
    
    return user
  }

  findAll() {
    return `This action returns all user`;
  }

 

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
