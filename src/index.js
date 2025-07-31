const express=require('express');
const nodemailer=require('nodemailer');
const path=require('path');
const http=require('http');
const qrCode=require('qrcode');
const dotenv=require('dotenv');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const os = require('os');
const fs = require('fs');

os.hostname('Bengaluru Moments');

dotenv.config();

var app=express();
var server=http.Server(app);
var port=process.env.PORT || 5000;

app.set('port',port);
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public'))); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,'public','YM.html'))
});

//sending mail on listing an event
app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,'public','try.html'))
});

app.post('/listEvent',(req,res)=>{
    console.log(req.body);
    var email =req.body.email;
    var name=req.body.name;
    var tag=req.body.tag;
    var desc=req.body.desc;
    var date=req.body.date;
    var time=req.body.time;
    var price=req.body.price;
    var loc=req.body.loc;  

    const htmlContent = `
        <h1>New Request for Listing an Event Received</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tag:</strong> ${tag}</p>
        <p><strong>Description:</strong> ${desc}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Location:</strong> ${loc}</p>
    `;

    const transporter=nodemailer.createTransport({
        
        service:'gmail',
        host:'smtp.gmail.com',
        auth:{
            user:'bengaluruevents24@gmail.com',
            pass:'pxsu tcin xlvx tnon',
        },
    });

    const mailOptions={
        from:{       
            address:email,
        },
        to:["bengaluruevents24@gmail.com"],
        subject:"New request for listing an event recieved",
        html: htmlContent,
        
    }

    transporter.sendMail(mailOptions, (error, info) => {
        console.log('came here');
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to send email" });
        } else {
            console.log('Email Sent Successfully: ' + info.response);
            res.status(200).json({ message: "Email Sent Successfully" });
            res.redirect('try.html');
        }
    });
});


//sending email on initiating booking
app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,'public','booking.html'))
})

app.post('/booking-form',(req,res)=>{
    var name =req.body.name;
    var email =req.body.email;
    const transporter=nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        auth:{
            user:'bengaluruevents24@gmail.com',
            pass:'pxsu tcin xlvx tnon',
        },
    });

    const mailOptions={
        from:{
            name:'Bengaluru Moments',        
            address:'bengaluruevents24@gmail.com'
        },
        to:[email],
        subject:"Booking initiated in Bengaluru Moments",
        text: `Dear ${name},

        We are writing to inform you that a ticket booking has been initiated for an event in Bengaluru Moments. Our team has taken the necessary steps to secure your reservation, ensuring your presence at this exciting occasion.

        Details regarding the event, including date, time, and venue, will be communicated to you shortly. Rest assured, we are committed to providing you with a seamless experience throughout this process.

        Thank you for choosing us for your ticketing needs.

Warm regards,
Bengaluru Moments`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to send email" });
        } else {
            console.log('Email Sent Successfully: ' + info.response);
            res.redirect('/payment.html');
            res.status(200).json({ message: "Email Sent Successfully" });
            
        }
    });
});


//signup
app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,'public','register.html'))
})

app.use(bodyParser.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://Localhost:27017/mydb',{
});

var db=mongoose.connection;

db.on('error',()=>console.log("Error in connecting to database"));
db.once('open',()=>console.log("Connected to database"));

