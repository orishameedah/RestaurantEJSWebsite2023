const express = require('express');
const Admin = require('../models/admin');
const Menu = require('../models/menu');
const Order = require('../models/order');
const cloudinary = require('../utils/cloudinary')
const router = express.Router();
const multer = require('multer');
// const dateTime = require('date-and-time')

var storage = multer.diskStorage({

})

//middleware
var upload = multer({
    storage: storage,
}).single('image') //uploading a single image at a time

//Signup
router.post('/signup',  (req, res)=> {
    const { firstname, surname, email, password } = req.body
    const admin = new Admin({
        firstname,
        surname,
        email,
        password,
    });  

     
   admin.save(async(err)=>{
        if(err){
            let existingAdmin =  await Admin.findOne({email});
            if(existingAdmin){
                req.session.message={
                    type: 'danger',
                    message: 'Admin already exist'
                }
                res.redirect('/signup')
            }
            // console.log(err)
            // res.json({ message: err.message, type: 'danger' })
        }else{
            // console.log(admin)
            req.session.message={
                type: 'success',
                message: 'SignUp Successfully'
            }
            res.redirect('/signin')
        }
    })
})

//Get all menu by category on the homepage
router.get('/', async (req, res)=> {
    try{
        const limitNumber = 7;
        const breakfast = await Menu.find({ 'category': 'Breakfast' }).limit(limitNumber);
        const lunch = await Menu.find({ 'category': 'Lunch' }).limit(limitNumber);
        const dinner = await Menu.find({ 'category': 'Dinner' }).limit(limitNumber);
        const drink = await Menu.find({ 'category': 'Drinks' }).limit(limitNumber);
        const dessert = await Menu.find({ 'category': 'Dessert' }).limit(limitNumber);

        const food = { breakfast, lunch, dinner, drink, dessert };
    res.render('index', {title: 'Restaurant Website' , food: food})
    }catch(err){
        res.json({ message: err.message })
    }
})

router.get('/signup', (req, res)=>{
    res.render('signup', {title: 'Admin Signup'})
})

//Signin
router.post('/signin', async(req, res)=>{
    const signinAdmin = await Admin.findOne({
        email: req.body.email,
        password: req.body.password
    })
    // console.log("Signin Admin: ", signinAdmin);
    if(!signinAdmin){
        // res.json({ message: "Invalid Email or Password", type: 'danger' });
        req.session.message={
            type: 'danger',
            message: 'Invalid Email or Password'
        }
        res.redirect('/signin')
        console.log(req.session)
    }else{
        req.session.message={
            type: 'success',
            message: 'Signin Successfully'
        }
        
        res.redirect('/admin')
    }
})

router.get('/signin', (req, res)=>{
    res.render('signin', {title: 'Admin Login'})
})

//Adding new menu 
router.post('/addmenu', upload, async (req, res)=>{
    const result = await cloudinary.uploader.upload(req.file.path);
    try{
        const menu = new Menu({
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            category: req.body.category,
            image: result.secure_url,
            cloudinary_id: result.public_id,
        });

        await menu.save();
        // console.log('menu: ', menu)
        req.session.message={
            type: 'success',
            message: 'Menu added successfully'
        }
        res.redirect('/admin');
    }catch(err){
        res.json({ message: err.message, type: 'danger' })
    }
})

router.get('/addmenu', (req, res)=>{
    res.render('add-menu', {title: 'Menu Page'})
})


//Get all Menu on the admin page
router.get('/admin', async (req, res)=> {
    try{
        const foods = await Menu.find();
        res.render('admin', {title: 'Admin Page' , foods: foods})
    }catch(err){
        res.json({ message: err.message })
    }
})

