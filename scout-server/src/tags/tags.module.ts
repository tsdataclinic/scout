import { Module } from '@nestjs/common';
import { Tag } from './tags.entity';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagsService, TagsResolver],
  exports: [TagsService],
})
export class TagsModule {}
