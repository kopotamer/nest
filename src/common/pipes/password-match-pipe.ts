
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class passwordMatchPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(metadata.type === "body"){
    const{password,confirmPassword}= value;{
        if(password !== confirmPassword)
        {
            throw new BadRequestException("Password doesn't match");
        }
        
    }
}
    return value;
  }
}
