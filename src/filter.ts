type FilterText = {
    [type:string]:{
        exclude: string[],
        include: string[],
    }
}

export class Filter {
    public priceRange = [4000, 6500];
    public filterText:FilterText = {
        rooms: {
            exclude: ['一房', '1房', '一居', '1居', '单间'],
            include: ['两房', '2房', '二居', '两居', '2居', '二房'],
        },
        rentType: {
            exclude: ['合租', '求租', '次卧', '招室友'],
            include: [],
        },
        position: {
            exclude: ['宝安', '龙岗', '龙华', '坂田', '罗湖', '民乐', '白石龙', '西乡', '百鸽笼'],
            include: ['福田', '石厦', '景田', '莲花', '梅林', '上沙', '下沙'],
        },
    }

    private filterPrice (text:string) {
        const prices = text.match(/\d{4}/g);
        if (!prices) { return true; }
        for (let i = 0; i < prices.length; i ++) {
            const price = +prices[i];
            if (price > 1980 && price < 2025) { continue; }
            if (price < 1000) { continue; }
            if (price < this.priceRange[0] || this.priceRange[1]) { return false; }
        }
        return true;
    }

    public run (text:string) {
        if (!this.filterPrice(text)) { return false };

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
                        return false;
                    }
                }
            }
        }
        return true;
    }
}