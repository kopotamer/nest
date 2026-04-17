
import { BadRequestException, Body, Controller,Get,Patch,Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import  { type ResendDTO,resendOtpSchema,signupSchema,type SignUpDTO, confirmEmailSchema,type ConfirmEmailDTO, loginSchema,type LoginDTO} from './dto/signup.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-pipe';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}
@UsePipes(new ZodValidationPipe(signupSchema))
@Post('/signup')  
signup(@Body() signUpDTO:SignUpDTO){
  return this.authService.signup(signUpDTO);
}


@UsePipes(new ZodValidationPipe(resendOtpSchema))
@Post('/resend-otp')  
resendOtp(@Body() resendOtp:ResendDTO){
  return this.authService.resendOtp(resendOtp);
} 


@UsePipes(new ZodValidationPipe(confirmEmailSchema))
@Patch('/confirm-email')  
confirmEmail(@Body() confirmEmail:ConfirmEmailDTO){
  return this.authService.confirmEmail(confirmEmail);
}


@UsePipes(new ZodValidationPipe(loginSchema))
@Post('/login')  
login(@Body() loginDTO:LoginDTO){
  return this.authService.login(loginDTO);
} 

@UseGuards(AuthGuard)
@Get('/profile')  
Profiles(@Req() req:any){
  return this.authService.getProfile(req);
}

// @Post('/upload-file')  
// @UseInterceptors(FileInterceptor('image',{
//   storage: diskStorage({
//     destination: "./src/uploads",
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       const ext = extname (file.originalname)
//       const filename = `${file.originalname}-${uniqueSuffix} ${ext}`
//       cb(null, filename)
//     }
//   }),
//   limits:{
//     fileSize:5*1024*1024,//5mb
//   },
//   fileFilter: (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) 
//       return cb(new BadRequestException("only images are allowed"), false);
//       cb(null,true);
    
//   }
// })
// )
// upload(@UploadedFile() file:Express.Multer.File){
//   console.log(file);

// }

@Post('/upload-file')  
@UseInterceptors(
  FilesInterceptor('Files',5,{
  storage: diskStorage({
    destination: "./src/uploads",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = extname (file.originalname)
      const filename = `${file.originalname}-${uniqueSuffix} ${ext}`
      cb(null, filename)
    }
  }),
  limits:{
    fileSize:5*1024*1024,//5mb
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) 
      return cb(new BadRequestException("only images are allowed"), false);
      cb(null,true);
    
  }
})
)
uploadFile(@UploadedFiles() files:Array<Express.Multer.File>){
  console.log(files);

}
  }


