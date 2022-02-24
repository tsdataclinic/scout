import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatasetModule } from './dataset/dataset.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { DatasetColumnsModule } from './dataset-columns/dataset-columns.module';
import { PortalsModule } from './portals/portals.module';
import { SearchModule } from './search/search.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { PortalSyncModule } from './portal-sync/portal-sync.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { CollectionsModule } from './collections/collections.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: true,
      playground: {
        endpoint: 'graphql',
      },
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(),
    DatasetModule,
    TagsModule,
    DatasetColumnsModule,
    PortalsModule,
    PortalSyncModule,
    SearchModule,
    AuthModule,
    UsersModule,
    PassportModule,
    CollectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}