// Editing and Updating Menu
// Update menu route
router.post('/update/:id', upload, async (req, res)=>{
    let id = req.params.id;
    let menu = await Menu.findById(req.params.id);
    let new_image = '';
    if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path);
        // new_image = req.file.path; //assign the newly selected image file name to new_image
        new_image = result.secure_url;
        try{
            // fs.unlinkSync('./public/uploads/' + req.body.old_image); //to remove old image from public
                  // Delete image from cloudinary
        await cloudinary.uploader.destroy(menu.cloudinary_id);  //to replace 
        } catch(err){
            console.log(err)
        }
    }else{
        new_image = req.body.old_image;  //means we are not changing the old image
    }

    Menu.findByIdAndUpdate(id, {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        image: new_image,
    }, (err, result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }else{
            req.session.message = {
                type: 'success',
                message: 'Menu updated successfully',
            };
            // res.redirect(`/edit/${id}`);
            res.redirect('/admin');
        }
    });
});

//Fetching the updated menu
router.get('/edit/:id', (req, res)=> {
    let id = req.params.id; //the id value is coming from the url in the browser 
    Menu.findById(id, (err, menu)=> {
        if(err){
            res.redirect('/admin');
        }else {
            if (menu == null){
                res.redirect('/admin')
            }else{
                res.render('edit-menu', {title: 'Edit Menu', menu: menu})
            }
        }
    })
})

//Deleting menu
router.get("/delete/:id", async (req, res) => {
    try {
      // Find menu by id
      let menu = await Menu.findById(req.params.id);
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(menu.cloudinary_id);
      // Delete user from mongodb
      await menu.remove();
      req.session.message ={
        type: 'info',
        message: 'Menu deleted successfully',
      };
      res.redirect('/admin') 
    } catch (err) {
        console.log(err)
      res.json({message:err.message})
}});


//Adding new order into mongodb
router.post('/order', async (req, res)=>{
    try{
        // Formatting the date and time
        // const value = (new Date(req.body.date));
        const order = new Order({
            fullname: req.body.fullname,
            foodname: req.body.foodname,
            details: req.body.details,
            address: req.body.address,
            email: req.body.email,
            quantity: req.body.quantity,
            phone:req.body.phone,
            date: req.body.date,
        });

        await order.save();
        // console.log('menu: ', menu)
        req.session.message={
            type: 'success',
            message: 'Order added successfully'
        }
        res.redirect('/');
    }catch(err){
        res.json({ message: err.message, type: 'danger' })
    }
})


//Get all Order on the Order page
router.get('/admin-order', async (req, res)=> {
    try{
        const orders = await Order.find();
        res.render('admin-order', {title: 'Order Page' , orders: orders})
    }catch(err){
        res.json({ message: err.message })
    }
})

// Editing and Updating Menu
// Update menu route
router.post('/updateorder/:id', async (req, res)=>{
    let id = req.params.id;
    Order.findByIdAndUpdate(id, {
        fullname: req.body.fullname,
        foodname: req.body.foodname,
        details: req.body.details,
        address: req.body.address,
        email: req.body.email,
        quantity: req.body.quantity,
        phone:req.body.phone,
        date: req.body.date,
    }, (err, result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }else{
            req.session.message = {
                type: 'success',
                message: 'Order updated successfully',
            };
            // res.redirect(`/edit/${id}`);
            res.redirect('/admin-order');
        }
    });
});

//Fetching the updated order
router.get('/edit-order/:id', (req, res)=> {
    let id = req.params.id; //the id value is coming from the url in the browser 
    Order.findById(id, (err, order)=> {
        if(err){
            res.redirect('/admin-order');
        }else {
            if (order == null){
                res.redirect('/admin-order')
            }else{
                res.render('edit-order', {title: 'Edit Order', order: order})
            }
        }
    })
})

//Deleting order
router.get("/delete-order/:id", async (req, res) => {
    try {
      // Find order by id
      let order = await Order.findById(req.params.id);
      // Delete order from mongodb
      await order.remove();
      req.session.message ={
        type: 'info',
        message: 'Order deleted successfully',
      };
      res.redirect('/admin-order') 
    } catch (err) {
        console.log(err)
      res.json({message:err.message})
}});


module.exports = router;