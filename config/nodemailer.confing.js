// const  nodemailer = require('nodemailer')

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.NODEMAILER_EMAIL_USER,
//         pass: process.env.NODEMAILER_EMAIL_PASS
//     }
// })


// exports.sendEmail = async (formet) => {
//     try {
//         const res = await transporter.sendMail(formet)
//         console.log(res)
//         return res
//     } catch (error) {
//         console.log(error)
//     }
// }



const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_EMAIL_USER,
    pass: process.env.NODEMAILER_EMAIL_PASS,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000,
});

exports.sendEmail = async (format) => {
  try {
    const result = await transporter.sendMail(format);

    console.log("Email sent successfully:", result.messageId);

    return result;
  } catch (error) {
    console.error("Email sending failed:", {
      code: error.code,
      command: error.command,
      message: error.message,
    });

    throw error;
  }
};