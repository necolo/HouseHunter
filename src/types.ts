import { EditThisCookieExports } from './utils/cookie';
import { EmailConfig } from './utils/email';

export interface Post {
  id: string;
  title:string,
  href:string,
}

export type Keyword = string | RegExp;
export interface Rule {
  includeThenPass?: Keyword[]; // if match includes, then ignore excludes
  excludes?: Keyword[]; 
}

export interface Config {
  cookieJson?: EditThisCookieExports;
  cookie?: string;
  doubanGroupIDs: string[];
  findPagesPerTime: number;
  rules: Rule[];
  email: EmailConfig;
}