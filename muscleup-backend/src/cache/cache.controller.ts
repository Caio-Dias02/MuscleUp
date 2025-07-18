import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { CacheMonitorService } from './cache-monitor.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cache')
@UseGuards(AuthGuard('jwt'))
export class CacheController {
  constructor(private readonly cacheMonitorService: CacheMonitorService) {}

  @Get('stats')
  async getCacheStats() {
    return this.cacheMonitorService.getCacheStats();
  }

  @Get('keys')
  async listCacheKeys() {
    return this.cacheMonitorService.listCacheKeys();
  }

  @Get('keys/:pattern')
  async listCacheKeysByPattern(@Param('pattern') pattern: string) {
    return this.cacheMonitorService.listCacheKeys(pattern);
  }

  @Get('key/:key')
  async getKeyInfo(@Param('key') key: string) {
    return this.cacheMonitorService.getKeyInfo(key);
  }

  @Delete('pattern/:pattern')
  async clearCacheByPattern(@Param('pattern') pattern: string) {
    return this.cacheMonitorService.clearCacheByPattern(pattern);
  }

  @Get('health')
  async healthCheck() {
    return this.cacheMonitorService.healthCheck();
  }
} 