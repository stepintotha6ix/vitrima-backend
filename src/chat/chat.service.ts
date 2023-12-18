// chat.service.ts

import { Injectable } from '@nestjs/common';
import { Chat } from './chat.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat') private readonly chatModel: Model<Chat>,
    
	) {}


  async createChat(senderId: string, receiverId: string ): Promise<Chat> {
    const newChat = new this.chatModel({
      members: [senderId, receiverId],
      
    });

    return newChat.save();
  }

  async getChatsByUserId(userId: string): Promise<Chat[]> {
    return this.chatModel
      .find({
        members: { $in: [userId] },
      })
      .populate('members') // Call populate separately after the find query
      .exec();
  }

  async findChatByUserIds(firstUserId: string, secondUserId: string): Promise<Chat> {
    return this.chatModel.findOne({
      members: { $all: [firstUserId, secondUserId] },
    });
  }
}
