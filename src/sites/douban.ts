import cheerio from 'cheerio';
import axios from 'axios';
import { Filter } from '../filter';
import { Site } from './type';
import { Db } from '../db';
import { sleep } from '../utils/sleep';
import { getUserAgent } from '../utils/user-agent';

export class Douban implements Site {
    public origin = 'https://www.douban.com';
    public paths = [
        // 深圳租房
        '/group/szsh/discussion?start=0',
        '/group/szsh/discussion?start=25',
        '/group/szsh/discussion?start=50',
        '/group/szsh/discussion?start=75',
        '/group/szsh/discussion?start=100',

        // 深圳租房团
        '/group/106955/discussion?start=0',
        '/group/106955/discussion?start=25',
        '/group/106955/discussion?start=50',
        '/group/106955/discussion?start=75',
        '/group/106955/discussion?start=100',

        // 福田租房
        '/group/futianzufang/discussion?start=0',
        '/group/futianzufang/discussion?start=25',
        '/group/futianzufang/discussion?start=50',
        '/group/futianzufang/discussion?start=75',
        '/group/futianzufang/discussion?start=100',

        // 深圳租房
        // '/group/637628/discussion?start=0',
        // '/group/637628/discussion?start=25',
        // '/group/637628/discussion?start=50',
        // '/group/637628/discussion?start=75',
        // '/group/637628/discussion?start=100',
    ];

    public requestConfig = {
        withCredentials: true,
        headers: {
            Cookie: '',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            AcceptEncoding: 'gzip, deflate, br',
            AcceptLanguage: 'zh-CN,zh;q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            CacheControl: 'no-cache',
            Connection: 'keep-alive',
            // Referer: 'https://accounts.douban.com/passport/login',
            UserAgent: getUserAgent(),
            // UpgradeInsecureRequests: 1,
            // SecFetchMode: 'navigate',
            // SecFetchSite: 'same-site',
            // SecFetchUser: '?1',
            // Pragma: 'no-cache',
            // Host: 'www.douban.com',
        },
    };

    public timeInterval = [500, 1000];

    private _filter:Filter;
    constructor (filter:Filter) {
        this._filter = filter;
    }

    public async run () {
        for (let i = 0; i < this.paths.length; i ++) {
            const url = `${this.origin}${this.paths[i]}`;
            const data = await this._request(url);
            const $list = cheerio.load(data)
            $list('.olt tbody tr').each(async (i, el) => {
                if (i === 0) { return; }
                const titleEl = $list(el).find('.title');
                const href = titleEl.find('a').attr('href') || '';
                const title = titleEl.find('a').attr('title') || '';
                const filter1 = this._filter.run(title);

                if (!href) { throw url + ' ' + data; }
                if (Db.recorded('include', href)) { return; }
                if (Db.recorded('exclude', href)) { return; }

                if (!filter1.valid) {
                    Db.write({title, href}, filter1);
                } else if (title) {
                    const hasRecorded = Db.recorded('include', href);
                    const postPageData = await this._request(href);
                    const $post = cheerio.load(postPageData);
                    const postContent:string[] = [];
                    $post('.topic-richtext p').each((i, el) => {
                        postContent.push($post(el).text());
                    });
                    const filter2 = this._filter.run(postContent.join(' '));
                    Db.write({title, href}, filter2);
                }
            });
        }
    }

    private _request (url:string) {
        return new Promise<string>((resolve, reject) => {
            sleep(randomRange(this.timeInterval[0], this.timeInterval[1])).then(() => {
                axios.get(url, this.requestConfig).then((res) => resolve(res.data)).catch(reject);
            });
        });
    }
}

function randomPick<T> (a:T[]) : T {
    return a[Math.floor(Math.random() * a.length)];
}

function randomRange (min:number, max:number) {
    return Math.random() * (max - min) + min;
}