const nodemailer = require("nodemailer");

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    tls:{
      rejectUnauthorized: false
    },
    auth: {
      user: "sendmail3489@gmail.com", 
      pass: "jwblhxfwhoxktwtq", 
    },
  });

  const sendEmail = async(email, token) =>{

    try {
      await transporter.sendMail({
        from: 'sendmail3489@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Confirm your account", // Subject line
        text: "Welcome to our website", // plain text body
        html: "<b>Welcome to our website click this</b><a href='http://localhost:4200/hello/"+ token +"'> link </a><b>to verify your account</b>", // html body 
      });
      } catch (error) {
      console.log(error)
    }
  }

  module.exports = {
    sendEmail
  }