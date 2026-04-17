import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, Types } from "mongoose";
import slugify from "slugify";



@Schema({
     timestamps:true ,
    })
 export class Brand{
    
     @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 25,
    unique: true,
  })
  name!: string;

     @Prop({
    type: String,
    minLength: 3,
    maxLength: 50,
  })
  slug!: string;

      @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: Types.ObjectId;

     @Prop({
    type: String,
    required: true,
  })
  image!: string;
 
 }
 export const brandSchema = SchemaFactory.createForClass(Brand);
 brandSchema.pre('save',async function (next) {
   if (this.isModified('name')) {
      this.slug = slugify(this.name,{lower:true});
   }
 })
 export type BrandDocument = HydratedDocument<Brand>;
 export const BrandModel =MongooseModule.forFeature([
    {name:Brand.name,schema:brandSchema}
    ]);
