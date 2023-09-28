const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("UnAuthorized");
  }
};

const verifyTokenAndAutherization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json("Un Authorized");
    }
  });
};

const verifyTokenOwnerOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin" || req.user.role === "owner") {
      next();
    } else {
      return res.status(401).json("Un Authorized");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json("Un Authorized");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAutherization,
  verifyTokenOwnerOrAdmin,
  verifyTokenAndAdmin,
};
