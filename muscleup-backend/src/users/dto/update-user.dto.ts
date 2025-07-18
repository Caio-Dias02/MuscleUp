import { IsOptional, IsString, IsEmail, IsDateString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Gender, ActivityLevel, Goal } from '@prisma/client';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsDateString()
    birthDate?: string;

    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    @IsInt()
    @Min(50)
    @Max(300)
    height?: number;

    @IsOptional()
    @IsInt()
    @Min(20)
    @Max(500)
    weight?: number;

    @IsOptional()
    @IsEnum(ActivityLevel)
    activityLevel?: ActivityLevel;

    @IsOptional()
    @IsEnum(Goal)
    goal?: Goal;

    @IsOptional()
    @IsString()
    profilePictureUrl?: string;
} 