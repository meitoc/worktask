const nodemailer = require('nodemailer');
const {BACKEND_MAIL_SERVER_HOST,BACKEND_MAIL_SERVER_USER,BACKEND_MAIL_SERVER_PASSWORD, BACKEND_MAIL_SERVER_PORT} = process.env;

const email={}
email.sendEmail = async function (title,content, emailTarget)
{
    const emailContent = `<!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>${title}</title>
    </head>
    <body>
    ${content}
        <p>Best regards,<br>Meitoc OTP Center<br>
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
module.exports = email;