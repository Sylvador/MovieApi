import {Country} from "../models/country.model";

export class CountryDto {
    id: number;
    name: string;


    constructor(country: Country) {
        this.id = country.countryId;
        this.name = country.name;
    }
}