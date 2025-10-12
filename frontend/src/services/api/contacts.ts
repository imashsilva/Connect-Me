import api from './index';
import { ApiResponse } from '../../types';
import { User } from '../../types/user';

export const contactsAPI = {
  getContacts: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/contacts');
    return response.data.data;
  },

  addContact: async (userId: number, contactName?: string): Promise<void> => {
    await api.post('/contacts', { 
      contactUserId: userId, 
      contactName 
    });
  },

  removeContact: async (contactId: number): Promise<void> => {
    await api.delete(`/contacts/${contactId}`);
  },

  blockContact: async (contactId: number): Promise<void> => {
    await api.put(`/contacts/${contactId}/block`);
  },

  unblockContact: async (contactId: number): Promise<void> => {
    await api.put(`/contacts/${contactId}/unblock`);
  },
};