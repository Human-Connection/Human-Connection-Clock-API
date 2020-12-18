'use strict';

let nodeMailer  = require('nodemailer'),
    ejs         = require("ejs"),
    transporter = undefined;


function initTransporter(){
    if(transporter === undefined){
        transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST || 'localhost',
            port: process.env.MAIL_PORT || 25,
            secure: false,
            auth: {
                user: process.env.MAIL_USER || '',
                pass: process.env.MAIL_PASS || ''
            }
        });
    }
}

exports.sendVerifySuccess = function(recipient){
    initTransporter();

    ejs.renderFile(__dirname + "/../mails/entry/verifySuccess.ejs", { firstname : recipient.firstname }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            let mailOptions = {
                from: '"Human Connection - Uhr des Wandels" <uhrdeswandels@human-connection.org>', // sender address
                to: recipient.email, // list of receivers
                subject: "Deine E-Mail Adresse wurde bestätigt!", // Subject line
                html: data // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        }
    });
};

exports.sendVerificationMail = function(key, recipient, callback = null){
    initTransporter();

    ejs.renderFile(__dirname + "/../mails/entry/verify.ejs", { key: key, firstname : recipient.firstname }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            let mailOptions = {
                from: '"Human Connection Clock" <uhrdeswandels@human-connection.org>', // sender address
                to: recipient.email, // list of receivers
                subject: "Human Connection Uhr Eintrag erfolgeich", // Subject line
                html: data // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        }
    });
};
