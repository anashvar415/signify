const express = require("express");
require("dotenv").config();
const app=express();
const mongoose = require("mongoose");
const ejsLayouts = require("express-ejs-layouts");
const path = require("path");
const User = require("./models/user");
const passport = require("passport");
const session = require("express-session");

app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
   cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

const nodemailer = require("nodemailer");



const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(ejsLayouts);                
app.set('layout', 'layouts/boilerplate');


passport.use(new LocalStrategy( User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.user ;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  
  next();
});

async function main(){
await mongoose.connect(process.env.MONGO);

        
    }
    main().then(()=>{    console.log("connected to db");}
)
.catch((err)=>{
        console.log(err);
    });
app.get('/',(req,res)=>{
  res.render('home');
})

app.post("/signup", async (req, res) => {
 
  try { const { username, email, password } = req.body;
    const user = new User({ username, email });
   const registered= await User.register(user, password);
      req.login(registered, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome, you're signed up and logged in!");
      res.redirect("/"); 
    });
  
  } catch (error) {
    console.log("Error during signup:", error);
   
    req.flash("error", "User already exists with that email or username.");
    res.redirect("/");
  }
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "You must be signup to view this page.");
  res.redirect("/");
}
app.get("/login", (req, res) => {
 
  res.render('login')});
 
app.post("/login", async (req, res) => {
 
const {username,password}=req.body;
  try {
    const user = await User.findOne({ username });

    const isValid = await user.authenticate(password);
  
   

    req.logIn(isValid.user, (err) => {
      if (err) {
        req.flash("error", "Login failed.");
        return res.redirect("/login");
      }
      req.flash("success", "Logged in successfully!");
      res.redirect("/");
    });

  } catch (err) {
   
    req.flash("error", "Something went wrong.");
    res.redirect("/login");
  }
});
  

app.get('/logout', isLoggedIn, (req, res) => {
    req.logout((err) => {   
        if (err) {
            console.error('Logout error:', err);
            
        }
        req.flash("success", "Logged out successfully");
        res.redirect('/');
    })});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");});
  app.get('/forget', (req,res)=>{
  
  res.render('forget'); 
  })
  app.post("/forget", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Email not registered.");
      return res.redirect("/forget");
    }

   
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.Code = code;
    user.CodeExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();
  
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD , 
      }
    });

    const mailOptions = {
      to: user.email,
      from: `"Signify Team"${process.env.EMAIL}`
,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${code}. It expires in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
    
    req.flash("success", "Reset code sent to your email.");
    res.redirect('/forget'); 
  } catch (err) {
    console.error(err);
    req.flash("error", "Error sending reset code.");
    res.redirect("/forget");
  }
});
app.post('/verify',async (req,res)=>{
const code = req.body['verification'];
const users = await User.findOne({ Code:code });
console.log(users);
 
if(users!=null){req.session.username = users.username;

  res.render('reset',{ username: users.username })
 
}
else 
{
  req.flash('error','Invalid code');
  res.redirect('/forget')
}

})
app.post('/reset', async (req, res) => {
  const { Repassword } = req.body;
  const username = req.session.username;
  

  if (!username) {
    return res.redirect('/login');
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      req.flash("error","user not exist");
      res.redirect('/forget')
    }

    await user.setPassword(Repassword); 
    await user.save(); 
    

    
    req.flash('success', 'Password reset successful. Please log in.');
    res.redirect('/login');
  } catch (err) {
    req.flash("error","error occured");
    res.redirect("/forget")
  }
});
