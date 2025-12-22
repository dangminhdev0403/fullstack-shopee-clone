export interface ApiResponse<T> {
  status: number;
  error: string | null;
  message: string | object;
  data: T;
}

  export interface BaseResponse<T> {
    status: number;
    error: string | null;
    message: string;
    data: {
      content: T[];
      page: PageInfo;
    };
  }

export interface DataUserLogin {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: {
      name: string;
    }[];
  }| null;
}

export interface PageInfo {
  number: number; // current page, one-based
  size: number;
  totalElements: number;
  totalPages: number;
}

export { ApiResponse, DataUserLogin };
