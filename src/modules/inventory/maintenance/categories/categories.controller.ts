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
    UseInterceptors,
    BadRequestException,
    UploadedFile,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('inventory/maintenance/categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.categoriesService.findAll(query);
        await this.categoriesService.exportDataToExcel(data.data, res);
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
        return this.categoriesService.processExcel(file.buffer);
    }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto, @Request() req: any) {
        return this.categoriesService.create(createCategoryDto, req.user.sub);
    }

    @Get('list')
    listCategories() {
        return this.categoriesService.listCategories();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.categoriesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(+id, updateCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(+id);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.changeStatus(id);
    }
}
