import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    ParseIntPipe,
    Res,
    Request,
    ConflictException,
    HttpCode,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('treasury/maintenance/account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.accountService.findAll(query);
        await this.accountService.exportDataToExcel(data.data, res);
    }

    @Post()
    async create(@Body() createAccountDto: CreateAccountDto, @Request() req: any) {
        console.log(req.body.bank);
        try {
            return await this.accountService.create(createAccountDto, req.user.sub, req.body.bank);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get()
    findAll(@Query() query: any) {
        return this.accountService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.accountService.findOne(id);
    }

    @HttpCode(200) 
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAccountDto: UpdateAccountDto,
        @Request() req: any,
    ) {
        return this.accountService.update(+id, updateAccountDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.accountService.changeStatus(id);
    }
}
