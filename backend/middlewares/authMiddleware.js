const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.cookies.token; 
  
  // If no token found, respond with an unauthorized status
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
