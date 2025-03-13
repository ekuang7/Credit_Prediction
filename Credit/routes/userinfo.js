import {Router} from 'express';
import axios from 'axios';
import cors from 'cors';
import {update_status} from '../data/user.js';

const router=Router();

router.route('/approved')
.get(async(req,res)=>{
    try{
        if(!req.session.user){
             return res.redirect('/');
        }
        else{
            if(req.session.user.status===0){
                return res.render('credit/approved', {firstname: req.session.user.firstname});
            }
            else if(req.session.user.status===1){
                return res.redirect('/credit/declined');
            }
            else{
                return res.redirect('/credit/usercredit');
            }
        }
    }
    catch{
        return res.render('user/error', {error: '404: Not Found'});
    }
})

router.route('/declined')
.get(async(req,res)=>{
    try{
        if(!req.session.user){
             return res.redirect('/');
        }
        else{
            if(req.session.user.status===1){
                return res.render('credit/declined', {firstname: req.session.user.firstname});
            }
            else if(req.session.user.status===0){
                return res.redirect('/credit/approved');
            }
            else{
                
                return res.redirect('/credit/usercredit');
            }
        }
    }
    catch{
        return res.render('user/error', {error: '404: Not Found'});
    }
})

router.route('/usercredit')
.get(async(req,res)=>{
    try{
        if(!req.session.user){
             return res.redirect('/');
        }

        else{
            if(req.session.user.status===0){
                return res.redirect('/credit/approved');
            }
            else if(req.session.user.status===1){
                return res.redirect('/credit/declined');
            }
            else{

                return res.render('credit/usercredit', {firstname: req.session.user.firstname});
            }
            
        }

    }
    catch{
         return res.render('user/error', {error: '404: Not Found'});
    }

})

.post(async(req,res)=>{
    
    const data=req.body;
    const response = await axios.post('http://localhost:5002/predict', data);
    
    if(response.data.prediction===0){

        const updated = await update_status(req.session.user.username, response.data.prediction);
        req.session.user.status=0;
        return res.redirect('/credit/approved');
    }
    if(response.data.prediction===1){
        req.session.user.status=1;
        const updated = await update_status(req.session.user.username, response.data.prediction);
        return res.redirect('/credit/declined');
        
    }
    else{
        return res.render('user/error', {error: 'Please try again later.'});
    }

})


export default router







