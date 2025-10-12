import { CallType } from "../types/call";
import { User } from "../types/user";

// Main navigation types
export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Auth: undefined;
  Main: undefined;
  Chat: { chatId: string; chatName: string };
  IncomingCall: { user: User; callType: CallType };
  OutgoingCall: { user: User; callType: CallType };
  OngoingCall: { user: User; callType: CallType; isOutgoing: boolean };
  CallHistory: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Chats: undefined;
  Contacts: undefined;
  Profile: undefined;
  Calls: undefined;
};

export type ChatStackParamList = {
  ChatList: undefined;
  Chat: { chatId: string; chatName: string };
};

// Declare global namespace for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}