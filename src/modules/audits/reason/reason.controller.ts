import { ReasonService } from './reason.service';
import { CreateReasonDto } from './dto/create-reason.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';
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

@Controller('audits/reason')
export class ReasonController {
    constructor(private readonly reasonService: ReasonService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.reasonService.findAll(query);
        await this.reasonService.exportDataToExcel(data.data, res);
    }

    @Post()
    async create(@Body() createReasonDto: CreateReasonDto, @Request() req: any) {
        try {
            return await this.reasonService.create(createReasonDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get()
    findAll(@Query() query: any) {
        return this.reasonService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.reasonService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateReasonDto: UpdateReasonDto, @Request() req: any) {
        return this.reasonService.update(+id, updateReasonDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.reasonService.changeStatus(id);
    }
}
