import { prop } from "@typegoose/typegoose"

import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export interface UserModel extends Base {}



export class WorkModel extends TimeStamps {
  @prop()
  title: string
  @prop()
  description: string
  @prop()
  images: string
  @prop()
  tags: string[]
}


