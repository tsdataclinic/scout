import { Injectable } from '@nestjs/common';
import { Portal } from './portal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PortalService {
  constructor(
    @InjectRepository(Portal)
    private readonly portalRepo: Repository<Portal>,
  ) {}

  findById(id: string): Promise<Portal> {
    return this.portalRepo.findOne({ id });
  }

  findAll(): Promise<Portal[]> {
    return this.portalRepo.find();
  }

  createOrUpdatePortal(portal: Portal) {
    return this.portalRepo.save(portal);
  }
}
