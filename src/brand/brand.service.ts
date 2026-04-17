import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from 'node_modules/@nestjs/mongoose/dist';
import { Brand } from 'src/DB/models/brand.model';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {

  constructor(@InjectModel(Brand.name)private brandModel:Model<Brand>) {}
 async create(createBrandDto: CreateBrandDto) {
   const brand = await this.brandModel.findOne({ name: createBrandDto.name });
    if (brand) return new ConflictException("Brand already exists");  
   const newBrand = await this.brandModel.create(createBrandDto);
   return newBrand;
  }

  findAll() {
    return `This action returns all brand`;
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

 async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandModel.findById(id);
    if (!brand) return new NotFoundException("Brand not found");

    if(updateBrandDto.name)brand.name = updateBrandDto.name;
    if(updateBrandDto.image)brand.image = updateBrandDto.image;
    await brand.save();
    return brand;
 }
  

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
