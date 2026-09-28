export interface WebResponse<T> {
  code: number;
  status: boolean;
  data: T;
  message: string;
}
