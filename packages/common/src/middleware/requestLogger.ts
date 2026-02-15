import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import pinoHttp from 'pino-http';
import { httpLogger } from '@/common/logging/logger';

const getLogLevel = (status: number) => {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warn';
  if (status >= 300) return 'info';

  return 'info';
};

const addRequestId = (req: Request, res: Response, next: NextFunction) => {
  const existingId = req.headers['x-request-id'] as string;
  const requestId = existingId || randomUUID();

  // Set for downstream use
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);

  next();
};

// HTTP logger middleware
const middlewareLogger = pinoHttp({
  logger: httpLogger,
  customLogLevel: (_req, res) => getLogLevel(res.statusCode),
  genReqId: (req) => req.headers['x-request-id'] as string,
  customSuccessMessage: (req) => `${req.method} ${req.url} completed`,
  customErrorMessage: (_req, res) => `Request failed with status code: ${res.statusCode}`,
  // Only log response bodies in development
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      id: req.id,
    }),
  },
});

const captureResponseBody = (_req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  res.send = function (body) {
    res.locals.responseBody = body;
    return originalSend.call(this, body);
  };

  next();
};

export default [addRequestId, captureResponseBody, middlewareLogger];
