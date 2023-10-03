import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as Secret;

export interface jwtUser {
  email: string;
  id: string;
  role: string;
}

interface Request extends ExpressRequest {
  user?: jwtUser;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      req.user = user as jwtUser;

      next();
    });
  } else {
    return res.status(401).json("UnAuthorized");
  }
};

export const verifyTokenAndAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (
      req.user &&
      (req.user.id === req.params.id || req.user.role === "admin")
    ) {
      next();
    } else {
      return res.status(401).json("Un Authorized");
    }
  });
};

export const verifyTokenOwnerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.role === "admin" || req.user.role === "owner")) {
      next();
    } else {
      return res.status(401).json("Un Authorized");
    }
  });
};

export const verifyTokenAndAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json("Un Authorized");
    }
  });
};
