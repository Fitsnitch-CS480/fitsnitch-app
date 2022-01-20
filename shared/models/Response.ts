export default class Response<TData> {
    public data?: TData;
    public code?: number;
    public message?: string;
    public success?: boolean;
}