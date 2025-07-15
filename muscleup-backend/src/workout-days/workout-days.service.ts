import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkoutDay } from '@prisma/client';
import { CreateWorkoutDayDto } from './dto/workout-days.dto';

@Injectable()
export class WorkoutDaysService {
    constructor(private readonly prisma: PrismaService) {}

    async createWorkoutDay(workoutDay: CreateWorkoutDayDto): Promise<WorkoutDay>{
        return this.prisma.workoutDay.create({
            data: {
                name: workoutDay.name,
                dayOfWeek: workoutDay.dayOfWeek,
                workoutPlanId: workoutDay.workoutPlanId
            }
        })
    }

    async findAllWorkoutDays(workoutPlanId: string): Promise<WorkoutDay[]>{
        return this.prisma.workoutDay.findMany({
            where: {
                workoutPlanId: workoutPlanId
            }
        })
    }

    async findOneWorkoutDay(id: string): Promise<WorkoutDay | null>{
        return this.prisma.workoutDay.findUnique({
            where: {
                id: id
            }
        })
    }

    async updateWorkoutDay(id: string, workoutDay: CreateWorkoutDayDto): Promise<WorkoutDay>{
        return this.prisma.workoutDay.update({
            where: {
                id: id
            },
            data: workoutDay
        })
    }

    async deleteWorkoutDay(id: string): Promise<WorkoutDay>{
        return this.prisma.workoutDay.delete({
            where: {
                id: id
            }
        })
    }
}
