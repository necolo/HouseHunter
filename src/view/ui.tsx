import React from 'react';
import ReactDOM from 'react-dom';
import { APIClient } from '../api/client';
import { Filter } from '../filter';

import './index.scss';
import { AppStorage } from '../app-storage';
import { FilterUI } from './components/filter';

type TableSpec = {
    title:string;
    href:string;
    runDate:number;
    notes:string[];
}

interface State {
    data:TableSpec[];
    inTime:number; // mins
    waitingResponse:boolean;
    requestError:string;
    showFilter:boolean;
}

class App extends React.Component<{}, State> {
    public filter:Filter;
    public api = new APIClient(location.origin);

    constructor (props:{}) {
        super(props);
        this.filter = new Filter();

        const price = AppStorage.get('price');
        const text = AppStorage.get('text');
        this.filter.setPrice(price);
        this.filter.setText(text);
    }

    public state:State = {
        inTime: 10,
        data: [],
        waitingResponse: false,
        requestError: '',
        showFilter: false,
    };

    public render () {
        return <div className="app">
            {this.state.waitingResponse &&
                <progress className="progress is-small is-primary" max="100">15%</progress>
            }

            <div className="menu">
                <div>
                    搜索最近
                    <input
                        className="input is-primary is-small"
                        type="number"
                        value={this.state.inTime}
                        onChange={(ev) => this.setState({inTime: +ev.target.value})}
                    ></input>分钟内
                </div>

                <button className="button is-primary" onClick={async () => {
                    this.setState({
                        waitingResponse: true,
                        requestError: '',
                    });

                    try {
                        const data = await this.api.search(this.filter, this.state.inTime * 60 * 1000);
                        this.setState({
                            data: data.douban,
                            waitingResponse: false,
                        });
                    } catch (e) {
                        console.log(JSON.parse(e));
                        this.setState({
                            waitingResponse: false,
                            requestError: e,
                        })
                    }
                }}>搜索豆瓣</button>

                <button className="button" onClick={() => this.setState({showFilter: true})}>搜索选项</button>
            </div>

            <div style={{
                padding: '10px',
                margin: '10px',
                border: '1px solid grey',
            }}>
                {this.state.requestError &&
                    <div className="notification is-danger is-light">
                    <button className="delete" onClick={() => this.setState({requestError: ''})}></button>
                        {this.state.requestError}
                    </div>
                }
                {this.state.data.map((item, i) => {
                    return <a key={i} href={item.href} style={{display: 'block'}}>
                        {item.title}
                    </a>
                })}
            </div>

            {this.state.showFilter &&
                <div className="modal is-active">
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <FilterUI
                            filter={this.filter}
                        />
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={() => this.setState({showFilter: false})}></button>
                </div>
            }
        </div>;
    }
}

const root = document.createElement('div');
document.body.appendChild(root);


ReactDOM.render(<App />, root);