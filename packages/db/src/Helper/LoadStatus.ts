import { AxiosError } from "axios";

export default interface LoadStatus<T> {
    loading: boolean;
    data?: T;
    error?: AxiosError;
}
