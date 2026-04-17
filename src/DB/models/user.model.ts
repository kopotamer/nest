import { MongooseModule, Prop, Schema, SchemaFactory,Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { GenderEnum, ProvidersEnum } from "src/common/enums/user.enum";
import { OtpDocument } from "./otp.model";



@Schema({
     timestamps:true ,
     toJSON:{virtuals:true} , 
     toObject:{virtuals:true}
    })
 export class User{
    @Prop({
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
        trim: true,
    })
    firstName!: string;
     @Prop({
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
        trim: true,
    })
    lastName!: string;

    @Virtual({
        get: function () {
            return this.firstname + ' ' + this.lastname;
        },
        set: function (value) {
            const [firstname, lastname] = value.split(" ") || [];
            this.set({ firstname, lastname });
        }
    })
    username!: string;
 
     @Prop({
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    })
    email!: string;
     @Prop({
        type: Date,
    })
    confirmEmail!: Date;
    

       @Prop({
        type: String,
        required: function () {
            return this.provider === ProvidersEnum.GOOGLE ? false : true;
        },
    })
    password!: string;

       @Prop({
        type: String,
        enum: {
            values: Object.values(ProvidersEnum),
            message: '{value} is not a valid provider'
        },
        default: ProvidersEnum.SYSTEM,
    })
    provider!: string;

      @Prop({
        type: String,
        enum: {
            values: Object.values(GenderEnum),
            message: '{value} is not a valid gender'
        },
        default: GenderEnum.MALE,
    })
    gender!: string;
     @Prop({
        type: String,
    })
    phone!: string;
     
     @Virtual()
    otp!: OtpDocument[];
 }
 export const UserSchema = SchemaFactory.createForClass(User);
//   UserSchema.pre('save',async function(next){
//     if (this.isModified('password')) {
//         this.password = await hash({plaintext : this.password})
//     }
//  });

 UserSchema.virtual('otp',{
    localField:'_id',
    foreignField:'createdBy',
    ref:'Otp',
 })

 export type UserDocument = HydratedDocument<User>;
 export const UserModel =MongooseModule.forFeature([
    {name:User.name,schema:UserSchema}

    ]);