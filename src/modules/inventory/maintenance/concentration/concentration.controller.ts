import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Res,
    Delete,
    Request,
    Query,
    ParseIntPipe,
    UseInterceptors,
    BadRequestException,
    UploadedFile,
} from '@nestjs/common';
import { ConcentrationService } from './concentration.service';
import { CreateConcentrationDto } from './dto/create-concentration.dto';
import { UpdateConcentrationDto } from './dto/update-concentration.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('inventory/maintenance/concentration')
export class ConcentrationController {
    constructor(private readonly concentrationService: ConcentrationService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.concentrationService.findAll(query);
        await this.concentrationService.exportDataToExcel(data.data, res);
    }

    @Public()
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: multer.memoryStorage(), // Guardar el archivo en memoria para facilitar la lectura
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(xls|xlsx)$/)) {
                    return cb(new BadRequestException('Only Excel files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Llamar al servicio para procesar el archivo Excel
        return this.concentrationService.processExcel(file.buffer);
    }

    @Post()
    create(@Body() createConcentrationDto: CreateConcentrationDto, @Request() req: any) {
        return this.concentrationService.create(createConcentrationDto, req.user.sub);
    }

    @Get('list')
    listConcentration() {
        return this.concentrationService.listConcentration();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.concentrationService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.concentrationService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateConcentrationDto: UpdateConcentrationDto) {
        return this.concentrationService.update(+id, updateConcentrationDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.concentrationService.remove(+id);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.concentrationService.changeStatus(id);
    }
}
