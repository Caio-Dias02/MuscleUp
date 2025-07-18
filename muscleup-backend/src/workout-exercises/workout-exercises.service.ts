import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkoutExercise } from '@prisma/client';
import { CreateWorkoutExerciseDto } from './dto/workout-exercises.dto';

@Injectable()
export class WorkoutExercisesService {
    constructor(private readonly prisma: PrismaService) {}

    async createWorkoutExercise(workoutExercise: CreateWorkoutExerciseDto): Promise<WorkoutExercise>{
        return this.prisma.workoutExercise.create({
            data: {
                name: workoutExercise.name,
                sets: workoutExercise.sets,
                reps: workoutExercise.reps,
                weight: workoutExercise.weight,
                workoutDayId: workoutExercise.workoutDayId
            }
        })
    }

    async findAllWorkoutExercises(userId: string): Promise<WorkoutExercise[]>{
        return this.prisma.workoutExercise.findMany({
            where: {
                workoutDay: {
                    workoutPlan: {
                        userId: userId
                    }
                }
            }
        })
    }

    async findExercisesByWorkoutDay(workoutDayId: string): Promise<WorkoutExercise[]>{
        return this.prisma.workoutExercise.findMany({
            where: {
                workoutDayId: workoutDayId
            }
        })
    }

    async findOneWorkoutExercise(id: string): Promise<WorkoutExercise | null>{
        return this.prisma.workoutExercise.findUnique({
            where: {
                id: id
            }
        })
    }

    async updateWorkoutExercise(id: string, workoutExercise: CreateWorkoutExerciseDto): Promise<WorkoutExercise>{
        // First check if the workout exercise exists
        const existingExercise = await this.prisma.workoutExercise.findUnique({
            where: { id: id }
        });

        if (!existingExercise) {
            throw new Error('Workout exercise not found');
        }

        return this.prisma.workoutExercise.update({
            where: {
                id: id
            },
            data: workoutExercise
        })
    }

    async deleteWorkoutExercise(id: string): Promise<WorkoutExercise>{
        // First check if the workout exercise exists
        const existingExercise = await this.prisma.workoutExercise.findUnique({
            where: { id: id }
        });

        if (!existingExercise) {
            throw new Error('Workout exercise not found');
        }

        return this.prisma.workoutExercise.delete({
            where: {
                id: id
            }
        })
    }
}
