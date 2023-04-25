export type TResponse<T> = {
  data: T | null;
  error: {
    status: number;
    message: string;
  } | null;
};
