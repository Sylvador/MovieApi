import { Test, TestingModule } from "@nestjs/testing";
import { PersonController } from "./person.controller"
import { PersonService } from "./person.service";

describe('Person Controller', () => {
  let personController: PersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        {
          provide: PersonService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(['test']),
            findOne: jest.fn().mockResolvedValue(['test'])
          }
        }
      ]
    }).compile();

    personController = module.get<PersonController>(PersonController);
  })
  it('should be defined', () => {
    expect(personController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      const result = ['test'];
      expect(await personController.findAll({ search: '' })).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a person', async () => {
      const result = ['test'];
      expect(await personController.findOne(1)).toEqual(result);
    });
  });
})