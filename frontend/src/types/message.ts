import { User } from "./user";

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  messageType: MessageType;
  content: string;
  mediaUrl?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  replyToMessageId?: number;
  status?: MessageStatus;
  sender: User;
}

export interface SendMessageRequest {
  content: string;
  messageType: MessageType;
  replyToMessageId?: number;
}

export interface MessageStatusUpdate {
  messageId: number;
  userId: number;
  status: MessageStatus;
}