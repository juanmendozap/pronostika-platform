import { Server } from 'socket.io';
import { logger } from '../utils/logger';

let io: Server;

export const initSocket = (socketServer: Server) => {
  io = socketServer;

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on('join_bet', (betId: string) => {
      socket.join(`bet_${betId}`);
      logger.info(`User ${socket.id} joined bet ${betId}`);
    });

    socket.on('leave_bet', (betId: string) => {
      socket.leave(`bet_${betId}`);
      logger.info(`User ${socket.id} left bet ${betId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });
};

export const emitBetUpdate = (betId: string, data: any) => {
  if (io) {
    io.to(`bet_${betId}`).emit('bet_updated', data);
  }
};

export const emitNewBet = (data: any) => {
  if (io) {
    io.emit('new_bet', data);
  }
};