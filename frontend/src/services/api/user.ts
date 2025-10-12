import { ApiResponse } from '../../types';
import { User } from '../../types/user';
import api from './index';

export const userAPI = {
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  getUser: async (userId: number): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
    return response.data.data;
  },
};