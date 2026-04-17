import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as express from 'express';


async function bootstrap() {
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.use("/uploads",express.static('./src/uploads'));
  app.useGlobalInterceptors(new ResponseInterceptor());
  // app.use(Logger);
  await app.listen(port,()=>{
    console.log(`server running onhttp://localhost:${port}`);
  } );
}
bootstrap();
