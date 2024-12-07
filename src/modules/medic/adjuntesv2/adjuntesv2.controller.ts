import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseIntPipe } from '@nestjs/common';
import { Adjuntesv2Service } from './adjuntesv2.service';
import { CreateAdjuntesv2Dto } from './dto/create-adjuntesv2.dto';
import { UpdateAdjuntesv2Dto } from './dto/update-adjuntesv2.dto';

@Controller('adjuntesv2')
export class Adjuntesv2Controller {
  constructor(private readonly adjuntesv2Service: Adjuntesv2Service) {}

  @Post()
  create(@Body() createAdjuntesv2Dto: CreateAdjuntesv2Dto) {
    return this.adjuntesv2Service.create(createAdjuntesv2Dto);
  }

  @HttpCode(200)
  @Post("updateManyAdjuntes")
  updateMany(@Body() createAdjunteDto: any[]) {
    return this.adjuntesv2Service.updateMany(createAdjunteDto);
  }

  @HttpCode(201)
  @Post('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.adjuntesv2Service.deleteBy(id);
  }
 
  @Get()
  findAll() {
    return this.adjuntesv2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adjuntesv2Service.findOne(+id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdjuntesv2Dto: UpdateAdjuntesv2Dto) {
    return this.adjuntesv2Service.update(+id, updateAdjuntesv2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adjuntesv2Service.remove(+id);
  }
}
