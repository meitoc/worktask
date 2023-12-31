const nodemailer = require('nodemailer');
const {FRONTEND_URL,BACKEND_MAIL_SERVER_HOST,BACKEND_MAIL_SERVER_USER,BACKEND_MAIL_SERVER_PASSWORD, BACKEND_MAIL_SERVER_PORT} = process.env;

const sendEmail = async function (title,content, emailTarget)
{
    const emailContent = `<!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>${title}</title>
    </head>
    <body>
    ${content}
        <p>Best regards,<br>Meitoc OTP Center<br>Phone: +84 848484774<br>Email: info@meitoc.com
    </p>
    </body>
    </html>`;

    const transporter = await nodemailer.createTransport({
        host: BACKEND_MAIL_SERVER_HOST,
        port: BACKEND_MAIL_SERVER_PORT,
        secure: true,
        auth: {
            user: BACKEND_MAIL_SERVER_USER,
            pass: BACKEND_MAIL_SERVER_PASSWORD
        }
    });
    
    const mailOptions = {
    from: BACKEND_MAIL_SERVER_USER,
    to: emailTarget,
    subject: title,
    html: emailContent
    };
    
    const sendEmail = (mailOptions) => {
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
                resolve(false);
            } else {
                console.log('Email sent:', info.response);
                resolve(true);
            }
            });
        });
    };

    // Send email
    try {
        const success = await sendEmail(mailOptions);
        console.log('Email sent:', success);
        return success;
        } catch (error) {
        console.log('Failed to send email:', error);
        return false;
        }
}
const activeNewEmailContent= (otp)=>{
    const content = `<div>
    <p>Welcome you to task.meitoc.net</p>
    <p>You are changing email address to this email.</p>
    </div>
    <div>
    <a href="${FRONTEND_URL}/url/url-change-email/${otp}">CLICK HERE TO VERIFY YOUR NEW EMAIL.</a>
    </div>`
    return content
}
const activeAccountContent= (otp)=>{
    const content = `<div>
    <p>Welcome you to task.meitoc.net</p>
    </div>
    <div>
    <a href="${FRONTEND_URL}/url/url-login/${otp}">CLICK HERE TO VERIFY YOUR EMAIL.</a>
    </div>`
    return content
}
const loginContent= (otp)=>{
    const content = `<div>
    <p>Welcome you to task.meitoc.net</p>
    </div>
    <div>
    <a href="${FRONTEND_URL}/url/url-login/${otp}">CLICK HERE TO ACCESS YOUR ACCOUNT.</a>
    </div>`
    return content
}
const sendVerifyNewEmail = (title,otp,emailTarget)=> sendEmail(title,activeNewEmailContent(otp),emailTarget)
const sendVerifyEmail = (title,otp,emailTarget)=> sendEmail(title,activeAccountContent(otp),emailTarget)
const sendLoginEmail = (title,otp,emailTarget)=> sendEmail(title,loginContent(otp),emailTarget)
const email={sendEmail,sendLoginEmail,sendVerifyEmail,sendVerifyNewEmail}
module.exports = email;