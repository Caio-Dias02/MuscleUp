import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.redisClient.connect().catch(console.error);
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  /**
   * Obtém um valor do cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      if (!value) return null;
      
      const parsed = JSON.parse(value);
      // Verifica se o valor não é um objeto vazio
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length === 0) {
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.error('Erro ao obter cache:', error);
      return null;
    }
  }

  /**
   * Define um valor no cache
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      // Não salva valores null ou undefined
      if (value === null || value === undefined) {
        return;
      }
      
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redisClient.setEx(key, ttl, serializedValue);
      } else {
        await this.redisClient.set(key, serializedValue);
      }
    } catch (error) {
      console.error('Erro ao definir cache:', error);
    }
  }

  /**
   * Remove um item do cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.error('Erro ao deletar cache:', error);
    }
  }

  /**
   * Remove múltiplos itens do cache baseado em padrão
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length > 0) {
        await this.redisClient.del(keys);
      }
    } catch (error) {
      console.error('Erro ao deletar cache por padrão:', error);
    }
  }

  /**
   * Limpa todo o cache
   */
  async reset(): Promise<void> {
    try {
      await this.redisClient.flushDb();
    } catch (error) {
      console.error('Erro ao resetar cache:', error);
    }
  }

  /**
   * Obtém TTL de uma chave
   */
  async getTTL(key: string): Promise<number> {
    try {
      return await this.redisClient.ttl(key);
    } catch (error) {
      console.error('Erro ao obter TTL:', error);
      return -1;
    }
  }

  /**
   * Verifica se uma chave existe
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Erro ao verificar existência da chave:', error);
      return false;
    }
  }

  /**
   * Gera chave de cache para usuário
   */
  generateUserKey(userId: string, resource: string): string {
    return `user:${userId}:${resource}`;
  }

  /**
   * Gera chave de cache para workout plan
   */
  generateWorkoutPlanKey(userId: string, planId?: string): string {
    return planId 
      ? `user:${userId}:workout-plan:${planId}`
      : `user:${userId}:workout-plans`;
  }

  /**
   * Gera chave de cache para workout day
   */
  generateWorkoutDayKey(userId: string, dayId?: string): string {
    return dayId 
      ? `user:${userId}:workout-day:${dayId}`
      : `user:${userId}:workout-days`;
  }

  /**
   * Gera chave de cache para exercícios
   */
  generateExerciseKey(userId: string, dayId?: string): string {
    return dayId 
      ? `user:${userId}:exercises:${dayId}`
      : `user:${userId}:exercises`;
  }

  /**
   * Invalida cache relacionado a um usuário
   */
  async invalidateUserCache(userId: string): Promise<void> {
    const patterns = [
      `user:${userId}:*`,
      `workout-plans:${userId}:*`,
      `workout-days:${userId}:*`,
      `exercises:${userId}:*`,
    ];

    await Promise.all(
      patterns.map(pattern => this.delPattern(pattern))
    );
  }

  /**
   * Obtém estatísticas do Redis
   */
  async getStats(): Promise<any> {
    try {
      const info = await this.redisClient.info();
      const keys = await this.redisClient.keys('*');
      
      return {
        totalKeys: keys.length,
        info: info,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        error: 'Failed to get stats',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Lista chaves por padrão
   */
  async listKeys(pattern: string = '*'): Promise<string[]> {
    try {
      return await this.redisClient.keys(pattern);
    } catch (error) {
      console.error('Erro ao listar chaves:', error);
      return [];
    }
  }

  /**
   * Health check do Redis
   */
  async healthCheck(): Promise<any> {
    try {
      const testKey = 'health-check';
      const testValue = { timestamp: Date.now() };
      
      await this.set(testKey, testValue, 10);
      const retrieved = await this.get(testKey);
      await this.del(testKey);
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        test: retrieved ? 'passed' : 'failed',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
} 