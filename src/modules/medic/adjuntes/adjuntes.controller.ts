import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, HttpException, UploadedFile } from '@nestjs/common';
import { AdjuntesService } from './adjuntes.service';
import { CreateAdjunteDto } from './dto/create-adjunte.dto';
import { UpdateAdjunteDto } from './dto/update-adjunte.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('adjuntes')
export class AdjuntesController {
  constructor(private readonly adjuntesService: AdjuntesService) {}


  @Post()
  create(@Body() createAdjunteDto: CreateAdjunteDto) {
    return this.adjuntesService.create(createAdjunteDto);
  }

  

  @Get()
  findAll() {
    return this.adjuntesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adjuntesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdjunteDto: UpdateAdjunteDto) {
    return this.adjuntesService.update(+id, updateAdjunteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adjuntesService.remove(+id);
  }
}
