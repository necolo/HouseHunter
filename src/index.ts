import { Post } from './types';
import { config } from './config';
import { parsePosts } from './utils/domParser';
import { filterTitle } from './utils/filters';
import { getDB } from './utils/db';
import { getDoubanURL, queryDouban } from './utils/douban';
import { sleep } from './utils/common';
import { mailHtml, sendEmail } from './utils/email';

export async function run() {
  const cookie = config.cookieJson || config.cookie;
  if (!cookie) {
    throw new Error('Cookie is required');
  }

  const db = await getDB();
  console.log('Database initialized');
  let passedPosts: Post[] = [];

  for (let i = 0; i < config.doubanGroupIDs.length; i++) {
    const groupId = config.doubanGroupIDs[i];
    console.log(`Start finding posts in ${groupId}`);

    for (let page = 0; page < config.findPagesPerTime; page++) {
      const url = getDoubanURL(groupId, page);
      const dom = await queryDouban(url, cookie);
      const posts = parsePosts(dom);
      const newPosts = posts
        .filter(post => filterTitle(post.title, config.rules))
        .filter(post => !db.hasPost(post.id));
      passedPosts = passedPosts.concat(newPosts);

      console.log(`Finished ${url}`);
      await sleep(1e3);
    }
  }

  console.log('All douban group processed');
  console.log(passedPosts.map(post => `${post.title} ${post.href}`));

  // send posts with email
  const mailTitle = `找到了 ${passedPosts.length} 个不错的新房子哟!`;
  await sendEmail(config.email, mailTitle, mailHtml(passedPosts));

  console.log('Email already sent, check your email');

  // add to db
  db.addPosts(passedPosts.map(post => post.id)).end();

  console.log('Database updated');
  console.log('End');
}

run().catch(console.error);