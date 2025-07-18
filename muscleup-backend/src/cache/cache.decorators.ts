import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache_key_metadata';
export const CACHE_TTL_METADATA = 'cache_ttl_metadata';

/**
 * Decorator para marcar métodos que devem usar cache
 */
export const Cacheable = (key: string, ttl?: number) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY_METADATA, key)(target, propertyKey, descriptor);
    if (ttl) {
      SetMetadata(CACHE_TTL_METADATA, ttl)(target, propertyKey, descriptor);
    }
    return descriptor;
  };
};

/**
 * Decorator para invalidar cache após operações
 */
export const CacheInvalidate = (pattern: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata('cache_invalidate', pattern)(target, propertyKey, descriptor);
    return descriptor;
  };
};

/**
 * Decorator para cache de usuário específico
 */
export const UserCache = (resource: string, ttl?: number) => {
  return Cacheable(`user:{userId}:${resource}`, ttl);
};

/**
 * Decorator para cache de workout plans
 */
export const WorkoutPlanCache = (ttl?: number) => {
  return Cacheable('workout-plans:{userId}', ttl);
};

/**
 * Decorator para cache de workout days
 */
export const WorkoutDayCache = (ttl?: number) => {
  return Cacheable('workout-days:{userId}', ttl);
};

/**
 * Decorator para cache de exercícios
 */
export const ExerciseCache = (ttl?: number) => {
  return Cacheable('exercises:{userId}', ttl);
}; 