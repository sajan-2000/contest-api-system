// Not Found handler
function notFoundHandler(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
}

// Centralized error handler.
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}

module.exports = { errorHandler, notFoundHandler };


