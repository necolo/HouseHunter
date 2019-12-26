import cheerio from 'cheerio';
import axios from 'axios';

async function test () {
    const resp = await axios.get('https://www.douban.com/group/szsh/')
    const $ = cheerio.load(resp.data)
    const articleList:{
        // id:string,
        title:string,
        href:string,
    }[] = []
    const tr = $('.olt tbody tr')
    .each((i, el) => {
        if (i === 0) { return; }
        const firstChildren = $(el).children()[0];
        articleList.push({
            // id: $(el).attr('id').replace('note-', ''),
            title: $(firstChildren).find('a').attr('title') || '', //unescape($(el).find('.title').html().replace(/&#x/g, '%u').replace(/;/g, '')),
            href: $(firstChildren).find('a').attr('href') || '',
        })
    })
    console.log(articleList);
}

test()
