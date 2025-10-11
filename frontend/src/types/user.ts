export interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber?: string;
  displayName: string;
  profilePicture?: string;
  status: string;
  lastSeen: string;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  status?: string;
}