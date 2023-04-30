import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Person } from "../../movie-app/src/person/models/person.model";

@ApiTags('Персоны')
@Controller('person')
export class PersonController {
    constructor(
        @Inject('MOVIE_SERVICE') private readonly movieClient: ClientProxy,
    ) {}

    @ApiOperation({ summary: 'Поиск персоны', description: 'Находит персону по её идентификатору' })
    @ApiResponse({ status: 200, description: 'Персона найдена', type: Person })
    @ApiResponse({ status: 404, description: 'Персона не найдена' })
    @ApiParam({ name: 'id', description: 'Идентификатор персоны', type: 'number' })
    @Get(':id')
    findOnePerson(@Param('id') id: number) {
        return this.movieClient.send('findOnePerson', id)
            .pipe(catchError(err => throwError(() => new RpcException(err.response))));
    }

    @ApiOperation({ summary: 'Поиск персон', description: 'Находит персоны по заданным параметрам' })
    @ApiResponse({ status: 200, description: 'Персоны найдены', type: [Person] })
    @ApiResponse({ status: 404, description: 'Персоны не найдены' })
    @ApiQuery({ name: 'search', description: 'Строка поиска', required: false })
    @ApiQuery({ name: 'profession', description: 'Профессия персоны', required: false })
    @Get()
    findAllPerson(
        @Query('search') search: string,
        @Query('profession') profession: string
    ) {
        return this.movieClient.send('findAllPerson', {search, profession})
            .pipe(catchError(err => throwError(() => new RpcException(err.response))));
    }
}
