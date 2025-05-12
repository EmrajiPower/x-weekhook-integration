import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwitterModule } from './x/x.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [ScheduleModule.forRoot(),TwitterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
