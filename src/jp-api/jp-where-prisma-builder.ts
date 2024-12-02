export class JPWherePrismaBuilder {
    private jpWhereFields: Object = {};

    constructor() {}

    public addFilter(key: string, value: any, operator: WhereOperatorEnum): JPWherePrismaBuilder {
        if (!value) {
            return this
        }
        const jpWherePrisma = new JPWhereField(key, value, operator);

        this.jpWhereFields[key] = jpWherePrisma.builder();
        // console.log(this.jpWhereFields);
        return this;
    }

    public addCustomerFilter(jpWhere: Object = {}, value: any): JPWherePrismaBuilder {
        if (!value) {
            return this
        }
        this.jpWhereFields = Object.assign(this.jpWhereFields, jpWhere);
        return this;
    }

    public builder(): any {
        return this.jpWhereFields;
    }
}

class JPWhereField {
    constructor(private key: string, private value: any, private operator: WhereOperatorEnum) {}

    public builder(): any {
        if (!this.value) return;
        if (this.operator === WhereOperatorEnum.HAS)
            return {
                has: this.value,
            };
        if (this.operator === WhereOperatorEnum.HAS_SOME)
            return {
                hasSome: this.value,
            };
    }
}

export enum WhereOperatorEnum {
    HAS,
    HAS_SOME,
}
