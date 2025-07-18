import { Module } from '@nestjs/common';
import { WorkoutPlansController } from './workout-plans.controller';
import { WorkoutPlansService } from './workout-plans.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutPlansController],
  providers: [WorkoutPlansService, CacheService]
})
export class WorkoutPlansModule {}
