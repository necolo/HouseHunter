import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import { FilterResult } from './filter';

export type TableSpec = {
    title:string;
    href:string;
    runDate:string;
    notes:string[];
}

export type WriteSpec = {
    title:string;
    href:string;
}

const adapter = new FileSync(path.join(__dirname, '../db.json'));
const db = low(adapter)


db.defaults({
    exclude: [],
    include: [],
    lastUpdated: (new Date()).toString(),
}).write();

export const Db = {
    write: (spec:WriteSpec, filterResult:FilterResult) => {
        spec['runDate'] = (new Date()).toString();
        spec['notes'] = filterResult.notes;

        if (!filterResult.valid) {
            (db.get('exclude') as any).push(spec).write();
        } else {
            (db.get('include') as any).push(spec).write();
        }
        db.set('lastUpdated', (new Date()).toString());
    },
    clear: (table:'exclude'|'include') => {
        db.set(table, []).write();
    },
    read: (table:'exclude'|'include') => {
        return db.get(table).value() as TableSpec[];
    }
}