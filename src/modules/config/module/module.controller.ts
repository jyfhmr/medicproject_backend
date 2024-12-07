import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Request,
    Query,
    Res,
    ConflictException,
    ParseIntPipe,
} from '@nestjs/common';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('config/module')
export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.moduleService.findAll(query);
        await this.moduleService.exportDataToExcel(data.data, res);
    }

    @Post()
    async create(@Body() createModuleDto: CreateModuleDto, @Request() req: any) {
        try {
            return await this.moduleService.create(createModuleDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get()
    findAll(@Query() query: any) {
        return this.moduleService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.moduleService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto, @Request() req: any) {
        return this.moduleService.update(+id, updateModuleDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.moduleService.changeStatus(id);
    }
}
