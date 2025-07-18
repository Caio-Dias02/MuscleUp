import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheMonitorService } from './cache-monitor.service';
import { CacheController } from './cache.controller';

@Module({
  controllers: [CacheController],
  providers: [CacheService, CacheMonitorService],
  exports: [CacheService, CacheMonitorService],
})
export class RedisCacheModule {} 