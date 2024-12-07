import { Global, Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailsModule } from 'src/mails/mails.module';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => MailsModule)],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
