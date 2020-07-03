class ResultCache<K, V> {
    private cache = new Map<K, V>([]);
    private pending = new Map<K, Function[]>([]);

    get(key: K, fetcher: Function, duration: number | null): Promise<V> {
        const value = this.cache.get(key);
        if (value !== undefined) {
            return new Promise<V>(resolve => {
                resolve(value);
            });
        }

        const callbacks = this.pending.get(key);
        if (callbacks !== undefined) {
            return new Promise<V>(resolve => {
                callbacks.push(resolve);
            });
        }

        this.pending.set(key, []);
        return new Promise<V>(resolve => {
            fetcher
                .call(null)
                .then((value: V) => {
                    const callbacks = this.pending.get(key) ?? [];

                    callbacks.forEach(callback => {
                        callback.call(this, value);
                    });

                    this.cache.set(key, value);
                    this.pending.delete(key);

                    if (duration !== null) {
                        window.setTimeout(() => {
                            this.cache.delete(key);
                        }, duration);
                    }

                    resolve(value);
                });
        });
    }
}

export default ResultCache;
