import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateWorkoutDayDto } from './dto/workout-days.dto';
import { WorkoutDay } from '@prisma/client';
import { WorkoutDaysService } from './workout-days.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('workout-days')
export class WorkoutDaysController {
    constructor(private readonly workoutDaysService: WorkoutDaysService) {}

    @Post()
    async createWorkoutDay( @Body() createWorkoutDayDto: CreateWorkoutDayDto): Promise<WorkoutDay>{
        return this.workoutDaysService.createWorkoutDay(createWorkoutDayDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAllWorkoutDays(@Param('workoutPlanId') workoutPlanId: string): Promise<WorkoutDay[]>{
        return this.workoutDaysService.findAllWorkoutDays(workoutPlanId);
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
    async deleteWorkoutDay(@Param('id') id: string): Promise<WorkoutDay>{
        return this.workoutDaysService.deleteWorkoutDay(id);
    }
}
