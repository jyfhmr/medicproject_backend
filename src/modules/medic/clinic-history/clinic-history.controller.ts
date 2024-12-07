import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    Request,
    Query,
    ParseIntPipe,
    UsePipes,
    HttpException,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ClinicHistoryService } from './clinic-history.service';
import { CreateClinicHistoryDto } from './dto/create-clinic-history.dto';
import { UpdateClinicHistoryDto } from './dto/update-clinic-history.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Adjunte } from '../adjuntes/entities/adjunte.entity';
import { Repository } from 'typeorm';
import { AdjuntesService } from '../adjuntes/adjuntes.service';
import { Adjuntesv2Service } from '../adjuntesv2/adjuntesv2.service';

@Controller('medic/clinic-history')
export class ClinicHistoryController {
    constructor(
        private readonly clinicHistoryService: ClinicHistoryService,

        // private readonly adjuntesService: AdjuntesService,

        private readonly adjuntesService: Adjuntesv2Service,
    ) {}

    @HttpCode(201)
    @Post()
    create(@Body() createClinicHistoryDto: CreateClinicHistoryDto, @Request() req: any) {
        return this.clinicHistoryService.create(createClinicHistoryDto, req.user.sub);
    }

    @HttpCode(200)
    @Public()
    @Post('save')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'fileData', maxCount: 10 }, // Asegúrate de que 'fileData' coincida con el frontend
            ],
            {
                storage: diskStorage({
                    destination: './uploads/adjuntes', // Carpeta donde se guardan las imágenes
                    filename: (req, file, cb) => {
                        const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
                        cb(null, uniqueSuffix); // Guardar el archivo con un nombre único
                    },
                }),
            },
        ),
    )
    async save(
        @UploadedFiles() files: { fileData: Express.Multer.File[] }, // Los archivos estarán bajo `fileData`
        @Request() req: any,
    ) {
        console.log('Files', files);
        console.log('el requestbody', req.body);
        console.log('Archivos recibidos:', files.fileData);
        console.log('captions:', req.body.caption);
        // Los archivos están bajo `fileData`, accedemos a ellos

        try {
            const savedFiles = [];

            for (let i = 0; i < files.fileData.length; i++) {
                const imageObject = {
                    url: files.fileData[i].path,
                    note: req.body.caption[i],
                    clinicHistoryId: req.body.idClinicHistory,
                };

                //Cuando es una sola imágen no llega como array
                if (typeof req.body.caption === 'string') {
                    imageObject.note = req.body.caption;
                }

                const adjunteSaved = await this.adjuntesService.create(imageObject);
                console.log('adjunto recien guardado', adjunteSaved);
                savedFiles.push(imageObject);
            }
            console.log('Saved files', savedFiles);
        } catch (error) {
            throw new HttpException("No se pudo guardar las imágenes, inténtelo más tarde",500)
        }
    }

    @Get()
    findAll(@Query() query: any) {
        return this.clinicHistoryService.findAll(query);
    }

    @HttpCode(200)
    @Get('findConsultNumber')
    async findConsultNumber(@Query('idPatient') idPatient: string, @Request() req: any) {
        console.log('buscando este idPatient', idPatient);

        const patientId = Number(idPatient);

        if (isNaN(patientId)) {
            throw new HttpException('El idPatient no es válido', 400);
        }

        return this.clinicHistoryService.findConsultNumber(patientId, req.user.sub);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clinicHistoryService.findOne(+id);
    }

    @HttpCode(201)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateClinicHistoryDto: UpdateClinicHistoryDto) {
        console.log('llegando para acá');
        return this.clinicHistoryService.update(+id, updateClinicHistoryDto);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.clinicHistoryService.changeStatus(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.clinicHistoryService.remove(+id);
    }
}
