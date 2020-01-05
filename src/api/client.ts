import { Filter } from '../filter';

export class APIClient {
    private baseURL:string;
    constructor (baseURL:string) {
        this.baseURL = baseURL;
    }

    private async _get (path:string, query:{[name:string]:any} = {}) {
        const keys = Object.keys(query);
        return await fetch('GET', this.baseURL + path + (keys.length > 0 && `?${keys.map((key) => `${key}=${query[key]}`).join('&')}` || ''));
    }

    private async _post (path:string, data:{[name:string]:any}) {
        return await fetch('POST', this.baseURL + path, JSON.stringify(data));
    }

    public async search (filter:Filter, inTime:number) {
        const res = await this._get('/search', {
            filter: JSON.stringify(filter),
            sites: JSON.stringify(['douban']),
            inTime, 
        });
        return JSON.parse(res);
    }
}

export function fetch (method:string, url:string, data?:string) {
    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(JSON.stringify({
                        url,
                        method,
                        data,
                        status: xhr.status,
                        res: xhr.responseText,
                    }));
                }
            }
        };
        xhr.open(method, url, true);
        xhr.send(data);
    });
}