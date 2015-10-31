// JavaScript source code
var mailer = require("nodemailer");

var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    pwd: 'root',
    database: 'chdatausage'
});
con.connect();

var queryString = 'select c.usage_limit, cum.totalusage  from  customers c join cust_usage_master cum on c.cust_id = cum.cust_id where month(cum.billcycledate) = month(current_timestamp)';

con.query(queryString, function (err, rows, fields) {
    if (err) throw err;

    for (var i in rows) {
        if (rows[i].usage_limit / rows[i].totalusage * 100 > 75) {

            SendMail();
        }
    }
    SendMail();
});

con.end();


function SendMail() {
    // Use Smtp Protocol to send Email
    var smtpTransport = mailer.createTransport("SMTP", {
        host: 'localhost',
        port: 25,
        auth: {
            user: 'username',
            pass: 'password'
        }
    });

    var mail = {
        from: "Verizon Info <info@Verizon.com>",
        to: "peru.ash@gmail.com",
        subject: "Usage Limit Info",
        text: "Your usage limit has crossed 75%",
        html: "<b>Node.js New world for me</b>"
    }

    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });
}


function TestMail() {

    var nodemailer = require('nodemailer');
   // var transporter = nodemailer.createTransport();
    var transporter = nodemailer.createTransport(smtpTransport({
        host: 'localhost',
        port: 25,
        auth: {
            user: 'username',
            pass: 'password'
        }
    }));

    transporter.sendMail({
        from: 'Verizon Info <info@Verizon.com>',
        to: 'peru.ash@gmail.com',
        subject: 'hello',
        text: 'hello world!'
    });

}