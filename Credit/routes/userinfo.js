import {Router} from 'express';
import axios from 'axios';
import cors from 'cors';
import {update_status, getAll, average, median} from '../data/user.js';

const router=Router();

//Approved route to render page if approved.
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

//Denied route render declined page if denied.
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

//Usercredit route to render usercredit page.
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
    
    const data=req.body;   //Get input data from frontend
    const income = Number(req.body.monthly_income);
    const response = await axios.post('http://localhost:5002/predict', data); //Send data to flask /predict /route/endpoint.
    
    if(response.data.prediction===0){

        const updated = await update_status(req.session.user.username, response.data.prediction, income);  //Call update_status to update user approval status predicted from model from flask and their income inputted.
        req.session.user.status=0;
        return res.redirect('/credit/approved');
    }
    if(response.data.prediction===1){
        req.session.user.status=1;
        const updated = await update_status(req.session.user.username, response.data.prediction, income);
        return res.redirect('/credit/declined');
        
    }
    else{
        return res.render('user/error', {error: 'Please try again later.'});
    }

})

//Info route to display visualization and summary statistics of applicants.
router.route('/info')
.get(async(req,res)=>{
    const information = await getAll();
    
    const total_approved = information.approved.length;
    const mean_approved = await average(information.approved);
    const mean_denied = await average(information.denied);
    const median_approved = await median(information.approved);
    const median_denied = await median(information.denied);
    
    
    const total_denied = information.denied.length;
    const total=total_approved+total_denied;
    const data = {"data":information.data};
    const approved = {"approved": information.approved};
    const denied = {"denied":information.denied};
    const respond = await axios.post('http://localhost:5002/visualize', {"data":data, "approved":approved, "denied":denied});
    
    res.render('credit/info', {total: total, approved:total_approved, denied:total_denied , approved_avg:mean_approved.mean, denied_avg: mean_denied.mean, approved_med: median_approved.median, denied_med: median_denied.median});
})


export default router







