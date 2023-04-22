import {Language} from "../models/language.model";

export class LanguageDto {
    id: number;
    name: string;

    constructor(language: Language) {
        this.id = language.languageId;
        this.name = language.name;
    }
}