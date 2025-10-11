import { Message } from "./message";
import { User } from "./user";

export type ChatType = 'INDIVIDUAL' | 'GROUP';

export interface Chat {
  id: number;
  chatType: ChatType;
  chatName?: string;
  createdBy: number;
  createdAt: string;
  lastMessageAt: string;
  lastMessage?: Message;
  participants: ChatParticipant[];
  unreadCount: number;
}

export interface ChatParticipant {
  id: number;
  chatId: number;
  userId: number;
  joinedAt: string;
  role: 'ADMIN' | 'MEMBER';
  isMuted: boolean;
  user: User;
}

export interface CreateChatRequest {
  participantIds: number[];
  chatType: ChatType;
  chatName?: string;
}