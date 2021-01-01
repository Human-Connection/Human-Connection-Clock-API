'use strict';

let nodeMailer  = require('nodemailer'),
    ejs         = require("ejs"),
    transporter = undefined,
    fs          = require('fs'),
    path = require("path");


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

    const replacementVariables = {
        '{{{firstname}}}': recipient.firstname,
        '{{{key}}}': key
    };

    fs.readFile(
        path.resolve(__dirname + '/../mails/entry/registerSuccess.txt'),
        'utf8',
        function(error, data) {
            if (error) {
                throw error;
            }

            for (const [key, value] of Object.entries(replacementVariables)) {
                data = data.replace(new RegExp(key, 'g'), value)
            }

            const mailOptions = {
                from: '"Human Connection Clock" <uhrdeswandels@human-connection.org>', // sender address
                to: recipient.email, // list of receivers
                subject: "Human Connection Clock entry successful", // Subject line
                text: data,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        })
};
