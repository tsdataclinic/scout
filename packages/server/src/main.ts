import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PortalSyncService } from './portal-sync/portal-sync.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get(PortalSyncService).subscribeToShutdown(() => app.close());
  await app.listen(5000);
}
bootstrap();
