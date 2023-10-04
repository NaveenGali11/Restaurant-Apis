import { Response } from "express";
import { ApiResponse } from "./types";

export function sendResponse(
  res: Response,
  status: number,
  data: any,
  message: string,
  count?: number
) {
  const response: ApiResponse = {
    status: status,
    message: message,
    count,
    data: data,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}
