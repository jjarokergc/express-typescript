import pino from 'pino';

const baseLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
});

// Application logging
export const appLogger = baseLogger;

// HTTP logging
export const httpLogger = baseLogger.child({
  level: 'warn', // process.env.HTTP_LOG_LEVEL || 'warn',
  component: 'http',
});
