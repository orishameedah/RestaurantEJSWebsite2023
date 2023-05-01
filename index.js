// require('dotenv').config();
// const express = require('express');
// const routes = require('./router/router');
// const path = require('path')

// const app = express();
// const PORT = process.env.PORT || 6000;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json())

// //add this to view the images on the ejs page
// // app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, './public'))); 

// //set the templte engine which is ejs
// app.set('view engine', 'ejs');

// //routes prefix
// app.use('/', routes);

// app.listen(PORT, ()=>{
//     console.log(`serr running at http://localhost:${PORT}`)
// })

//MONGODB CONNECTION
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const session = require('express-session');
const routes = require('./router/router');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 6000;

mongoose.connect(process.env.DB_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", ()=> console.log("Connected to mongodb"));

// mongoose.connect(
//   process.env.DB_ATLAS,
//   options,
//   (err) => {
//    if(err) console.log(err) 
//    else console.log("mongdb is connected");
//   }
// );

// // or

// mongoose.connect(
//   process.env.DB_ATLAS,
//   options
// )
// .then(()=>console.log('connected'))
// .catch((e)=>console.log(e))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'mysecret ejs',
    saveUninitialized: true,
    resave: false,
}));

//for saving session message onto the req object
app.use((req, res, next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//add this to view the images on the ejs page
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, './assets'))); 

//set the templte engine which is ejs
app.set('view engine', 'ejs');

//routes prefix
app.use('/', routes);

app.listen(PORT, ()=>{
    console.log(`server running at http://localhost:${PORT}`)
})
