interface ApiResponse<T> {
  status: number;
  error: string | null;
  message: string | object;
  data: T;
}

interface DataUserLogin {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: {
      name: string;
    }[];
  };
}

export interface PageInfo {
  page: number; // current page, one-based
  size: number;
  totalElements: number;
  totalPages: number;
}

export { ApiResponse, DataUserLogin };
