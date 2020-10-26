import { Injectable } from '@nestjs/common';
import { Tag } from './tags.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepo: Repository<Tag>,
  ) {}

  findById(id: number): Promise<Tag> {
    return this.tagsRepo.findOne(id);
  }

  findAll(): Promise<Tag[]> {
    return this.tagsRepo.find();
  }

  createOrUpdateTag(tag: Tag) {
    return this.tagsRepo.save(tag);
  }
}
