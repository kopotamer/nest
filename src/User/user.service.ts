import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {

 GetProfile():String{
     return 'hello from user service';
 }

}