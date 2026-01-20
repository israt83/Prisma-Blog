import { NextFunction, Request, Response, Router } from "express";

import { auth as authMiddleware } from "../lib/auth";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}
const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get user session
      const session = await authMiddleware.api.getSession({
        headers: req.headers as any,
      });
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!session.user.emailVerified) {
        return res
          .status(403)
          .json({
            message: "Please verify your email to access this resource.",
          });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role as Role)) {
        return res.status(403).json({ message: "Forbidden Access" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};


export default auth;