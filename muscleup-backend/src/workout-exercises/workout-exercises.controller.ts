import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { WorkoutExercisesService } from './workout-exercises.service';
import { CreateWorkoutExerciseDto } from './dto/workout-exercises.dto';
import { WorkoutExercise } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('workout-exercises')
export class WorkoutExercisesController {
    constructor(private readonly workoutExercisesService: WorkoutExercisesService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createWorkoutExercise(@Body() createWorkoutExerciseDto: CreateWorkoutExerciseDto): Promise<WorkoutExercise> {
        return this.workoutExercisesService.createWorkoutExercise(createWorkoutExerciseDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAllWorkoutExercises(@Req() req: any, @Query('workoutDayId') workoutDayId?: string): Promise<WorkoutExercise[]> {
        if (workoutDayId) {
            return this.workoutExercisesService.findExercisesByWorkoutDay(workoutDayId);
        }
        return this.workoutExercisesService.findAllWorkoutExercises(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOneWorkoutExercise(@Param('id') id: string): Promise<WorkoutExercise | null> {
        return this.workoutExercisesService.findOneWorkoutExercise(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    async updateWorkoutExercise(@Param('id') id: string, @Body() updateWorkoutExerciseDto: CreateWorkoutExerciseDto): Promise<WorkoutExercise> {
        return this.workoutExercisesService.updateWorkoutExercise(id, updateWorkoutExerciseDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteWorkoutExercise(@Param('id') id: string): Promise<WorkoutExercise> {
        try {
            return await this.workoutExercisesService.deleteWorkoutExercise(id);
        } catch (error) {
            if (error.message === 'Workout exercise not found') {
                throw new HttpException('Exercício não encontrado', HttpStatus.NOT_FOUND);
            }
            
            console.error('Erro ao deletar exercício:', error);
            throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
