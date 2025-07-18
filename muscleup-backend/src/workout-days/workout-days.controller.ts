import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CreateWorkoutDayDto } from './dto/workout-days.dto';
import { WorkoutDay } from '@prisma/client';
import { WorkoutDaysService } from './workout-days.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('workout-days')
export class WorkoutDaysController {
    constructor(
        private readonly workoutDaysService: WorkoutDaysService,
        private readonly prisma: PrismaService
    ) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createWorkoutDay(@Req() req: any, @Body() createWorkoutDayDto: CreateWorkoutDayDto): Promise<WorkoutDay>{
        return this.workoutDaysService.createWorkoutDay(createWorkoutDayDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAllWorkoutDays(@Req() req: any): Promise<WorkoutDay[]>{
        return this.workoutDaysService.findAllWorkoutDays(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOneWorkoutDay(@Param('id') id: string): Promise<WorkoutDay | null>{
        return this.workoutDaysService.findOneWorkoutDay(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    async updateWorkoutDay(@Param('id') id: string, @Body() updateWorkoutDayDto: CreateWorkoutDayDto): Promise<WorkoutDay>{
        return this.workoutDaysService.updateWorkoutDay(id, updateWorkoutDayDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteWorkoutDay(@Param('id') id: string): Promise<WorkoutDay>{
        try {
            return await this.workoutDaysService.deleteWorkoutDay(id);
        } catch (error) {
            if (error.message === 'Workout day not found') {
                throw new HttpException('Dia de treino não encontrado', HttpStatus.NOT_FOUND);
            }
            
            console.error('Erro ao deletar dia de treino:', error);
            throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
