/**
 * Base interface for all API responses
 */
export interface BaseApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    has_more_pages: boolean;
  }
}

/**
 * Successful API response with data
 */
export type SuccessApiResponse<T> = BaseApiResponse<T> & {
  success: true;
  data: T;
};

/**
 * Error API response
 */
export type ErrorApiResponse = BaseApiResponse<null> & {
  success: false;
};

/**
 * Type guard to check if an API response is successful
 */
export const isApiSuccess = <T>(response: BaseApiResponse<T>): response is SuccessApiResponse<T> => response.success;

/**
 * Paginated data response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface NewPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  
}
/**
 * API error response with additional error details
 */
export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
  validationErrors?: Record<string, string[]>;
}

/**
 * Type for API request parameters
 */
export type RequestParams = Record<string, string | number | boolean | undefined>;

/**
 * Type for API request body
 */
export type RequestBody = Record<string, unknown> | FormData | null;
