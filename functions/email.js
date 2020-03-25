const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: `${process.env.EMAIL_HOST}`,
  port: `${process.env.EMAIL_PORT}`,
  secure: false,
  auth: {
    user: `${process.env.EMAIL_USER}`,
    pass: `${process.env.EMAIL_PASS}`
  },
  tls: {
    rejectUnauthorized: false
  }
});

class Email {
  /**
   * Send an email
   * @param {Object} data - Email Document Data
   * @returns {Object} Information
   */
  static sendEmail(data) {
    const config = {
      from: process.env.EMAIL_USER,
      to: data.clientEmail,
      subject: data.subject,
      text: data.content,
      attachments: data.attachments
    };

    console.log(`Config ${config}`);
    console.log(config.to);
    return new Promise((resolve) => {
      transporter.sendMail(config, (error, info) => {
        if (error) {
          console.log(error);
          resolve(error);
        }
        else {
          console.log(`Email enviado ${info.response}`);
          resolve(info);
        }
      });
    });
  }

  static errorEmail(data) {
    const config = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Erro no sistema',
      text: `Ocorreu um erro no sistema:

      Código: ${data.code}
      Mensagem: ${data.message}

      Informe o responsável para que o problema seja corrigido.`
    };
    return new Promise((resolve) => {
      transporter.sendMail(config, (error, info) => {
        if (error) {
          resolve(error);
        }
        else {
          console.log(`Email enviado ${info.response}`);
          resolve(info);
        }
      });
    });
  }
}

module.exports = Email;
