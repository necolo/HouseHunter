export function getStorageTemplate<T extends {[name:string]:any}> (baseKey:string, defaultValue:T) {
    function getStorage () {
        try {
            const data = localStorage.getItem(baseKey);
            if (!data) { return; }
            return JSON.parse(data) as T;
        } catch (e) {
            return;
        }
    }

    if (!getStorage()) {
        localStorage.setItem(baseKey, JSON.stringify(defaultValue));
    }

    return {
        reset: <T>(value:T) => {
            localStorage.setItem(baseKey, JSON.stringify(value));
        },
        get: <K extends keyof T>(key:K) => {
            const data = getStorage();
            if (data) { return data[key]; }
            return defaultValue[key];
        },
        put: <K extends keyof T>(key:K, value:T[K]) => {
            const data = getStorage() || Object.assign({}, defaultValue);
            data[key] = value;
            localStorage.setItem(baseKey, JSON.stringify(data));
        },
        clear: () => {
            localStorage.setItem(baseKey, JSON.stringify(defaultValue));
        },
    };
}