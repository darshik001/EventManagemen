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
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000
})

exports.sendEmail = async (formet) => {
    try {
        return await transporter.sendMail(formet)
    } catch (error) {
        console.error('Email Error:', error.code, error.message)
        throw error
    }
}



