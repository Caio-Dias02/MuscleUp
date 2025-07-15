import { Module } from '@nestjs/common';
import { WorkoutExercisesController } from './workout-exercises.controller';
import { WorkoutExercisesService } from './workout-exercises.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutExercisesController],
  providers: [WorkoutExercisesService]
})
export class WorkoutExercisesModule {}
