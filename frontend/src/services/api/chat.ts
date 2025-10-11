import { Chat, CreateChatRequest, PaginatedResponse } from '../../types/chat';
import { Message, SendMessageRequest } from '../../types/message';
import api from './index';
//import { Chat, Message, SendMessageRequest, CreateChatRequest, PaginatedResponse } from '../../types';

export const chatAPI = {
  getChats: async (): Promise<Chat[]> => {
    try {
      const response = await api.get<Chat[]>('/chats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch chats');
    }
  },

  getChat: async (chatId: number): Promise<Chat> => {
    try {
      const response = await api.get<Chat>(`/chats/${chatId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch chat');
    }
  },

  createChat: async (chatData: CreateChatRequest): Promise<Chat> => {
    try {
      const response = await api.post<Chat>('/chats', chatData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create chat');
    }
  },

  getMessages: async (chatId: number, page: number = 0, size: number = 50): Promise<PaginatedResponse<Message>> => {
    try {
      const response = await api.get<PaginatedResponse<Message>>(`/chats/${chatId}/messages?page=${page}&size=${size}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  },

  sendMessage: async (chatId: number, message: SendMessageRequest): Promise<Message> => {
    try {
      const response = await api.post<Message>(`/chats/${chatId}/messages`, message);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  },

  deleteMessage: async (messageId: number): Promise<void> => {
    try {
      await api.delete(`/messages/${messageId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete message');
    }
  },

  editMessage: async (messageId: number, content: string): Promise<Message> => {
    try {
      const response = await api.put<Message>(`/messages/${messageId}`, { content });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to edit message');
    }
  },
};