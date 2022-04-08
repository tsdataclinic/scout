import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './collections.entity';
import { Dataset } from '../dataset/dataset.entity';
import { User } from '../users/users.entity';
import { userInfo } from 'os';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>,
  ) {}

  findById(id: string): Promise<Collection> {
    return this.collectionRepo.findOne({ id });
  }

  createCollection(
    name: string,
    datasets: Dataset[],
    description: string,
    user: User,
  ): Promise<Collection> {
    let collection = this.collectionRepo.create({ name, description });
    collection.datasets = Promise.resolve(datasets);
    console.log('Creating collection with user ', user);
    collection.user = Promise.resolve(user);
    collection.createdAt = new Date();
    return this.collectionRepo.save(collection);
  }

  getAll(): Promise<Collection[]> {
    return this.collectionRepo.find();
  }

  getUserCollection(user: User): Promise<Collection[]> {
    const collections = user.collections;
    return collections;
  }

  async deleteCollection(collection: Collection) {
    return this.collectionRepo.remove(collection);
  }

  async addToCollection(id: string, datasetsToAdd: Dataset[]) {
    const collection = await this.collectionRepo.findOne(id, {
      relations: ['datasets'],
    });
    if (collection) {
      const datasets = await collection.datasets;
      collection.datasets = Promise.resolve([...datasets, ...datasetsToAdd]);
      return this.collectionRepo.save(collection);
    }
    throw new NotFoundException(id, 'Could not find collection');
  }

  async removeDatasetFromCollection(
    collectionId: string,
    datasetToRemove: Dataset,
  ) {
    const collection = await this.collectionRepo.findOne(collectionId, {
      relations: ['datasets'],
    });
    if (collection) {
      const datasetId = datasetToRemove.id;
      const datasets = await collection.datasets;

      collection.datasets = Promise.resolve(
        datasets.filter(d => d.id !== datasetId),
      );

      return this.collectionRepo.save(collection);
    }
    throw new NotFoundException(collectionId, 'Could not find collection');
  }
}
