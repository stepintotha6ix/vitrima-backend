import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {
  
 async ById(_id: string) {
  
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
