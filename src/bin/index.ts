import { Douban } from '../sites/douban';
import { Filter } from '../filter';

const filter = new Filter();
const douban = new Douban(filter);
douban.run();