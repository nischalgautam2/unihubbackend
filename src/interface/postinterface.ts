import { Document, ObjectId } from "mongoose";
import { userinterface } from "./userinterface";
export interface postinterface extends Document {
  _id: string;
  createdAt: string;
  updatedAt: string;
  description: String;
  userId: userinterface;
  commentsCount: number;
  likesCount: number;
}
export interface originalpostinterface extends Document {
  _id: string;
  createdAt: string;
  updatedAt: string;
  description: String;
  userId: userinterface;
  likes: Array<String>;
  comments: Array<String>;
}
