class ResultCache<K, V> {
    private cache = new Map<K, V>();
    private pending = new Map<K, Function[]>();
    private pendingCatches = new Map<K, Function[]>();

    get(key: K, fetcher: Function, duration: number | null): Promise<V> {
        const value = this.cache.get(key);
        if (value !== undefined) {
            return new Promise<V>(resolve => {
                resolve(value);
            });
        }

        const callbacks = this.pending.get(key);
        if (callbacks !== undefined) {
            return new Promise<V>((resolve, reject) => {
                callbacks.push(resolve);

                const catches = this.pendingCatches.get(key) ?? [];
                catches.push(reject);
            });
        }

        this.pending.set(key, []);
        this.pendingCatches.set(key, []);
        return new Promise<V>((resolve, reject) => {
            fetcher
                .call(null)
                .then((value: V) => {
                    const callbacks = this.pending.get(key) ?? [];

                    callbacks.forEach(callback => {
                        callback.call(null, value);
                    });

                    this.cache.set(key, value);
                    this.pending.delete(key);
                    this.pendingCatches.delete(key);

                    if (duration !== null) {
                        setTimeout(() => {
                            this.cache.delete(key);
                        }, duration);
                    }

                    resolve(value);
                })
                .catch((error: any) => {
                    const callbacks = this.pendingCatches.get(key) ?? [];

                    callbacks.forEach(callback => {
                        callback.call(null, error);
                    });

                    this.pending.delete(key);
                    this.pendingCatches.delete(key);

                    reject(error);
                });
        });
    }
}

export default ResultCache;
