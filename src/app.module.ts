import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { UserModule } from './User/user.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthController } from './auth/auth.controller';
import { PreAUTHMiddleware } from './common/middleware/preAUTH.middleware';
import { BrandModule } from './brand/brand.module';





@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ 
    envFilePath:resolve("./config/.env.dev"),
    isGlobal:true

   }),
 MongooseModule.forRoot(process.env.DB_URI as string, {
  serverSelectionTimeoutMS: 5000,
  onConnectionCreate(connected){
    connected.on("connected", ()=> 
      console.log("MongoDB connected successfully"),
  );
}
}),
 BrandModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule   {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //   .apply(LoggerMiddleware,PreAUTHMiddleware)
  //   .forRoutes(AuthController);
  // }  

}
 