const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express route to handle form submission
app.post('/submit-form', (req, res) => {
  const { name, email, tag,desc,date,time,price,loc,img } = req.body;

  // Create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user:'bengaluruevents24@gmail.com',
            pass:'pxsu tcin xlvx tnon',
    }
  });

  // Email content
  const mailOptions = {
    from: 'bengaluruevents24@gmail.com',
    to: 'madhushreeshetty2003@gmail.com',
    subject: 'New Event listed',
    text: `Name: ${name}\nEmail: ${email}\nTagline: ${tag}\nDescription:${desc}\nDate:${date}\nTime:${time}\nPrice:${price}\nLocation:${loc}\nImage:${img}\n`
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Message sent successfully!');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
