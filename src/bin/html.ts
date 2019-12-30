import path = require('path');
import fs = require('fs');
import { Db, TableSpec } from '../db';

const HTML_FILE = path.join(__dirname, '../../result.html');

const validData = Db.read('include');
const invalidData = Db.read('exclude');
const tableFields = Object.keys(validData[0] || {});

function writeTable (spec:TableSpec[], valid:boolean) {
    return `
        <tr>
            <th>title</th>
        </tr>
        ${spec.map((data) => `<tr>
            <td><a href=${data.href}>${data.title}</a> <span
                class="${valid && 'valid' || 'invalid'}"
            >${data.notes.join(', ')}</span></td>
        </tr>`).join('')}
    `;
}

function run () {
    fs.writeFile(
        HTML_FILE,
        `
        <html lang="cn">
            <head>
                <title>ver1</title>
                <style>
                    .table {
                        max-height: 600px;
                        overflow-y: auto;
                        border: 1px solid grey;
                        margin: 16px;
                    }
                    .valid {
                        color: green;
                    }
                    .invalid {
                        color: red;
                        text-decoration: line-through;
                    }
                </style>
            </head>
            <body>
                <div class="table">
                    Include:
                    <br />
                    <table>
                        ${writeTable(validData, true)}
                    </table>
                </div>
                <div class="table">
                    Exclude:
                    <br />
                    <table>
                        ${writeTable(invalidData, false)}
                    </table>
                </div>
                <script></script>
            </body>
        </html>
        `,
        (err) => {
            if (err) throw err;
            console.log('It\'s saved!');
        },
    );
}

run();