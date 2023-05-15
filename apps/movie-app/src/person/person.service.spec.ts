//person.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { getModelToken } from '@nestjs/sequelize';
import { PersonProfession } from './models/person-profession.model';
import { Person } from './models/person.model';

describe('PersonService', () => {
  let personService: PersonService;
  let personRepository: typeof Person;
  let personProfessionRepository: typeof PersonProfession;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getModelToken(Person),
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: getModelToken(PersonProfession),
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    personService = module.get<PersonService>(PersonService);
    personRepository = module.get<typeof Person>(getModelToken(Person));
    personProfessionRepository = module.get<typeof PersonProfession>(getModelToken(PersonProfession));
  });

  it('personService should be defined', () => {
    expect(personService).toBeTruthy();
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      const result = ['test'];
      jest.spyOn(personRepository, 'findAll').mockImplementation(() => Promise.resolve(result as unknown as Person[]));

      expect(await personService.findAll('')).toBe(result);
    });
  });

  describe('findOne', () => {
    it("should return person's professions", async () => {
      const result = ['test'];
      jest.spyOn(personProfessionRepository, 'findAll').mockImplementation(() => Promise.resolve(result as unknown as PersonProfession[]));

      expect(await personService.findOne(1)).toBe(result);
    });
  });
});