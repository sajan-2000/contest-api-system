const rateLimit = require('express-rate-limit');

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiRateLimiter };


