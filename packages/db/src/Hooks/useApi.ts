import { useEffect, useState } from "react";

import Api from "../Api";

type Methods<T extends {}> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type ApiMethods = Methods<typeof Api>;
type DataType<M extends ApiMethods> = Awaited<ReturnType<(typeof Api)[M]>>;
type FetchStatus<M extends ApiMethods> = { loading: false; data?: DataType<M> } | { loading: true; data?: undefined };

// Thank you Mitsunee for this hook 🦊
export default function useApi<M extends ApiMethods>(key: M, ...args: Parameters<(typeof Api)[M]>) {
    const [status, setStatus] = useState<FetchStatus<M>>({ loading: true });
    const [arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10] = args;

    useEffect(() => {
        const controller = new AbortController();
        const method = Api[key].bind(Api);
        const ret = method(
            arg0 as never,
            arg1 as never,
            arg2 as never,
            arg3 as never,
            arg4 as never,
            arg5 as never,
            arg6 as never,
            arg7 as never,
            arg8 as never,
            arg9 as never,
            arg10 as never
        );
        if (ret instanceof Promise) {
            ret.then((res) => {
                if (!controller.signal.aborted) {
                    setStatus({ loading: false, data: res as DataType<M> });
                }
            }).catch(() => setStatus({ loading: false }));
        } else {
            if (!controller.signal.aborted) {
                setStatus({ loading: false, data: ret as DataType<M> });
            }
        }

        return () => {
            controller.abort();
        };
    }, [key, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10]);

    return status;
}
