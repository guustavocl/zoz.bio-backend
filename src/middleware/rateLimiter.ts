import rateLimit from "express-rate-limit";

export const rateLimiter = (
  options = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "You can't make any more requests at the moment. Try again later",
    skipFailedRequests: false,
  }
) => {
  const apiRequestLimiter = rateLimit({ ...options, legacyHeaders: false });
  return apiRequestLimiter;
};

export const rateLimiterHour = (
  max = 4,
  message = "You can't make any more requests at the moment. Try again later",
  skipFailedRequests = false
) => {
  const apiRequestLimiter = rateLimit({
    max,
    message,
    windowMs: 24 * 60 * 60 * 1000,
    legacyHeaders: false,
    skipFailedRequests,
  });
  return apiRequestLimiter;
};

export const rateLimiterDay = (
  max = 4,
  message = "You can't make any more requests at the moment. Try again later",
  skipFailedRequests = false
) => {
  const apiRequestLimiter = rateLimit({
    max,
    message,
    windowMs: 60 * 60 * 1000,
    legacyHeaders: false,
    skipFailedRequests,
  });
  return apiRequestLimiter;
};
