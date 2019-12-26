import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';

export type TableSpec = {
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
    write: (spec:TableSpec, include?:boolean) => {
        spec['runDate'] = (new Date()).toString();

        if (!include) {
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