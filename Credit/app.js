import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import {createUser, checkAdmin} from './data/user.js';
dotenv.config();




const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    next();
};

app.use(cookieParser());
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);
app.use(cors({
    origin: /^(http:\/\/localhost:3000)(\/.*)?$/,
    methods: ['GET', 'POST'],
    credentials: true
}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(session({
    name:"AuthState",
    secret: "Secret string!",
    resave: false,
    saveUninitialized: false
}));

let check = await checkAdmin();

//Seeding to create admin account if it doesn't exist.
if(check.exist===false){
    await createUser("admin", process.env.SECRET_PASSWORD, process.env.SECRET_PASSWORD, process.env.ADMIN_EMAIL, "Admin", "Secret");
      
}

configRoutes(app);

app.listen(3000, () => {
    console.log("Now we've got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
