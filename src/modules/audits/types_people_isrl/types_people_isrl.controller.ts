import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { TypesPeopleIsrlService } from './types_people_isrl.service';
import { CreateTypesPeopleIsrlDto } from './dto/create-types_people_isrl.dto';
import { UpdateTypesPeopleIsrlDto } from './dto/update-types_people_isrl.dto';

@Controller('audits/types-people-isrl')
export class TypesPeopleIsrlController {
    constructor(private readonly typesPeopleIsrlService: TypesPeopleIsrlService) {}

    @Post()
    create(@Body() createTypesPeopleIsrlDto: CreateTypesPeopleIsrlDto, @Request() req: any) {
        return this.typesPeopleIsrlService.create(createTypesPeopleIsrlDto, req.user.sub);
    }

    @Get('list')
    listTypesPeopleISRL() {
        return this.typesPeopleIsrlService.listTypesPeopleISRL();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.typesPeopleIsrlService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.typesPeopleIsrlService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTypesPeopleIsrlDto: UpdateTypesPeopleIsrlDto) {
        return this.typesPeopleIsrlService.update(+id, updateTypesPeopleIsrlDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.typesPeopleIsrlService.remove(+id);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.typesPeopleIsrlService.changeStatus(id);
    }
}
