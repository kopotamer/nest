import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, Types } from "mongoose";
import { OtpTypeEnum } from "src/common/enums/user.enum";
import { emailEvent } from "src/common/utils/events/email.event";
import { hash } from "src/common/utils/security/hash.utils";
 


@Schema({
     timestamps:true ,
    })
 export class Otp{
    
     @Prop({
      type: String,
      required: true
   })
   code!: string;

     @Prop({
      type: Date,
      required: true
   })
   expiredAt!: Date;
    @Prop({
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
   })
   createdBy!: Types.ObjectId;

      @Prop({
      type: String,
      required: true,
      enum: OtpTypeEnum
   })
   type!: string;
 }
 export const OtpSchema = SchemaFactory.createForClass(Otp);
 OtpSchema.index({ expiredAt: 1 }, {expireAfterSeconds: 0 });//ttl
 OtpSchema.pre(
   'save',
   async function(
   this:OtpDocument&{wasNew:boolean;plainOtp:string},
   next,
 ){
   this.wasNew = this.isNew
    if (this.isModified('code')) {
      this.plainOtp=this.code
      this.code=await hash ({plaintext : this.code})
      await this.populate('createdBy')
    }
 }
);
OtpSchema.post(
   'save',
   async function(doc,next,){
   const that=this as OtpDocument&{wasNew:boolean;plainOtp:string}
   if (that.wasNew&&that.plainOtp) {
      await emailEvent.emit(OtpTypeEnum.confirmEmail, {
        to: (that.createdBy as any).email,
        otp:that.plainOtp,
        username:(that.createdBy as any).username,
      });
   }
 }
);
 export type OtpDocument = HydratedDocument<Otp>;
 export const OtpModel =MongooseModule.forFeature([
    {name:Otp.name,schema:OtpSchema}
    ]);
