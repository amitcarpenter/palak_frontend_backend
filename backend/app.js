// app.js
const ejs = require("ejs");
const cors = require("cors");
const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const bodyParser = require("body-parser");


const app = express();
const PORT = process.env.PORT || 3000;


const razorpay = new Razorpay({
    key_id: 'rzp_test_XGkfx84OsbbVDp',
    key_secret: 'BRTSYVhGt6IQ22u5hSeafxNS',
});



// MongoDB connection
mongoose.connect('mongodb://127.0.0.1/Fit_With_Palak').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log(error)
})

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});


const Contact = mongoose.model('Contact', contactSchema);

app.use(express.static("dist"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Configure express session

// Set Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend"));

// Use Middle ware
app.use(cors());
app.use(
    "/css",
    express.static(path.join(__dirname, "../frontend/css"))
);
app.use(
    "/css_blog",
    express.static(path.join(__dirname, "../frontend/css_blog"))
);
app.use(
    "/fonts",
    express.static(path.join(__dirname, "../frontend/fonts"))
);
app.use(
    "/fonts_blog",
    express.static(path.join(__dirname, "../frontend/fonts_blog"))
);
app.use(
    "/img",
    express.static(path.join(__dirname, "../frontend/img"))
);
app.use(
    "/js",
    express.static(path.join(__dirname, "../frontend/js"))
);
app.use(
    "/js_blog",
    express.static(path.join(__dirname, "../frontend/js_blog"))
);
app.use(
    "/scss_blog",
    express.static(path.join(__dirname, "../frontend/scss_blog"))
);
app.use(
    "/Source",
    express.static(path.join(__dirname, "../frontend/Source"))
);
app.use(express.static("public"));

// Express middleware
app.use(express.json());

// Define your routes or include them from separate files
app.get('/', (req, res) => {
    res.render("index.ejs")
});

app.get('/about', (req, res) => {
    res.render("about-us.ejs")
});

app.get('/classes', (req, res) => {
    res.render("classes.ejs")
});

app.get('/pricing', (req, res) => {
    res.render("pricing.ejs")
});

app.get('/blog', (req, res) => {
    res.render("blog.ejs")
});

app.get('/contact', (req, res) => {
    res.render("contact.ejs")
});

app.get('/single-blog', (req, res) => {
    res.render("single-blog.ejs")
});






app.post('/submit-form', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        res.status(201).json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// app.post('/create-order', async (req, res) => {
//     try {
//         const options = {
//             amount: req.body.amount * 100, // amount in paise
//             currency: 'INR', // change it to your preferred currency
//             receipt: 'order_receipt_' + Date.now(),
//             payment_capture: 1,
//         };

//         const response = await razorpay.orders.create(options);
//         res.json(response);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


app.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100,
            currency: 'INR',
            receipt: 'order_receipt_' + Date.now(),
            payment_capture: 1,
        };

        const response = await razorpay.orders.create(options);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
