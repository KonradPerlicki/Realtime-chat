import rateLimit from 'express-rate-limit';

export const emailRequestLimiter = rateLimit({
    skipFailedRequests: true, // if email was not found, don't trigger count
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // Limit each IP to 3 requests per `window` (here, per 10 minutes)
    standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
