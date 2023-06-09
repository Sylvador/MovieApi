import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Person } from "./models/person.model";
import { Op } from "sequelize";
import { PersonProfession } from "./models/person-profession.model";
import { Profession } from "./models/profession.model";
import { cache } from '@app/common/decorators/caching-decorator';

@Injectable()
export class PersonService {
  constructor(
    @InjectModel(Person) private personRepository: typeof Person,
    @InjectModel(PersonProfession) private personProfessionRepository: typeof PersonProfession,
  ) { }

  @cache
  async findAll(search: string, profession?: string): Promise<Person[]> {
    return this.personRepository.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `${search}%` } },
          { enName: { [Op.iLike]: `${search}%` } },
        ]
      },
      include: [{ model: Profession, through: { attributes: [] }, ...(profession ? { where: { name: profession } } : {}) }],
      limit: 10,
    });
  }

  async findOne(id: number): Promise<PersonProfession[]> {
    const personProfessions = await this.personProfessionRepository.findAll({
      where: { personId: id },
      include: { all: true }
    });
    return personProfessions;
  }
}
