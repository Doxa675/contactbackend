const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 2453;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'onasanyaqudus2005@gmail.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body

    //  Validate fields
    if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // try {
    //     // Send email
    //     await transporter.sendMail({
    //         from: `"Website Contact" <${process.env.EMAIL_USER}>`,
    //         to: process.env.EMAIL_USER,
    //         replyTo: email,
    //         subject: "New Contact Form Submission",
    //         html: `
    //             <h3>New Contact Form Submission</h3>
    //             <p><strong>Name:</strong> ${name}</p>
    //             <p><strong>Email:</strong> ${email}</p>
    //             <p><strong>Phone:</strong> ${phone}</p>
    //             <p><strong>Subject:</strong> ${subject}</p>
    //             <p><strong>Message:</strong><br>${message}</p>
    //         `,
    //     });

    //     return res.status(200).json({ success: true, message: "Email sent successfully!" });
    // } catch (error) {
    //     console.error("Email sending error:", error);
    //     return res.status(500).json({ error: "Failed to send email." });
    // }

    //Admin Email Template
    const adminHtml =`
    <div style = "font-family: Arial, sans-serif; padding: 20px; color: #333">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p>${message}</p>
    </div>
    `;

    //User Acknowledgement Email Template
    const userHtml = `
        <div style = "font-family: Arial, sans-serif; padding: 20px; color: #333">
            <h2>New Contact Form Submission</h2>
            <p>Dear${name}</p>
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

    //Acknowledgement Email to user
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting us!',
        html: userHtml,
    }

    transporter.sendMail(adminMailOptions, (error, info) => {
        if(error){
            console.error('Error sending email to admin:', error);
            return res.status(500).json({error: 'Failed to send email to admin. '});
        }

        console.log('Admin email sent:', info.response);

        transporter.sendMail(userMailOptions, (error, info) => {
            if(error){
                console.error('Error sending acknowledgement email to user', error)
                return res.status(500).json({error: 'Failed to send acknowledgement email to user. '})
            }

            console.log('Acknowledge email sent: ', info.response);
            res.status(200).json({sucess: true, message: 'Emails sent successfully!'});
        });
    });
});


app.listen(2453, () => {
    console.log(`Server running on http://localhost:${2453}`);
});
