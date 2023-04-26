import {Fact} from "../models/fact.model";

export class FactDto {
    id: number;
    value: string;
    type: string;
    spoiler: boolean;


    constructor(fact: Fact) {
        this.id = fact.factId;
        this.value = fact.value;
        this.type = fact.type;
        this.spoiler = fact.spoiler;
    }
}