import userRoute from './user.js';
import path from 'path';
import {static as staticDir} from 'express';
import infoRoute from './userinfo.js';

const constructorMethod = (app) => {
    app.use('/user', userRoute);
    app.use('/credit', infoRoute);
    app.get('/',(req,res)=>{
        res.sendFile(path.resolve('static/main.html'));
    });
    app.use('/public', staticDir('public'));
    app.use("*", (req,res)=>{
        res.status(404).render('user/error', {error: 'Not Found.'});
    });
};

export default constructorMethod