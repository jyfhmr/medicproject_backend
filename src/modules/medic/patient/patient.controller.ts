import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Public } from 'src/decorators/isPublic.decorator';

@Controller('medic/patient')
export class PatientController {
    constructor(private readonly patientService: PatientService) {}

    @HttpCode(201)
    @Public()
    @Post()
    create(@Body() createPatientDto: CreatePatientDto) {
        return this.patientService.create(createPatientDto);
    }

    @Get()
    @Public()
    findAll(@Query() query: any) {
        return this.patientService.findAll(query);
    }

    @HttpCode(200)
    @Get('/findAllOfThem')
    findAllOfThem() {
        return this.patientService.findAllOfThem();
    }

    @HttpCode(200)
    @Get('/findByDni')
    findByDni(@Query('dni') dni: string) {
        console.log('DNI ENVIADO', dni);
        return this.patientService.findByDni(dni);
    }

    @Get(':id')
    @Public()
    findOne(@Param('id') id: string) {
        return this.patientService.findOne(+id);
    }

    @Patch(':id')
    @Public()
    update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
        return this.patientService.update(+id, updatePatientDto);
    }

    @Delete(':id')
    @Public()
    remove(@Param('id') id: string) {
        return this.patientService.remove(+id);
    }
}
