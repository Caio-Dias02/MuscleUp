import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';

@Injectable()
export class CacheMonitorService {
  constructor(private cacheService: CacheService) {}

  /**
   * Obtém estatísticas do cache
   */
  async getCacheStats() {
    return this.cacheService.getStats();
  }

  /**
   * Lista todas as chaves no cache
   */
  async listCacheKeys(pattern: string = '*') {
    return this.cacheService.listKeys(pattern);
  }

  /**
   * Obtém informações de uma chave específica
   */
  async getKeyInfo(key: string) {
    try {
      const value = await this.cacheService.get(key);
      const ttl = await this.cacheService.getTTL(key);
      
      return {
        key,
        value,
        ttl,
        size: JSON.stringify(value).length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erro ao obter informações da chave:', error);
      return null;
    }
  }

  /**
   * Limpa cache por padrão
   */
  async clearCacheByPattern(pattern: string) {
    try {
      const keys = await this.cacheService.listKeys(pattern);
      let deletedCount = 0;
      
      for (const key of keys) {
        await this.cacheService.del(key);
        deletedCount++;
      }
      
      return {
        pattern,
        deletedCount,
        message: `Deleted ${deletedCount} keys matching pattern: ${pattern}`,
      };
    } catch (error) {
      console.error('Erro ao limpar cache por padrão:', error);
      return {
        error: 'Failed to clear cache by pattern',
        pattern,
      };
    }
  }

  /**
   * Health check do cache
   */
  async healthCheck() {
    return this.cacheService.healthCheck();
  }
} 