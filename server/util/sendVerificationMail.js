const nodemailer = require('nodemailer');

const sendVerificationMail = (user) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "nishantraut90@gmail.com",
            pass: process.env.EMAIL_PASS,
        },
    })

    const mailOptions = {
        from: '"Admin" <nishantraut90@gmail.com>',
        to: user.email,
        subject: "Verification of email",
        html: `<p>Hello ${user.name}, verify your email by clicking this link...</p>
        <a href='${process.env.CLIENT_URL}/verify-email?emailToken=${user.emailToken}'>Verify your email</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Verification email sent");
        }
    });
};

module.exports = { sendVerificationMail };