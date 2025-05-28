import {Router} from 'express';
import {createUser, login} from '../data/user.js';
import nodemailer from 'nodemailer';

const router = Router();

router
.route('/')
.get(async(req,res)=>{
    try{
        res.redirect('/user/login');
    }
    catch(e){
        res.status(500).render('user/error', {error:e});
    }
});

router
.route('/register')
.get(async(req,res)=>{
    if(!req.session.user){
        return res.render('user/register');
    }
    else{
            if(req.session.user.status===0){
                return res.redirect('/credit/approved');
            }
            if(req.session.user.status===1){
                return res.redirect('/credit/declined');
            }
            else{
                return res.redirect('/credit/usercredit');
            }
        }

})
.post(async(req,res)=>{
    const{username, userpassword, confirmpass, useremail, firstname, lastname} = req.body;
    try{
        await createUser(username, userpassword, confirmpass, useremail, firstname, lastname);
        res.status(200).redirect('/user/login');
    }
    catch(e){
        res.status(400).render('user/register', {errorregistermessage: e});
    }
})


router
.route('/logout')
.get(async(req,res)=>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        req.session.destroy();
        res.render('user/logout');
    }

});

router
.route('/login')
.get(async(req,res)=>{
    if(!req.session.user){
        return res.render('user/login');
    }
    else{
       if(req.session.user.status===0){
           
           return res.redirect('/credit/approved');
        }
        if(req.session.user.status===1){
            return res.redirect('/credit/declined');
        }
       else{
            return res.redirect('/credit/usercredit');
        }
    }
    
})

.post(async(req,res)=>{
    const {loginuser, passworduser} = req.body;
        try{
            const user=await login(loginuser, passworduser);
            const firstname=user.firstname;
            req.session.user = {
                username: user.username,
                firstname : user.firstname,
                status :user.status,
                email:user.email
            }
            
        
        
            if(req.session.user.status===0){
                return res.redirect('/credit/approved');
            }
            if(req.session.user.status===1){
            return res.redirect('/credit/declined');
            }
            else{
                return res.render('credit/usercredit', {firstname: req.session.user.firstname});
            }
        }
        catch(e){
            return res.render('user/login', {errorlogin:e});
        }
    
    
    

})

router.route('/error')
.get(async(req,res)=>{
    return res.redirect('/');
});

router
.route('/contact')
.get(async(req,res)=>{
    return res.render('user/contact');
})

.post(async(req,res)=>{

    let {name, email, message} = req.body;
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.ADMIN_EMAIL,
            pass:process.env.ADMIN_PASSWORD,
        },
    });

    const sendmessage={
        from:process.env.ADMIN_EMAIL,
        to:process.env.SUPPORT_EMAIL,
        subject: `Support Request`,
        text: `Name: ${name} \n\nContact Email: ${email} \n\nMessage: ${message}`
    }
    try{
        await transporter.sendMail(sendmessage);
        res.status(200).send("Message was successfully received.");
    }
    catch(error){
        console.error('Email did not send.', error);
        res.status(500).send("Sent failed.");
    }
    

    
    
})




export default router;
