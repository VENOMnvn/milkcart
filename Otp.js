 const nodemailer = require('nodemailer')
 //sending by email using node mailer
 async function  sendByEmail(email,otp) {
    var transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'milkcartindia@gmail.com',
            pass: 'cqibaweuomwsuvqu'
        }
    });
    var mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: `Dairy Kart OTP for Register`,
        text: `Your OTP : ${otp} for registering in Dairy Kart.\nWe wish you a Enjoyfull Experince ahead `
    };
    try {
        const info = await transporter.sendMail(mailOptions,(error,info)=>{
          return {error,info}
        });

        return info;

    } catch (error) {
         return {error}
    }
}

module.exports = sendByEmail;


// function generateOtp() {

//     
// }

// module.exports = generateOtp;