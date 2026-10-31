import { Server as SocketIOServer } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export const setIO = (io: SocketIOServer): void => {
  ioInstance = io;
};

export const getIO = (): SocketIOServer | null => {
  return ioInstance;
};

export const emitTaskEvent = (
  userId: string,
  event: 'task:created' | 'task:updated' | 'task:deleted' | 'task:cleared',
  payload: any
): void => {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, payload);
  }
};
