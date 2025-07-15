import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(userData: RegisterDto, hashedPassword: string){
        const user = await this.prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                passwordHash: hashedPassword,
                birthDate: new Date(), // Data atual como padrão
                height: 0, // Valor padrão
                weight: 0, // Valor padrão
                role: 'USER'
            }
        })
        return user;
    }

    async findByEmail(email: string){
        return this.prisma.user.findUnique({
            where: { email }
        })
    }
}
