import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ProfilesService } from 'src/modules/config/profiles/profiles.service';
import { UsersService } from 'src/modules/config/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private profilesService: ProfilesService,
        private jwtService: JwtService,
    ) {}

    async signIn(
        username: string,
        pass: string,
    ): Promise<{
        access_token: string;
        name: string;
        username: string;
        profileId: number;
        userId: number;
    }> {
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            throw new UnauthorizedException('Usuario invalido');
        }

        const perfil = await this.profilesService.findOne(user.profile.id);
        if (!perfil || !perfil.pages) {
            throw new Error('Profile or profile pages not found');
        }

        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Clave invalida');
        }

        const payload = { sub: user.id, username: user.email, name: user.name };

        return {
            access_token: await this.jwtService.signAsync(payload),
            name: user.name,
            username: user.email,
            profileId: user.profile.id,
            userId: user.id,
        };
    }

    async getMenu(idProfile: number): Promise<{
        menu: any[];
    }> {
        const perfil = await this.profilesService.findOne(idProfile);
        if (!perfil || !perfil.pages) {
            throw new Error('Profile or profile pages not found');
        }

        const menu = await Promise.all(
            perfil.pages.map(async (el) => {
                if (el.active && el.modules && el.modules.some((mod) => mod.active)) {
                    const modules = await Promise.all(
                        el.modules
                            .filter((mod) => mod.active)
                            .map(async (mod) => {
                                return {
                                    key: mod.id,
                                    label: mod.name,
                                    icon: `<${mod.icon} />`,
                                    order: mod?.order,
                                    children: await Promise.all(
                                        mod.pages
                                            .filter((pag) => pag.active)
                                            .map(async (pag) => {
                                                if (pag.pages.length > 0) {
                                                    return {
                                                        key: `pag-id-${pag.id}`,
                                                        label: pag.name,
                                                        order: pag?.order,
                                                        children: await Promise.all(
                                                            pag.pages
                                                                .filter((Child) => Child.active)
                                                                .map(async (Child) => {
                                                                    return {
                                                                        key: `pag-id-${pag.id}-${Child.id}`,
                                                                        label: Child.name,
                                                                        order: Child?.order,
                                                                        route: Child.route,
                                                                    };
                                                                }),
                                                        ),
                                                    };
                                                } else {
                                                    return {
                                                        key: `pag-id-${pag.id}`,
                                                        label: pag.name,
                                                        order: pag?.order,
                                                        route: pag.route,
                                                    };
                                                }
                                            }),
                                    ),
                                };
                            }),
                    );
                    // Ordenar los módulos y sus páginas según el campo `order`
                    modules.sort((a, b) => a.order - b.order);
                    modules.forEach((mod) => {
                        if (mod.children) {
                            mod.children.sort((a, b) => a.order - b.order);
                            mod.children.forEach((child) => {
                                if (child.children) {
                                    child.children.sort((a, b) => a.order - b.order);
                                }
                            });
                        }
                    });
                    return modules;
                }
            }),
        );

        return {
            menu: menu.flat().filter(Boolean), // Asegúrate de aplanar y filtrar el array para remover los `undefined`
        };
    }
}
