import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from 'src/auth/gql-auth-guard';
import { UsersService } from 'src/users/users.service';
import { Collection } from './collections.entity';
import { CollectionsService } from './collections.service';
import { DatasetService } from '../dataset/dataset.service';
import { User } from '../users/users.entity';

@Resolver(of => Collection)
export class CollectionsResolver {
  constructor(
    private collectionService: CollectionsService,
    private userService: UsersService,
    private datasetService: DatasetService,
  ) {}

  @Query(returns => Collection)
  async collection(@Args('id') id: string): Promise<Collection> {
    return this.collectionService.findById(id);
  }

  @Query(returns => [Collection])
  async collections(): Promise<Collection[]> {
    return this.collectionService.getAll();
  }

  @Mutation(returns => Collection)
  @UseGuards(GqlAuthGuard)
  async createCollection(
    @CurrentUser() currentUser: User,
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('datasetIds', { type: () => [String] }) datasetIds: string[],
  ): Promise<Collection> {
    const user = await this.userService.findById(currentUser.id);
    const datasets = await this.datasetService.findByIds(datasetIds);
    return this.collectionService.createCollection(
      name,
      datasets,
      description,
      user,
    );
  }

  @Mutation(returns => Collection)
  @UseGuards(GqlAuthGuard)
  async deleteCollection(
    @CurrentUser() currentUser: User,
    @Args('id') id: string,
  ) {
    const collection = await this.collectionService.findById(id);
    if (collection) {
      const collectionOwner = await collection.user;
      if (collectionOwner.id === currentUser.id) {
        return this.collectionService.deleteCollection(id);
      } else {
        throw new UnauthorizedException(
          'You are not authroized to delete this collection',
        );
      }
    }
    throw new NotFoundException(id, 'Could not find that collection');
  }

  @Mutation(returns => Collection)
  @UseGuards(GqlAuthGuard)
  async addToCollection(
    @CurrentUser() currentUser: User,
    @Args('id') id: string,
    @Args('datasetIds', { type: () => [String] }) datasetIds: string[],
  ) {
    const collection = await this.collectionService.findById(id);
    if (collection) {
      const user = await this.userService.findById(currentUser.id);
      const datasets = await this.datasetService.findByIds(datasetIds);
      const collectionOwner = await collection.user;
      if (currentUser.id === collectionOwner.id) {
        return this.collectionService.addToCollection(id, datasets);
      } else {
        throw new UnauthorizedException(
          'You are not authorized to alter this collection',
        );
      }
    } else {
      throw new NotFoundException(id, 'Could not find collection');
    }
  }
}
