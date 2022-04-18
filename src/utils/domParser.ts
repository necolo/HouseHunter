import cheerio from 'cheerio';
import { Post } from '../types';

export function parsePosts(dom: string) {
  const $ = cheerio.load(dom);

  const posts:Post[] = [];

  $('.olt tbody tr').each((i, el) => {
    if (i === 0) { return; }
    const firstChildren = $(el).children()[0];
    const href = $(firstChildren).find('a').attr('href') || '';
    const id = href.match(/\d+/g)?.[0] || 'id';
    if (!id) { return; }

    posts.push({
        id,
        href,
        title: $(firstChildren).find('a').attr('title') || '',
    });
  });

  return posts;
}