import cheerio from 'cheerio';
import axios from 'axios';
import { Filter } from '../filter';
import { Site } from './type';
import { Db } from '../db';
import { sleep, getUserAgent } from '../util';

export class Douban implements Site {
    public origin = 'https://www.douban.com';
    public paths = [
        '/group/106955/discussion?start=0',
        // '/group/szsh/discussion?start=25',
        // '/group/szsh/discussion?start=30',
        // '/group/szsh/discussion?start=35',
        // '/group/szsh/discussion?start=40',
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

    public timeInterval = 500;

    private _filter:Filter;
    constructor (filter:Filter) {
        this._filter = filter;
    }
    
    public async run () {
        Db.clear('include');
        Db.clear('exclude');
        for (let i = 0; i < this.paths.length; i ++) {
            const data = await this._request(`${this.origin}${this.paths[i]}`);
            console.log(data);
            // const $list = cheerio.load(data)
            // $list('.olt tbody tr').each(async (i, el) => {
            //     if (i === 0) { return; }
            //     const titleEl = $list(el).find('.title');
            //     const href = titleEl.find('a').attr('href');
            //     const title = titleEl.find('a').attr('title');
            //     if (href && title) {
            //         const postPageData = await this._request(href);
            //         const $post = cheerio.load(postPageData);
            //         const postContent:string[] = [];
            //         $post('.topic-richtext p').each((i, el) => {
            //             postContent.push($post(el).text());
            //         });
            //         const valid = this._filter.run(title + ' ' + postContent.join(' '));
            //         const data = {
            //             title,
            //             href,
            //         };
            //         console.log(valid, data);
            //         Db.write(data, valid);
            //     }
            // });
        }
    }

    private _request (url:string) {
        return new Promise<string>((resolve, reject) => {
            sleep(this.timeInterval).then(() => {
                axios.get(url, this.requestConfig).then((res) => resolve(res.data)).catch(reject);
            });
        });
    }
}