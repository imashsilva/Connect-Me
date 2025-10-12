import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  async connect(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const SOCKET_URL = 'https://corrie-variolitic-impolitely.ngrok-free.dev';
      
      this.socket = io(SOCKET_URL, {
        auth: {
          token: token,
        },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to WebSocket');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from WebSocket');
      });

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();