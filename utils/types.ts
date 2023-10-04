interface ApiResponse {
  status: number;
  message: string;
  count?: number;
  data: any;
  timestamp: string;
}

interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}

export { ApiResponse, ApiError };
