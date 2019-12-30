type FilterText = {
    [type:string]:{
        exclude: string[],
        include: string[],
    }
}

export type FilterResult = {
    valid:boolean;
    notes:string[];
}

export class Filter {
    public priceRange = [4000, 6500];
    public filterText:FilterText = {
        rooms: {
            exclude: ['一房', '1房', '一居', '1居', '单间', '一室'],
            include: ['两房', '2房', '二居', '两居', '2居', '二房'],
        },
        rentType: {
            exclude: ['合租', '求租', '次卧', '室友'],
            include: ['整租'],
        },
        position: {
            exclude: ['宝安', '西乡', '坪洲', 
                '龙岗', '坂田', '布吉', '百鸽笼', '大芬', '丹竹头', 
                '龙华', '民乐', '白石龙', '深圳北', 
                '罗湖', '大剧院',
            ],
            include: ['福田', '石厦', '景田', '莲花', '梅林', '上沙', '下沙'],
        },
    }

    private filterPrice (text:string) : FilterResult {
        const prices = text.match(/\d{4}/g);
        if (!prices) {
            return {
                valid: true,
                notes: ['无价格'],
            };
        }
        for (let i = 0; i < prices.length; i ++) {
            const price = +prices[i];
            if (price > 1980 && price < 2025) { continue; }
            if (price < 1000) { continue; }
            if (price < this.priceRange[0] || price > this.priceRange[1]) {
                return {
                    valid: true,
                    notes: ['' + price],
                };
            }
        }
        return {
            valid: true,
            notes: [''],
        };
    }

    public run (text:string) : FilterResult {
        const priceFilter = this.filterPrice(text);
        if (!priceFilter.valid) { return priceFilter; };

        const filterKeys = Object.keys(this.filterText);
        for (let i = 0; i < filterKeys.length; i++) {
            const filterObj = this.filterText[filterKeys[i]];
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
        return {
            valid: true,
            notes: [''],
        };
    }
}