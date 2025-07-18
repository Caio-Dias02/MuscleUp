import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutPlanDto } from './dto/create-workoutplan.dto';
import { CacheService } from '../cache/cache.service';
import { WorkoutPlan } from '@prisma/client';

@Injectable()
export class WorkoutPlansService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cacheService: CacheService
    ) {}

    async getFullWorkoutPlan(planId: string, userId: string): Promise<WorkoutPlan | null> {
        const cacheKey = this.cacheService.generateWorkoutPlanKey(userId, planId);
        const cached = await this.cacheService.get<WorkoutPlan>(cacheKey);
        
        if (cached) {
            return cached;
        }

        const result = await this.prisma.workoutPlan.findUnique({
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
        });

        if (result) {
            await this.cacheService.set(cacheKey, result, 300);
        }

        return result;
    }

    async createWorkoutPlan(userId: string, workoutPlan: CreateWorkoutPlanDto): Promise<WorkoutPlan> {
        const result = await this.prisma.workoutPlan.create({
            data: {
                ...workoutPlan,
                userId: userId
            }
        });

        // Invalida cache relacionado
        await this.cacheService.invalidateUserCache(userId);
        
        return result;
    }

    async findAllWorkoutPlans(userId: string): Promise<WorkoutPlan[]> {
        const cacheKey = this.cacheService.generateWorkoutPlanKey(userId);
        const cached = await this.cacheService.get<WorkoutPlan[]>(cacheKey);
        
        if (cached && Array.isArray(cached)) {
            return cached;
        }

        const result = await this.prisma.workoutPlan.findMany({
            where: {
                userId: userId
            }
        });

        await this.cacheService.set(cacheKey, result, 300);
        return result;
    }

    async findOneWorkoutPlan(id: string): Promise<WorkoutPlan | null> {
        const cacheKey = `workout-plan:${id}`;
        const cached = await this.cacheService.get<WorkoutPlan>(cacheKey);
        
        if (cached) {
            return cached;
        }

        const result = await this.prisma.workoutPlan.findUnique({
            where: {
                id: id
            }
        });

        if (result) {
            await this.cacheService.set(cacheKey, result, 300);
        }

        return result;
    }

    async updateWorkoutPlan(id: string, workoutPlan: CreateWorkoutPlanDto): Promise<WorkoutPlan> {
        // First check if the workout plan exists
        const existingPlan = await this.prisma.workoutPlan.findUnique({
            where: { id: id }
        });

        if (!existingPlan) {
            throw new Error('Workout plan not found');
        }

        const result = await this.prisma.workoutPlan.update({
            where: {
                id: id
            },
            data: workoutPlan
        });

        // Invalida cache relacionado
        await this.cacheService.invalidateUserCache(existingPlan.userId);
        
        return result;
    }

    async deleteWorkoutPlan(id: string): Promise<WorkoutPlan> {
        // First check if the workout plan exists
        const existingPlan = await this.prisma.workoutPlan.findUnique({
            where: { id: id }
        });

        if (!existingPlan) {
            throw new Error('Workout plan not found');
        }

        const result = await this.prisma.workoutPlan.delete({
            where: {
                id: id
            }
        });

        // Invalida cache relacionado
        await this.cacheService.invalidateUserCache(existingPlan.userId);
        
        return result;
    }
}
