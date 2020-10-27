import { TagsService } from './tags.service';
import { Tag } from './tags.entity';
import { Resolver, Query, Parent, Args, ResolveField } from '@nestjs/graphql';

@Resolver(of => Tag)
export class TagsResolver {
  constructor(private tagService: TagsService) {}

  @Query(returns => Tag)
  async tag(@Args('id') id: number) {
    return this.tagService.findById(id);
  }

  @Query(returns => [Tag])
  async tags() {
    return this.tagService.findAll();
  }

  @ResolveField()
  async datasets(@Parent() tag: Tag) {
    return await tag.datasets;
  }
  @ResolveField()
  async portal(@Parent() tag: Tag) {
    return await tag.portal;
  }
}