app.post('/signup',(req,res)=>{
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    var data={
        'name':name,
        'mail':email,
        'password':password,
    }
    db.collection('users').findOne({ 'mail': email }, (err, result) => {
        if (err) {
            console.error("Error while checking user existence:", err);
            res.status(500).json({ message: "Internal server error" });
        } else {
            if (result) {
                console.log("User already exists. Please login.");
                res.status(400).json({ message: "User already exists. Please login." });
            } else {
                db.collection('users').insertOne(data, (err, collection) => {
                    if (err) {
                        console.error("Error while inserting user record:", err);
                        res.status(500).json({ message: "Failed to insert user record" });
                    } else {
                        console.log("Record Inserted Successfully");
    
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            host: 'smtp.gmail.com',
                            auth: {
                                user: 'bengaluruevents24@gmail.com',
                                pass: 'pxsu tcin xlvx tnon',
                            },
                        });
    
                        const mailOptions = {
                            from: {
                                name: 'Bengaluru Moments',
                                address: 'bengaluruevents24@gmail.com'
                            },
                            to: [email],
                            subject: "Welcome to Bengaluru Moments!",
                            text: `Dear ${name},
    
        We are thrilled to welcome you to Bengaluru Moments, your gateway to the vibrant and diverse experiences of events around Bengaluru! 

        At Bengaluru Moments, we are dedicated to providing you with the best of what this dynamic city has to offer. From cultural festivals to culinary delights, from bustling markets to serene treks, Bengaluru has something for everyone, and we are here to help you discover it all.    

        As a member of Bengaluru Moments, you will gain access to exclusive events, special offers, and personalized recommendations tailored to your interests. Get ready to explore Bengaluru like never before and create lasting memories along the way.
    
    Once again, welcome to Bengaluru Moments! We're excited to have you join our community.
    
Warm regards,
Bengaluru Moments`,
                        }
    
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error("Error while sending email:", error);
                                res.status(500).json({ message: "Failed to send email" });
                            } else {
                                console.log('Email Sent Successfully: ' + info.response);
                                res.status(200).json({ message: "Signup successful. Email sent successfully" });
                            }
                        });
                    }
                });
            }
        }
    });
});

//login
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','login.html'))
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.collection('users').findOne({ 'mail': email }, (err, result) => {
        if (err) {
            console.error("Error in finding user:", err);
            res.status(200).json({ message: "Internal Server Error" });
        } else {
            if (!result) {
                console.log("User not found. Please sign up.");
                res.status(200).json({ message: "User not found. Please sign up." });
            } else {
                if (result.password === password) {
                    console.log("Login successful");
                    res.status(200).json({ message: "Login successful" });
                } else {
                    console.log("Wrong password entered. Consider changing password by visiting forgot password.");
                    res.status(200).json({ message: "Wrong password entered. Consider changing password by visiting forgot password." });
                }
            }
        }
    });
});

var e;

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','forgot_pass.html'))
})

//forgot-password
app.post('/forgot', (req, res) =>{
    const { email, password} = req.body;e=email;
    const user = db.collection('users').findOne({ 'mail': email });
    db.collection('users').findOne({ 'mail': email }, (err, result) => {
        if (err) {
            console.error("Error in finding user:", err);
            res.status(200).json({ message: "Internal Server Error" });
        } else {
            if (!result) {
                console.log("User not found. Please sign up.");
            } else {
                if (result) {
                    db.collection('users').updateOne(
                        { 'mail': email }, 
                        { $set: { 'password': password } }, 
                        (err, result) => {
                          if (err) {
                            console.error("Error updating password:", err);
                          } else {
                            console.log("Password updated successfully");
                          }
                        }
                      );
                      
                    console.log("Password updated");
                    res.status(200).json({ message: "Password updated" });
                } else {
                    console.log("Password could not be updated");
                    res.status(200).json({ message: "Password could not be updated" });
                }
            }
        }
    });
});


//qr-generation

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','upi.html'))
})


