# Signify

This project is a *full-featured authentication system* built with Node.js, Express, EJS layouts, and Bootstrap for styling. It uses *Passport.js* for authentication and session management, *MongoDB* for storing user data, and *Nodemailer* for sending verification codes to reset forgotten passwords.

## Features

✅ User Registration  
✅ User Login  
✅ Password Hashing  
✅ Session Management with Passport  
✅ Forgot Password with Email Verification Code  
✅ User Authorization  
✅ Responsive UI with Bootstrap  
✅ EJS Layouts for dynamic pages

---

## Tech Stack

- *Backend:* Node.js, Express
- *Database:* MongoDB (with Mongoose)
- *Authentication:* Passport.js (LocalStrategy)
- *Templating Engine:* EJS with layouts
- *Styling:* Bootstrap 5
- *Email:* Nodemailer

---

---

## How It Works

1. *User Registration*  
   - Users can register with a username, email, and password.
   - Passwords are hashed before being saved in MongoDB.

2. *User Login & Sessions*  
   - Users log in using Passport LocalStrategy.
   - Sessions are maintained using express-session to keep users logged in.

3. *Authorization*  
   - Authenticated users can access protected routes.
   - Middleware checks whether a user is logged in before granting access.

4. *Forgot Password Flow*
   - User enters their email on the "Forgot Password" page.
   - A verification code is sent using Nodemailer.
   - User enters the code, and if correct, they can set a new password.

5. *Responsive UI*
   - Bootstrap makes the app look clean and responsive on all devices.
   - EJS layouts are used for reusing components like navbar and footer.

---
