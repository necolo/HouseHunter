export type FilterItem = {
    exclude: string[],
    include: string[]
}
export type FilterItems = {
    [type:string]:FilterItem;
}

export type FilterResult = {
    valid:boolean;
    notes:string[];
}

export class Filter {
    public price = [4000, 6500];
    public text:FilterItems = {
        rooms: {
            exclude: ['一房', '1房', '一居', '1居', '单间', '一室'],
            include: ['两房', '2房', '二居', '两居', '2居', '二房'],
        },
        rentType: {
            exclude: ['合租', '求租', '次卧', '室友', '主卧'],
            include: ['整租', '房东直租'],
        },
        position: {
            exclude: [
                '宝安', '西乡', '坪洲', '灵芝', '新安', '宝体', '固戍', '后瑞', '翻身',
                '龙岗', '坂田', '布吉', '百鸽笼', '大芬', '丹竹头', '木棉湾', '六约', '塘坑', '横岗', '永湖', '荷坳', '大运', '爱联', '龙城广场', '南联', '双龙',
                '龙华', '民乐', '白石龙', '深圳北', '清湖', '上塘', '红山', '长岭破',
                '罗湖', '大剧院',
            ],
            include: ['福田', '石厦', '景田', '莲花', '梅林', '上沙', '下沙', '五和'],
        },
    }

    public setPrice (price:number[]) {
        this.price[0] = price[0];
        this.price[1] = price[1];
    }

    public setText (text:FilterItems) {
        this.text = {};
        const textKeys = Object.keys(text);
        for (let i = 0; i < textKeys.length; i++) {
            const key = textKeys[i];
            this.text[key] = {
                exclude: text[key].exclude.slice(),
                include: text[key].include.slice(),
            };
        }
    }

    private filterPrice (text:string) : FilterResult {
        const prices = text.match(/[^\d]{1}\d{4}[^\d]{1}/g);
        if (!prices) {
            return {
                valid: true,
                notes: ['无价格'],
            };
        }
        for (let i = 0; i < prices.length; i ++) {
            const priceReg = prices[i].match(/\d/g);
            if (priceReg && priceReg[0]) {
                const price = +priceReg[0];
                if (price > 1980 && price < 2025) { continue; }
                if (price < 1000) { continue; }
                if (price < this.price[0] || price > this.price[1]) {
                    return {
                        valid: false,
                        notes: ['' + price],
                    };
                }
            }
        }
        return {
            valid: true,
            notes: [''],
        };
    }

    public run (text:string) : FilterResult {
        const filterKeys = Object.keys(this.text);
        for (let i = 0; i < filterKeys.length; i++) {
            const filterObj = this.text[filterKeys[i]];
            let matched = false;
            for (const includeValue of filterObj.include) {
                if (text.match(includeValue)) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                for (const excludeValue of filterObj.exclude) {
                    if (text.match(excludeValue)) {
                        return {
                            valid: false,
                            notes: [excludeValue],
                        };
                    }
                }
            }
        }

        const priceFilter = this.filterPrice(text);
        if (!priceFilter.valid) { return priceFilter; };

        return {
            valid: true,
            notes: [''],
        };
    }

    public toJSON () {
        const result:{[name:string]:any} = {};
        result.price = this.price.slice();
        result.text = {} as FilterItems;
        const textKeys = Object.keys(this.text);
        for (let i = 0; i < textKeys.length; i++) {
            const key = textKeys[i];
            result.text[key] = {
                exclude:  this.text[key].exclude.slice(),
                include: this.text[key].include.slice(),
            }
        }
        return result;
    }
}