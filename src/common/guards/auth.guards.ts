import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/DB/models/user.model";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService:JwtService , @InjectModel(User.name)private readonly UserModel: Model<UserDocument>
){}
async  canActivate(
    context: ExecutionContext,
  ):Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader&&!authHeader.startsWith('Bearer'))
        throw new UnauthorizedException('missing authorization header parts');
    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid Token Format')
        
    

    const payload = this.jwtService.verify(token,{secret:process.env.ACCESS_SECRET_KEY})

    const user = await this.UserModel.findById(payload.id); 
    if (!user)throw new NotFoundException("user not found")
        
    request.user = user;
        return true; 
        
    
    
  }
}
