import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkoutPlansModule } from './workout-plans/workout-plans.module';
import { WorkoutDaysModule } from './workout-days/workout-days.module';
import { WorkoutExercisesModule } from './workout-exercises/workout-exercises.module';

@Module({
  imports: [AuthModule, UsersModule, WorkoutPlansModule, WorkoutDaysModule, WorkoutExercisesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
