import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutPlanDto } from './dto/create-workoutplan.dto';


@Injectable()
export class WorkoutPlansService {
    constructor(private readonly prisma: PrismaService) {}

    async getFullWorkoutPlan(planId: string, userId: string){
        return this.prisma.workoutPlan.findUnique({
            where: {
                id: planId,
                userId: userId
            },
            include: {
                workoutDays: {
                    include: {
                        workoutExercises: true
                    }
                }
            }
        })
    }

    async createWorkoutPlan(userId: string, workoutPlan: CreateWorkoutPlanDto){
        return this.prisma.workoutPlan.create({
            data: {
                ...workoutPlan,
                userId: userId
            }
        })
    }

    async findAllWorkoutPlans(userId: string){
        return this.prisma.workoutPlan.findMany({
            where: {
                userId: userId
            }
        })
    }

    async findOneWorkoutPlan(id: string){
        return this.prisma.workoutPlan.findUnique({
            where: {
                id: id
            }
        })
    }

    async updateWorkoutPlan(id: string, workoutPlan: CreateWorkoutPlanDto){
        return this.prisma.workoutPlan.update({
            where: {
                id: id
            },
            data: workoutPlan
        })
    }

    async deleteWorkoutPlan(id: string){
        return this.prisma.workoutPlan.delete({
            where: {
                id: id
            }
        })
    }
}
