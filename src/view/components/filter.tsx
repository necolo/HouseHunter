import React from 'react';
import { Filter } from '../../filter';
import './filter.scss';
import { AppStorage } from '../../app-storage';

type FilterItem = {
    include:string;
    exclude:string;
}
type FilterTexts = {[item:string]:FilterItem};


interface Props {
    filter:Filter;
}

interface State {
    texts:FilterTexts;
    price:number[];
}

export class FilterUI extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props);
        this.state = this.loadFilter();
    }

    public loadFilter () {
        const texts = {} as FilterTexts;
        const keys = Object.keys(this.props.filter.text);
        for (let i = 0; i < keys.length; i ++) {
            const key = keys[i];
            texts[key] = {
                include: this.props.filter.text[key].include.join(' '),
                exclude: this.props.filter.text[key].exclude.join(' '),
            };
        }
        return {
            price: this.props.filter.price.slice(),
            texts,
        }
    }

    public render () {
        return <div className="filter-container">
            <div className="desc">请以空格间隔关键词</div>
            <div className="item columns">
                <div className="title column is-one-fifth">价格范围</div>
                <div className="content column">
                    <input
                        type="number" 
                        className="input is-small"
                        value={this.state.price[0]}
                        onChange={(ev) => {
                            this.setState((prevState) => ({
                                price: [+ev.target.value, prevState.price[1]],
                            }))
                        }}
                    ></input>
                    ~
                    <input
                        type="number"
                        className="input is-small"
                        value={this.state.price[1]}
                        onChange={(ev) => {
                            this.setState((prevState) => ({
                                price: [prevState.price[0], +ev.target.value],
                            }))
                        }}
                    >
                    </input>
                </div>
            </div>
            {this.renderTextFilter('房型', 'rooms')}
            {this.renderTextFilter('租房类型', 'rentType')}
            {this.renderTextFilter('位置', 'position')}
            <button className="button is-primary is-fullwidth" onClick={() => {
                this.props.filter.setPrice(this.state.price);
                const keys = Object.keys(this.state.texts);
                for (let i = 0; i < keys.length; i ++) {
                    const key = keys[i];
                    this.props.filter.text[key].include = this.state.texts[key].include.split(' ');
                    this.props.filter.text[key].exclude = this.state.texts[key].exclude.split(' ');
                }
                AppStorage.reset(this.props.filter.toJSON());
            }}>保存</button>
            <button className="button is-small reset is-danger" onClick={() => {
                AppStorage.clear();
                this.props.filter.setPrice(AppStorage.get('price'));
                this.props.filter.setText(AppStorage.get('text'));
                this.setState(this.loadFilter());
            }}>重置</button>
        </div>;
    }

    public renderTextFilter = (title:string, key:string) => {
        return <div className="item columns" key={key}>
            <div className="title column is-one-fifth">{title}</div>
            <div className="content column columns">
                <div className="include column is-half">
                    包含
                    <input
                        className="input is-primary"
                        value={this.state.texts[key].include}
                        onChange={(ev) => {
                            const value = ev.target.value;
                            this.setState((prevState) => {
                                const texts = deepCopyText(prevState.texts);
                                texts[key].include = value;
                                return { texts };
                            });
                        }}
                    ></input>
                </div>
                <div className="exclude column is-half">
                    过滤
                    <input
                        className="input is-danger"
                        value={this.state.texts[key].exclude}
                        onChange={(ev) => {
                            const value = ev.target.value;
                            this.setState((prevState) => ({
                                texts: Object.assign({}, prevState.texts, {
                                    [key]: {
                                        include: prevState.texts[key].include,
                                        exclude: value,
                                    },
                                })
                            }));
                        }}
                    ></input>
                </div>
            </div>
        </div>;
    }
}

function deepCopyText (text:FilterTexts) {
    const result = {} as FilterTexts;
    const keys = Object.keys(text);
    for (let i = 0; i < keys.length; i ++) {
        const key = keys[i];
        result[key] = {
            include: text[key].include,
            exclude: text[key].exclude,
        }
    }
    return result;
}