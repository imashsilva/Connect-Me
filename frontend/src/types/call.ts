import { User } from "./user";

export type CallType = 'AUDIO' | 'VIDEO';
export type CallStatus = 'DIALING' | 'RINGING' | 'ONGOING' | 'ENDED' | 'MISSED' | 'REJECTED';

export interface Call {
  id: string;
  callType: CallType;
  status: CallStatus;
  participants: CallParticipant[];
  startTime: string;
  endTime?: string;
  duration?: number; // in seconds
  isOutgoing: boolean;
}

export interface CallParticipant {
  userId: number;
  user: User;
  hasJoined: boolean;
  joinedAt?: string;
  leftAt?: string;
}

export interface CallHistory {
  id: string;
  callType: CallType;
  status: CallStatus;
  participants: User[];
  startTime: string;
  endTime?: string;
  duration?: number;
  isOutgoing: boolean;
}