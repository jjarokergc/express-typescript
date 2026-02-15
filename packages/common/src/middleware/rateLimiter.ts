// Rate Limiter factory function
//
import type { Request } from 'express';
import type { Options } from 'express-rate-limit'; // for better type safety
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';

export function createRateLimiter(options: Partial<Options>) {
  return rateLimit({
    // Disable the `X-RateLimit-*` headers if legacyHeaders is false
    legacyHeaders: options?.legacyHeaders ?? false,
    // Max number of connections during the windowMs time frame
    limit: options?.limit ?? 100,
    // Message to send back when max is exceeded
    message: options?.message ?? {
      error: 'Too many requests, please try again later.',
    },
    // Return rate limit info in the `RateLimit-*` headers
    standardHeaders: options?.standardHeaders ?? true,
    // Time frame for which requests are checked/remembered (in milliseconds)
    windowMs: options?.windowMs ?? 15 * 60 * 1000,
    keyGenerator: (req: Request) => ipKeyGenerator(req.ip as string),

    // Optional handler for JSON APIs
    handler: (req, res, next, options) => {
      res.status(options.statusCode || 429).json(options.message);
    },
  });
}

export default createRateLimiter;
