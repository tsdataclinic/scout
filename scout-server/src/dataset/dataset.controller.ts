import { Controller, Get, Param } from '@nestjs/common';
import { DatasetService } from './dataset.service';

@Controller('dataset')
export class DatasetController {
  constructor(private readonly datasetService: DatasetService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.datasetService.findById(id);
  }

  @Get()
  findALL() {
    return this.datasetService.findAll();
  }
}
