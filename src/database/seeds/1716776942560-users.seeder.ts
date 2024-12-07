import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/config/users/entities/user.entity';
import { Profile } from 'src/modules/config/profiles/entities/profile.entity';

export default class UserSeeder implements Seeder {
    track = false;

    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const repository = dataSource.getRepository(User);
        const password = '123456';
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const repositoryProfile = dataSource.getRepository(Profile);

        const profile = await repositoryProfile.save({
            name: 'Administrador',
            description: 'Administrador',
        });

        await repository.insert({
            name: 'Alex',
            email: 'alex@admin.com',
            password: hashedPassword,
            profile: profile,
            fullName: 'Alex',
            phoneNumber: '00000000',
            dni: '123345656',
        });

        await repository.insert({
            name: 'Jesus',
            email: 'jesus@admin.com',
            password: hashedPassword,
            profile: profile,
            fullName: 'Jesus',
            phoneNumber: '00000000',
            dni: '123345656',
        });

        await repository.insert({
            name: 'Angel',
            email: 'angel@admin.com',
            password: hashedPassword,
            profile: profile,
            fullName: 'Angel',
            phoneNumber: '00000000',
            dni: '123345656',
        });

        await repository.insert({
            name: 'Jose',
            email: 'jose@admin.com',
            password: hashedPassword,
            profile: profile,
            fullName: 'jose',
            phoneNumber: '00000000',
            dni: '123345656',
        });

        await repository.insert({
            name: 'Yoel',
            email: 'yoel@admin.com',
            password: hashedPassword,
            profile: profile,
            fullName: 'yoel',
            phoneNumber: '00000000',
            dni: '123345656',
        });

        await repository.insert({
            name: 'Cesar',
            email: 'cesar@admin.com',
            password: hashedPassword,
            profile: profile,
            fullName: 'cesar',
            phoneNumber: '00000000',
            dni: '123345656',
        });
    }
}
