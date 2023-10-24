import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './Schemas/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class UserService {
  
constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>){}

  async ById(_id: string) {
    const user = await this.userModel.findById(_id)
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
