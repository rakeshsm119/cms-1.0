const nodeMailer = require('nodemailer')

const sendMail = async (to,cc,bcc, subject, content) => {
    try{
        const transporter = await nodeMailer.createTransport({
            service: process.env.MAIL_SERVICE,
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth:{
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASSWORD
            }
        });

        let info = await transporter.sendMail({
            from: process.env.MAIL_ID,
            to,
            cc,
            bcc,
            subject,
            html: `<div> ${content} </div>`
        })

        return info;
    }catch(err){
        return err.message
    }
}

module.exports = sendMail