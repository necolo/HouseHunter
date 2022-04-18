import axios from 'axios';
import { EditThisCookieExports, stringifyCookieJson } from './cookie';

export async function queryDouban(url: string, cookie: string | EditThisCookieExports) {
  const cookieStr = typeof cookie === 'string' ? cookie : stringifyCookieJson(cookie);
  const resp = await axios({
    url,
    method: 'GET',
    // withCredentials: true,
    headers: {
      Cookie: cookieStr,
      Accept: '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
    },
  });
  return resp.data;
}

export function getDoubanURL(groupId: string, page = 0, perPage = 25) {
  return `https://douban.com/group/${groupId}/discussion?start=${page * perPage}&type=new`;
}
