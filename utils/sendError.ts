import { Response } from "express";
import { ApiError } from "./types";

export function sendError(res: Response, status: number, message: string) {
  const error: ApiError = {
    status: status,
    message: message,
    timestamp: new Date().toISOString(),
  };

  res.status(status).json(error);
}
