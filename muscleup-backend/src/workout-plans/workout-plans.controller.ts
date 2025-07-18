import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { WorkoutPlansService } from './workout-plans.service';
import { CreateWorkoutPlanDto } from './dto/create-workoutplan.dto';
import { WorkoutPlan } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('workout-plans')
export class WorkoutPlansController {
    constructor(private readonly workoutPlansService: WorkoutPlansService) {}

    @Get(':id/full')
    @UseGuards(AuthGuard('jwt'))
    async getFullWorkoutPlan(@Param('id') id: string, @Req() req: any): Promise<WorkoutPlan | null>{
        return this.workoutPlansService.getFullWorkoutPlan(id, req.user.id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createWorkoutPlan(@Req() req: any, @Body() createWorkoutPlanDto: CreateWorkoutPlanDto): Promise<WorkoutPlan>{
        return this.workoutPlansService.createWorkoutPlan(req.user.id, createWorkoutPlanDto);
    }   

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAllWorkoutPlans(@Req() req: any): Promise<WorkoutPlan[]>{
        return this.workoutPlansService.findAllWorkoutPlans(req.user.id);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findOneWorkoutPlan(@Param('id') id: string): Promise<WorkoutPlan | null>{
        return this.workoutPlansService.findOneWorkoutPlan(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    async updateWorkoutPlan(@Param('id') id: string, @Body() updateWorkoutPlanDto: CreateWorkoutPlanDto): Promise<WorkoutPlan>{
        return this.workoutPlansService.updateWorkoutPlan(id, updateWorkoutPlanDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteWorkoutPlan(@Param('id') id: string){
        try {
            return await this.workoutPlansService.deleteWorkoutPlan(id);
        } catch (error) {
            if (error.message === 'Workout plan not found') {
                throw new HttpException('Plano de treino não encontrado', HttpStatus.NOT_FOUND);
            }
            
            console.error('Erro ao deletar plano de treino:', error);
            throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
