import React from 'react';
import ReactDOM from 'react-dom';
import { APIClient } from '../api/client';
import { Filter } from '../filter';

type TableSpec = {
    title:string;
    href:string;
    runDate:number;
    notes:string[];
}

interface State {
    data:TableSpec[];
    inTime:number; // mins
}

class App extends React.Component<{}, State> {
    public filter = new Filter();
    public api = new APIClient(location.protocol + '//' + 'localhost' + ':3001');

    public state:State = {
        inTime: 10,
        data: [],
    };

    public render () {
        return <div>
            <div style={{display: 'flex'}}>

                搜索<input
                    type="number"
                    value={this.state.inTime}
                    onChange={(ev) => this.setState({inTime: +ev.target.value})}
                ></input>分钟内

                <button onClick={async () => {
                    try {
                        const data = await this.api.search(this.filter, this.state.inTime * 60 * 1000);
                        this.setState({data: data.douban});
                    } catch (e) {
                        console.log(JSON.parse(e));
                    }
                }}>run</button>
            </div>

            <div style={{
                padding: '10px',
                margin: '10px',
                border: '1px solid grey',
            }}>
                {this.state.data.map((item, i) => {
                    return <a key={i} href={item.href} style={{display: 'block'}}>
                        {item.title}
                    </a>
                })}
            </div>
        </div>;
    }
}

const root = document.createElement('root');
document.body.appendChild(root);


ReactDOM.render(<App />, root);