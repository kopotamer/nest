import { Controller, Get,Param,Query,Req, Res, Search } from '@nestjs/common';
import { AppService } from './app.service';
import { appendFile } from 'fs';
import type { Request , Response} from 'express';




@Controller('cats')
export class AppController {
  constructor(private readonly appService: AppService){}

  @Get('/signup')
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('/findAll')
findAll(@Req()req: Request, @Res({passthrough: true})res: Response) {

    return '<h1>this action returns all cats</h1>'
}

}
