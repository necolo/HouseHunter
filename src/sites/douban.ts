import cheerio from 'cheerio';
import axios from 'axios';
import { Filter } from '../filter';
import { Site } from './type';
import { Db } from '../db';

export class Douban implements Site {
    public origin = 'https://douban.com';
    public paths = [
        '/group/szsh/discussion?start=0',
        '/group/szsh/discussion?start=25',
        '/group/szsh/discussion?start=30',
        '/group/szsh/discussion?start=35',
        '/group/szsh/discussion?start=40',
    ];

    private _filter:Filter;
    constructor (filter:Filter) {
        this._filter = filter;
    }
    
    public async run () {
        Db.clear('include');
        Db.clear('exclude');
        for (let i = 0; i < this.paths.length; i ++) {
            const resp = await axios.get(`${this.origin}${this.paths[i]}`);
            const $list = cheerio.load(resp.data)
            $list('.olt tbody tr').each(async (i, el) => {
                if (i === 0) { return; }
                const titleEl = $list(el).find('.title');
                const href = titleEl.find('a').attr('href');
                const title = titleEl.find('a').attr('title');
                if (href && title) {
                    const postPage = await axios.get(href);
                    const $post = cheerio.load(postPage.data);
                    const postContent:string[] = [];
                    $post('.topic-richtext p').each((i, el) => {
                        postContent.push($post(el).text());
                    });
                    const valid = this._filter.run(title + ' ' + postContent.join(' '));
                    const data = {
                        title,
                        href,
                    };
                    Db.write(data, valid);
                }
            });
        }
    }
}