import { forwardRef, Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsResolver } from './collections.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './collections.entity';
import { DatasetModule } from '../dataset/dataset.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection]),
    forwardRef(() => DatasetModule),
    forwardRef(() => UsersModule),
  ],
  providers: [CollectionsService, CollectionsResolver],
  exports: [CollectionsService],
})
export class CollectionsModule {}
