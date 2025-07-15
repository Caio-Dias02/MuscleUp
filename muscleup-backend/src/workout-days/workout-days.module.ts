import { Module } from '@nestjs/common';
import { WorkoutDaysController } from './workout-days.controller';
import { WorkoutDaysService } from './workout-days.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutDaysController],
  providers: [WorkoutDaysService]
})
export class WorkoutDaysModule {}
