import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, ValidationPipe, UseInterceptors, BadRequestException } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image',{
    storage: diskStorage({
      destination: './src/uploads/brands',

      filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const ext = extname (file.originalname)
            const filename = `${file.originalname}-${uniqueSuffix} ${ext}`
            cb(null, filename)
          }
    }),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) 
          return cb(new BadRequestException("only images are allowed"), false);
          cb(null,true);
        
      }
  }))
  create(
    @Body('name',new ValidationPipe()) name: string,
    @Body('createdBy',new ValidationPipe()) createdBy: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,

  ) {
    const createBrandDto : CreateBrandDto = {
      name,
      createdBy,
      image: file.fieldname ,
    };
    return this.brandService.create(createBrandDto);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image',{
    storage: diskStorage({
      destination: './src/uploads/brands',

      filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const ext = extname (file.originalname)
            const filename = `${file.originalname}-${uniqueSuffix} ${ext}`
            cb(null, filename)
          }
    }),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) 
          return cb(new BadRequestException("only images are allowed"), false);
          cb(null,true);
        
      }
  }))
  update(
    @Param('id') id: string, 
    @Body() updateBrandDto: UpdateBrandDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
      if (file) updateBrandDto.image = `./src/uploads/brands/${file.filename}`;
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
