import { forwardRef, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { DatasetModule } from '../dataset/dataset.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { SearchController } from './search.controller';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        sniffOnStart: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    forwardRef(() => DatasetModule),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
