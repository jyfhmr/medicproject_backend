import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    Res,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('masters/providers')
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) {}

    @Public()
    @Get('export')
    async exportData(@Res() res: Response): Promise<void> {
        const data: any = await this.providersService.getAllBanks();
        await this.providersService.exportDataToExcel(data, res);
    }

    @Public()
    @Get('generate-from-html/:id')
    async generatePdfFromHtml(@Param('id') id: string, @Res() res: Response) {
        const provider = await this.findOne(id);
        await this.providersService.generatePdfFromHtml(provider, res);
    }

    @Post()
    create(@Body() createProviderDto: CreateProviderDto, @Request() req: any) {
        return this.providersService.create(createProviderDto, req.user.sub);
    }

    @Get('list')
    listProviders() {
        return this.providersService.listProviders();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.providersService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.providersService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProviderDto: UpdateProviderDto,
        @Request() req: any,
    ) {
        return this.providersService.update(+id, updateProviderDto, req.user.sub);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.providersService.remove(+id);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.providersService.changeStatus(id);
    }
}
