import { config } from './config';
import { getDB } from './utils/db';
import { parsePosts } from './utils/domParser';
import { queryDouban } from './utils/douban';
import { sendEmail } from './utils/email';

const targetSite = "https://www.douban.com/group/szsh";

function testQuerySite() {
  queryDouban(targetSite, config.cookieJson!).then(console.log).catch(console.error);
}
// testQuerySite();

function testParsePageTitles() {
  queryDouban(targetSite, config.cookieJson!)
    .then((data) => console.log(parsePosts(data)))
    .catch(console.error);
}
// testParsePageTitles();

function testEmail() {
  sendEmail(config.email, 'test!!', `
<html>
  <head></head>
  <body>
    <h3>今日份房子</h3>
    <a href="https://baidu.com">条目1</a>
  </body>
</html>`).catch(console.error);
}
testEmail();

async function testDB() {
  const db = await getDB();
  db.addPosts(db.filterPosts(['a', 'b', 'c']));
  db.end();
}
// testDB().catch(console.error);