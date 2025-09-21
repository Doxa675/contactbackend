const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { error } = require('console');
require('dotenv').config();

const app = express()
const PORT = 2453 || process.env.PORT

app.use(cors())
app.use(bodyParser.json())

//Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/api/contact', (req, res) => {
    const { name, email, phone, subject, message } = req.body

    if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({ error: "All fields are required." })
    }

    // Admin Email Template 
    const adminHtml = `
    <div style= 'font-family: Arial, sans-serif; padding: 20px; color: #333;'>
    <h2>New contact submission</h2>
    <p><strong>Name:</strong>< ${name}</p>
    <p><strong>Email:</strong>< ${email}</p>
    <p><strong>Phone:</strong>< ${phone}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
    </div>
    `;

    //User Acknowledgement Email Template
    const userHtml = `
    <div style= 'font-family: Arial, sans-serif; padding: 20px; color: #333;'>
    <h2>New contact submission</h2>
    <p>Dear ${name}</p>
    <p>Thank you for contacting us</p>
    </div>
`;

    //Email to you
    const adminMailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `${subject}`,
        html: adminHtml,
    };

    //Acknowledge Email to user
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Thank you for contacting us!",
        html: adminHtml,
    }

    //send Emails
    transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email to admin:', error);
            return res.status(500).json({ error: 'Failed to send email to admin.' });
        }

        console.log('Admin email sent:', info.response);

        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Error sending acknowledgement email to user:', error);
                return res.status(500).json({ error: 'Failed to send acknowledgement email.' })
            }

            console.log('Acknowledge email sent:', info.response);
            res.status(200).json({ sucess: true, message: 'Email sent successfully!' });
        });
    });
})

app.listen(PORT, () => {
    console.log(`Server is Running on http://localhost:${PORT}`)
})