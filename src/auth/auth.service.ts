// import { ConflictException, Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
// import { SignUpDTO } from './dto/signup.dto';
// import { InjectModel } from '@nestjs/mongoose';
// import { User, UserDocument } from 'src/DB/models/user.model';
// import { Model } from 'mongoose';
// import { emailEvent } from 'src/common/events/email.event';
// import { Otp, OtpDocument } from 'src/DB/models/otp.model';
// import { OtpTypeEnum } from 'src/common/enums/user.enum';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
//     @InjectModel(Otp.name) private readonly OtpModel: Model<OtpDocument>,
//   ) {}

//   async signup(signUpDTO: SignUpDTO): Promise<{ message: string; user: User }> {
//     try {
//       const { firstname, lastname, username, password, email } = signUpDTO;

//       // Check if the user already exists
//       const existingUser = await this.UserModel.findOne({ email });
//       if (existingUser) throw new ConflictException('User already exists');

//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const user = new this.UserModel({
//         firstName: firstname, 
//         lastName: lastname,   
//         username,
//         email,
//         password: hashedPassword,
//       });

//       await user.save();

    
//       const [otp] =await this.OtpModel.create([
//         {
//         CreatedBy: user._id,
//         code: '498765',
//         expiredAt: new Date(Date.now() + 2 * 60 * 1000), // OTP expires in 2 minutes
//         type: OtpTypeEnum.confirmEmail,
//       },
//     ]); 

//       await emailEvent.emit('confirmEmail', {
//          to: email, 
//          otp:otp.code,
//           username: 
//         });
      

//       return { message: 'User registered successfully', user };
//       }
//     }
    
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfirmEmailDTO, LoginDTO, ResendDTO, SignUpDTO } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/DB/models/user.model';
import { Otp, OtpDocument } from 'src/DB/models/otp.model';
import { OtpTypeEnum, ProvidersEnum } from 'src/common/enums/user.enum';
import { Model, Types } from 'mongoose';
import { compare, hash } from 'src/common/utils/security/hash.utils';
import { generateOtp } from 'src/common/utils/otp.utils';
import { NotFoundError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    @InjectModel(Otp.name) private readonly OtpModel: Model<OtpDocument>,
    private jwtService: JwtService
  ) {}

  private async createOtp(userId: Types.ObjectId) {
    
    await this.OtpModel.create({
      createdBy: userId,
      code: generateOtp(),
      expiredAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
      type: OtpTypeEnum.confirmEmail,
    });
  }
  async signup(signUpDTO: SignUpDTO): Promise<{ message: string; user: UserDocument }> {
    const { username, password, email, firstName, lastName } = signUpDTO;

    
    const checkUser = await this.UserModel.findOne({ email });
    if (checkUser) throw new ConflictException('User already exists');
    

    const hashedPassword = await hash({ plaintext: password });

    
    const user = new this.UserModel({
      firstName: firstName,
      lastName: lastName,
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    
    

    
    

    await this.createOtp(user._id);
    
    return {
      message: 'User registered successfully',user,};

  }
  async resendOtp(resendOtp: ResendDTO){
    const {email}=resendOtp;
    const user=await this.UserModel
    .findOne({
      email,
      confirmEmail:{$exists:false}
    })
    .populate([{path:'otp',match:{type:OtpTypeEnum.confirmEmail}}]);
    
    if (!user) throw new NotFoundException('User not found');
    
    //otp 
    if (user.otp?.length) throw new ConflictException('Otp already sent');
    
    await this.createOtp(user._id);   
      
    
    return {message: 'otp send successfully'};
  }
  async confirmEmail(confirmEmail:ConfirmEmailDTO){
    const {email,otp}=confirmEmail;
    const user=await this.UserModel
    .findOne({
      email,
      confirmEmail:{$exists:false}
    })
    .populate([{path:'otp',match:{type:OtpTypeEnum.confirmEmail}}]);
    
    if (!user) throw new NotFoundException('User not found');
    
    //otp 
    if (!user.otp?.length) throw new ConflictException('Otp not found');

    //otp 
    if (!(await compare({ plaintext:otp , hash:user.otp[0].code })))
       throw new BadRequestException('invalid otp');
    await this.UserModel.updateOne({
      _id:user._id
    },{
      $set:{confirmEmail:new Date()},$inc:{__v:1}
    }
  )
      
    
    return {message: 'user confirmed successfully'};
  }
  async login(loginDTO:LoginDTO){
    const {email,password}=loginDTO;
    
    const user = await this.UserModel.findOne({
      email,
      confirmEmail:{$exists:true},
      provider:ProvidersEnum.SYSTEM,
    });
    if (!user)throw new NotFoundException ('User not found');

    if (!(await compare({plaintext:password, hash:user.password})))

    throw new BadRequestException('invalid Email or password');
    const jwtid=randomUUID();
    const accessToken=await this.jwtService.sign({
      id:user._id,
      email:user.email,
      
    },{
      secret:process.env.ACCESS_SECRET_KEY,
      expiresIn:Number(process.env.ACCESS_EXPIRES_IN as string),
      jwtid,
    });
    const refreshToken=await this.jwtService.sign({
      id:user._id,
      email:user.email,
      
    },{
      secret:process.env.REFRESH_SERCET_KEY,
      expiresIn:Number(process.env.REFRESH_EXPIRES_IN as string),
      jwtid,
    });

    return {message: 'user confirmed successfully',Credential:{accessToken,refreshToken}};
  }

  async getProfile(req:any){

    return {
      message: 'user Fetched successfully'
      ,data:req.user};
  }
}