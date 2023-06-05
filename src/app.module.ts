import { Module } from '@nestjs/common';
import { DatabaseModule } from './prisma/database.module';

@Module({
  imports: [DatabaseModule]
})
export class AppModule {}
