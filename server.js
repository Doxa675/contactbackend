app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        await transporter.sendMail({
            from: `"User" <${process.env.EMAIL_USER}>`,
            replyTo: email,
            to: process.env.EMAIL_USER,
            subject: "New User",
            html: `
                <h3>User Info Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        });

        return res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send email." });
    }
});
