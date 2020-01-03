import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import { FilterResult } from './filter';

export type TableSpec = {
    title:string;
    href:string;
    runDate:number;
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

db._.mixin({
    timeAfter: function(array, time) {
        return array.filter((v) => v.runDate > time);
    }
})

export const Db = {
    write: (spec:WriteSpec, filterResult:FilterResult) => {
        spec['runDate'] = Date.now();
        spec['notes'] = filterResult.notes;

        if (!filterResult.valid) {
            (db.get('exclude') as any).push(spec).write();
        } else {
            (db.get('include') as any).push(spec).write();
        }
        db.set('lastUpdated', Date.now());
    },
    clear: (table:'exclude'|'include') => {
        db.set(table, []).write();
    },
    read: (table:'exclude'|'include', timeAfter:number) => {
        return db.get(table).timeAfter(timeAfter).value() as TableSpec[];
    },
    recorded: (table:'exclude'|'include', url:string) => {
        const found = !!db.get(table).find({href: url}).value();
        if (found) {
            db.get(table).find({href: url}).assign({runDate: Date.now()}).write();
        }
        return found;
    },
}