app.post('/generate-ticket', async (req, res) => {
    try {
        const eventq = req.body.eventq;
        const eventPrice = req.body.eventPrice;
        const eventTitle = req.body.eventTitle;
        const u_mail = req.body.u_mail;
        const u_name = req.body.u_name;
        const eventDate = req.body.eventDate;
        const eventTime = req.body.eventTime;
        console.log(u_mail);
        /*const qrDataString = JSON.stringify({
            eventq,
            eventPrice,
            eventTitle,
            u_mail,
            eventDate,
            eventTime
        }, null, 2);
        const formattedQRDataString = qrDataString.replace(/\n/g, `\\n`);

        const qrCodeImage = await qrCode.toDataURL(formattedQRDataString);*/

        /*await sendEmailWithQRCode(qrCodeImage,u_mail);*/
        /*console.log("Ticket generation successful");
        res.status(200).json({ message: "Email Sent Successfully" });*/



        const qr = require('qr-image');
        const fs = require('fs');

        const qrDataString = JSON.stringify({
            Event_Name : eventTitle,
            Event_Price : eventPrice,        
            Event_Title : eventq,
            Date : eventDate,
            Time : eventTime        
        }, null, 2);

        const htmlContent = `${qrDataString}`;
        const qrCodeBuffer = qr.imageSync(htmlContent, { type: 'png' });
        /*fs.writeFileSync('qrCodeWithHTMLContent.png', qrCodeBuffer);*/
        const qrCodeBase64 = qrCodeBuffer.toString('base64');




        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'bengaluruevents24@gmail.com',
                pass: 'pxsu tcin xlvx tnon',
            },
        });
    
        const mailOptions = {
            from: {
                name: 'Bengaluru Moments',
                address: 'bengaluruevents24@gmail.com'
            },
            to:u_mail,//akathasagaram@gmail.com
            subject: 'Your Event Ticket', 
            text: 'Please find your event ticket attached.',
            attachments: [{
                filename: 'ticket.png',
                content: /*qrCodeImage.split(';base64,').pop()*/qrCodeBase64,
                encoding: 'base64'
            }],
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>E-mail Draft</title>
                <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
                <style>        
                    @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300&display=swap');
                
                    * {
                        margin: 0;
                        padding: 0;
                        border: 0;
                        color: black;
                    }
                    
                    body {
                        font-family: "Ubuntu", sans-serif;
                        background-color:mistyrose;
                        font-size: 15px;
                        max-width: 750px;
                        margin: 0 auto;
                        padding: 5%;
                        
            
                    }
            
                    img {
                        max-width: 60%;
                    }
            
                    header {
                        width: 98%;
                        margin-bottom: 2px;
                    }
            
                    #wrapper{
                        background-color:gainsboro;
                        
            
                    }
            
                    #logo {
                        max-width: 120px;
                        margin: 3% 0 3% 3%;
                        float: left;
                    }
            
                    #social {
                        float: right;
                        margin: 3% 2% 4% 3%;
                        list-style-type: none;
            
                    }
                    #social > li {
                        display: inline;
            
                    }
                    #social > li > a > img {
                        max-width: 40px;
                        max-height: 30px;
                        margin: 5px;
                    }
            
                    #banner {
                        max-width: 100%;
                        width: 70;
                        padding-top: 100px;
                        padding-left: 15%;
                        padding-right: 15%;
                        text-align: center;
               
                
                    }
            
                    h1,p {
                        margin: 3%;
            
                    }
            
                    hr {
                        height: 1px;
                        background-color: black;
                        clear: both;
                        width: 96%;
                        margin:auto;
                    
                    }
            
                    #contact{
                        text-align: center;
                        font-size:xx-small;
                        padding-bottom: 4%;
                        line-height: 10px;
                    }
                    p{
                        text-align: justify;
                    }
                </style>
            </head>
            <body>
                <div id="wrapper" style="background-image: url(https://img.freepik.com/free-vector/gradient-pastel-sky-background_23-2148902196.jpg);background-size: cover;">
                    <header>
                        <div style="font-family:Arial, Helvetica, sans-serif;font-weight: bold;margin-left: 40px;padding-top: 40px;font-style: italic;">
                            <h2>BENGALURU MOMENTS</h2>
                        </div>            
                        <div style="margin-top: -55px;">
                            <ul id="social">
                                <li>
                                    <a href="https://www.instagram.com" target="_blank"><img src="https://freelogopng.com/images/all_img/1658588965instagram-logo-png-transparent-background.png" alt="instagram"></a>
                                </li>
                                <li>
                                    <a href="https://www.facebook.com" target="_blank"><img src="https://cdn1.iconfinder.com/data/icons/social-media-circle-7/512/Circled_Facebook_svg-512.png" alt="facebook"></a>
                                </li>
                                <li>
                                    <a href="https://www.youtube.com" target="_blank"><img src="https://www.freeiconspng.com/thumbs/youtube-logo-png/hd-youtube-logo-png-transparent-background-20.png" alt="Youtube"></a>
                                </li>
                                <li>
                                    <a href="https://twitter.com/?lang=en" target="_blank"><img src="https://pngimg.com/d/twitter_PNG34.png" alt="Twitter"></a>
                                </li>
                            </ul>
                        </div>
                    </header><br>
                    <hr>
                    <div>
                        <img src="https://i.pinimg.com/564x/a5/c6/bc/a5c6bc5f73830eb488bad90995a1f90e.jpg" style="width: 500px;height: 200px;display: flex;align-self: center;margin: auto;margin-top: 5px;">
                    </div>
                    <div class="one-col" style="margin-top: -10px;">
                        <h1>Ticket Booked!</h1>
            
                        <p>Dear Event Enthusiast,</p>
                        <p>Wow! You're all set for an incredible time at Bengaluru Events! 🎉 We're thrilled to confirm your ticket. </p>
                        <p>Get ready to dive into a world of excitement and entertainment! Hold onto it tight—it's your golden pass to an unforgettable experience.</p>
                        <p> We can't wait to see your smiling face in the crowd, soaking up every moment of the event. If you need anything at all, just give us a shout. We're here to make sure your experience is nothing short of amazing!</p>
                        <hr/>
                        <footer>
                            <p id="contact">
                                Bengaluru Moments<br>
                                bengaluruevents24@gmail.com<br>
                            </p>
                        </footer>
                    </div>
                </div>
            </body>
            </html>`
            }
            
            /*transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error while sending email:", error);
                    reject(error); // Reject the promise if there's an error
                } else {
                    console.log('Email Sent Successfully: ' + info.response);
                    resolve(); // Resolve the promise if email is sent successfully
                }
            });*/
    
            transporter.sendMail(mailOptions, (error, info) => {
                console.log('came here');
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: "Failed to send email" });
                } else {
                    console.log('Email Sent Successfully: ' + info.response);
                    /*res.status(200).json({ message: "Email Sent Successfully" });*/
                    res.redirect('YM.html');
                }
            });




    } catch (error) {
        console.error('Error generating ticket:', error);
        /*res.status(500).send('Error generating ticket');*/
    }
});

/*function sendEmailWithQRCode(qrCodeImage,u_mail) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'bengaluruevents24@gmail.com',
            pass: 'pxsu tcin xlvx tnon',
        },
    });

    const mailOptions = {
        from: {
            name: 'Bengaluru Moments',
            address: 'bengaluruevents24@gmail.com'
        },
        to:u_mail,//akathasagaram@gmail.com
        subject: 'Your Event Ticket', 
        text: 'Please find your event ticket attached.',
        attachments: [{
            filename: 'ticket.png',
            content: qrCodeImage.split(';base64,').pop(),
            encoding: 'base64'
        }],
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>E-mail Draft</title>
            <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
            <style>        
                @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300&display=swap');
            
                * {
                    margin: 0;
                    padding: 0;
                    border: 0;
                }
                
                body {
                    font-family: "Ubuntu", sans-serif;
                    background-color:mistyrose;
                    font-size: 15px;
                    max-width: 750px;
                    margin: 0 auto;
                    padding: 5%;
                    
        
                }
        
                img {
                    max-width: 60%;
                }
        
                header {
                    width: 98%;
                    margin-bottom: 2px;
                }
        
                #wrapper{
                    background-color:gainsboro;
                    
        
                }
        
                #logo {
                    max-width: 120px;
                    margin: 3% 0 3% 3%;
                    float: left;
                }
        
                #social {
                    float: right;
                    margin: 3% 2% 4% 3%;
                    list-style-type: none;
        
                }
                #social > li {
                    display: inline;
        
                }
                #social > li > a > img {
                    max-width: 40px;
                    max-height: 30px;
                    margin: 5px;
                }
        
                #banner {
                    max-width: 100%;
                    width: 70;
                    padding-top: 100px;
                    padding-left: 15%;
                    padding-right: 15%;
                    text-align: center;
           
            
                }
        
                h1,p {
                    margin: 3%;
        
                }
        
                hr {
                    height: 1px;
                    background-color: black;
                    clear: both;
                    width: 96%;
                    margin:auto;
                
                }
        
                #contact{
                    text-align: center;
                    font-size:xx-small;
                    padding-bottom: 4%;
                    line-height: 10px;
                }
                p{
                    text-align: justify;
                }
            </style>
        </head>
        <body>
            <div id="wrapper">
                <header>
                    <div style="font-family:Arial, Helvetica, sans-serif;font-weight: bold;margin-left: 40px;padding-top: 40px;font-style: italic;">
                        <h2>BENGALURU MOMENTS</h2>
                    </div>            
                    <div style="margin-top: -55px;">
                        <ul id="social">
                            <li>
                                <a href="https://www.instagram.com" target="_blank"><img src="https://freelogopng.com/images/all_img/1658588965instagram-logo-png-transparent-background.png" alt="instagram"></a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com" target="_blank"><img src="https://cdn1.iconfinder.com/data/icons/social-media-circle-7/512/Circled_Facebook_svg-512.png" alt="facebook"></a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com" target="_blank"><img src="https://www.freeiconspng.com/thumbs/youtube-logo-png/hd-youtube-logo-png-transparent-background-20.png" alt="Youtube"></a>
                            </li>
                            <li>
                                <a href="https://twitter.com/?lang=en" target="_blank"><img src="https://pngimg.com/d/twitter_PNG34.png" alt="Twitter"></a>
                            </li>
                        </ul>
                    </div>
                </header><br>
                <hr>
                <div>
                    <img src="https://i.pinimg.com/originals/92/ed/91/92ed918809788ed829d99378b404af16.gif" style="width: 900px;height: 200px;display: flex;align-self: center;margin: auto;margin-top: 5px;">
                </div>
                <div class="one-col">
                    <h1>Ticket Booked!</h1>
        
                    <p>Dear Event Enthusiast,</p>
                    <p>Wow! You're all set for an incredible time at Bengaluru Events! 🎉 We're thrilled to confirm your ticket. </p>
                    <p>Get ready to dive into a world of excitement and entertainment! Your Ticket ID is: [Ticket ID]. Hold onto it tight—it's your golden pass to an unforgettable experience.</p>
                    <p> We can't wait to see your smiling face in the crowd, soaking up every moment of the event. If you need anything at all, just give us a shout. We're here to make sure your experience is nothing short of amazing!</p>
                    <hr/>
                    <footer>
                        <p id="contact">
                            Bengaluru Moments<br>
                            bengaluruevents24@gmail.com<br>
                        </p>
                    </footer>
                </div>
            </div>
        </body>
        </html>`
        }
        
        /*transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error while sending email:", error);
                reject(error); // Reject the promise if there's an error
            } else {
                console.log('Email Sent Successfully: ' + info.response);
                resolve(); // Resolve the promise if email is sent successfully
            }
        });

        transporter.sendMail(mailOptions, (error, info) => {
            console.log('came here');
            if (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to send email" });
            } else {
                console.log('Email Sent Successfully: ' + info.response);
                res.status(200).json({ message: "Email Sent Successfully" });
                res.redirect('upi.html');
            }
        });

}*/



server.listen(port,()=>{
    console.log("Server running on port : "+port);
});
