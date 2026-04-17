import { EventEmitter } from "node:events"; 
import Mail from "nodemailer/lib/mailer";
import {sendEmail } from "../Email/send.email";
import{ template } from "../Email/verify_Email_Template";
import { OtpTypeEnum } from "../../enums/user.enum";

export const emailEvent = new EventEmitter();
interface IEmail extends Mail.Options{
    otp: string;
username: string;
} 
emailEvent.on(OtpTypeEnum.confirmEmail, async (data: IEmail) => { 
    try {
data. subject = OtpTypeEnum.confirmEmail;
data.html = template(data.otp, data.username, data.subject);
await sendEmail(data);
    }
catch (error) {
console.error(` Fail to send Email`, error);

}
});