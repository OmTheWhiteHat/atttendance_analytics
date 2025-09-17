const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: 'User role not set' });
    }

    const hasRole = req.user.roles.some(role => roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: `User role must be one of the following: ${roles.join(', ')}` });
    }
    
    next();
  };
};

module.exports = { authorize };
