const jwt = require('jsonwebtoken');


//Ensuring a valid JWT is present then adding `req.user` when valid.
function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}


// Role check: Normal or VIP 
function isUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  // Normal and VIP both qualify as user
  return next();
}

// Role check: VIP only
function isVip(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (req.user.role !== 'VIP') return res.status(403).json({ error: 'VIP access required' });
  return next();
}

// Role check: Admin only
function isAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin access required' });
  return next();
}

module.exports = { isAuthenticated, isUser, isVip, isAdmin };


