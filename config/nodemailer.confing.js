const nodemailer = require('nodemailer')

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.NODEMAILER_EMAIL_USER,
//         pass: process.env.NODEMAILER_EMAIL_PASS
//     }
// })


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_EMAIL_USER,
        pass: process.env.NODEMAILER_EMAIL_PASS
    }
})

exports.sendEmail = async (formet) => {
    try {
        const res = await transporter.sendMail(formet)
        return res
    } catch (error) {
        console.log(error)
    }
}



