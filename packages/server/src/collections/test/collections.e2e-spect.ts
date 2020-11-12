import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CollectionsModule } from '../collections.module';
import { DatasetModule } from '../../dataset/dataset.module';
import { UsersModule } from '../../users/users.module';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';

describe('CollectionsController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CollectionsModule,
        DatasetModule,
        UsersModule,
        GraphQLModule.forRoot({
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
        }),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  const createUserQuery = (
    username: string,
    password: string,
    email: string,
  ) => `
    mutation {
        signUp(email:"${email}", username:"${username}", password:"${password}"){
            success
            error
        }
    }
  `;

  const createCollection = (
    userId: string,
    collectionId: string,
    datasetIds: string[],
  ) => `
    
  `;
});
