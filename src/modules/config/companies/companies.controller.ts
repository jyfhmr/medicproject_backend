import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Request,
    Query,
    ParseIntPipe,
    UseInterceptors,
    Res,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    UploadedFiles,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@ApiTags('config/companies')
@Controller('config/companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.companiesService.findAll(query);
        await this.companiesService.exportDataToExcel(data.data, res);
    }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'logo' },
                { name: 'rifFile' },
                { name: 'rifLegalRepresentativeFile' },
                { name: 'sealFile' },
                { name: 'signatureFile' },
            ],
            {
                storage: diskStorage({
                    destination: './uploads/companies',
                    filename(req, file, callback) {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = extname(file.originalname);
                        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                        callback(null, filename);
                    },
                }),
            },
        ),
    )
    create(
        @Body() createCompanyDto: any,
        @Request() req: any,
        @UploadedFiles()
        files: {
            logo?: Express.Multer.File[];
            rifFile?: Express.Multer.File[];
            rifLegalRepresentativeFile?: Express.Multer.File[];
            sealFile?: Express.Multer.File[];
            signatureFile?: Express.Multer.File[];
        },
    ) {
        console.log('datos que llegaron', createCompanyDto);
        return this.companiesService.create(createCompanyDto, req.user.sub, files);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.companiesService.findAll(query);
    }

    @Get('list')
    listCompanies() {
        return this.companiesService.listCompanies();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.companiesService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'logo' },
                { name: 'rifFile' },
                { name: 'rifLegalRepresentativeFile' },
                { name: 'sealFile' },
                { name: 'signatureFile' },
            ],
            {
                storage: diskStorage({
                    destination: './uploads/companies',
                    filename(req, file, callback) {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = extname(file.originalname);
                        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                        callback(null, filename);
                    },
                }),
            },
        ),
    )
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCompanyDto: UpdateCompanyDto,
        @Request() req: any,
        @UploadedFiles()
        files: {
            logo?: Express.Multer.File[];
            rifFile?: Express.Multer.File[];
            rifLegalRepresentativeFile?: Express.Multer.File[];
            sealFile?: Express.Multer.File[];
            signatureFile?: Express.Multer.File[];
        },
    ) {
        return this.companiesService.update(id, updateCompanyDto, req.user.sub, files);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.companiesService.changeStatus(id);
    }
}
