import bcrypt from 'bcrypt';
import {ObjectId} from 'mongodb';
import {user} from '../config/mongoCollections.js';
import validator from 'validator';

export const createUser = async(
    username,
    password,
    confirmpassword,
    email,
    firstname,
    lastname
) =>{

    if(username===undefined){
        throw 'You must enter a user name.';
    }
    
    if(password===undefined){
        throw 'You must enter a password.';
    }

    if(email===undefined){
        throw 'You must enter an email.';
    }

    if(firstname===undefined){
        throw 'You must enter a first name.';
    }

    if(lastname===undefined){
        throw 'You must enter a last name.';
    }

    if(confirmpassword===undefined){
        throw 'Please confirm your password.';
    }

    if(typeof(username)!='string'){
        throw 'Username is not a string type.';
    }

    if(typeof(password)!='string'){
        throw 'Password is not a string type.';
    }

    if(typeof(confirmpassword)!='string'){
        throw 'Confirm password is not a string type.';
    }

    if(typeof(email)!='string'){
        throw 'Email is not a string type.';
    }

    if(typeof(firstname)!='string'){
        throw 'First name is not a string type.';
    }

    if(typeof(lastname)!='string'){
        throw 'Last name is not a string type.';
    }

    username=username.trim();
    email=email.trim();
    firstname=firstname.trim();
    lastname=lastname.trim();

    if(username.length < 5 || username.length > 15){
        throw 'User name must be at least 5 characters and no more than 15.';

    }

    if(email.length === 0){
        throw 'You must provide an email.';
    }

    if(password.length < 5){
        throw 'Password length must be at least 5 characters long.';
    }

    if(firstname.length ===0){
        throw 'First name is empty.';
    }

    if(lastname.length===0){
        throw 'Last name is empty.';
    }

    if(!validator.isEmail(email)){
        throw 'This is not a valid email.';
    }

    if(password !== confirmpassword){
        throw 'Passwords do not match.';
    }

    const passcheck1 = /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>?]/;

    if(!passcheck1.test(password)){
        throw 'Password must contain a special character.';
    }

    const passcheck2 = /[a-z]/;

    if(!passcheck2.test(password)){
        throw 'Password must have a lowercase.';
    }

    const passcheck3 = /[A-Z]/;

    if(!passcheck3.test(password)){
        throw 'Password must have an uppercase.';

    }

    const passcheck4 = /[0-9]/;

    if(!passcheck4.test(password)){
        throw 'Password must have a number.';
    }


    const hashpassword = await bcrypt.hash(password, 10);

    const userCollection = await user();

    const status = "";

    let newuser={
        "username": username,
        "password": hashpassword,
        "email": email,
        "firstname": firstname,
        "lastname": lastname,
        "status": status
    }

    let email2 = await userCollection.findOne({"email": email});

    if(email2){
        throw 'That email is already used by another user. Please use another one.';
    }

    username=username.toLowerCase();
    email=email.toLowerCase();

    let username2 = await userCollection.findOne({"username": username});

    if(username2){
        throw 'That username is already taken.';
    }

    let inserteduser = await userCollection.insertOne(newuser);

    if(!inserteduser.acknowledged){
        throw 'Could not add user.';
    }

    return true;

    

    


};

//new function
export const update_status = async(
    username,
    stat
)=>{
    if(username === undefined){
        throw 'You must enter a user name.';
    }
    if(typeof(username)!='string'){
        throw 'User name must be a string.';
    }

    username=username.trim();
    username=username.toLowerCase();

    if(username.length===0){
        throw 'You need to enter a user name.';
    }

    if (typeof(stat)!='number'){
        throw 'Status not a number.'
    }

    const userCollection = await user();

    const founduser = await userCollection.findOne({"username":username});

    if(!founduser){
        throw 'No user found.';
    }

    const updated = await userCollection.updateOne({"username":username}, {$set:{"status":Number(stat)}});

    if(!updated.modifiedCount===0){
        throw 'Did not update.';
    }

   

    return {username: founduser.username, firstname: founduser.firstname, status: Number(founduser.status)};

}

export const login = async(
    username,
    password
) => {

    if(username === undefined){
        throw 'You must enter a user name.1';
    }

    if(password===undefined){
        throw 'Please enter a password.';
    }

    if(typeof(username)!='string'){
        throw 'User name must be a string.';
    }

    if(typeof(password)!='string'){
        throw 'Password must be a string.';
    }
    

    username=username.trim();
    username=username.toLowerCase();

    if(username.length===0){
        throw 'You need to enter a user name.';
    }

    if(password.length===0){
        throw 'Please enter a password.';
    }

    const userCollection = await user();
    
    const founduser = await userCollection.findOne({"username":username});
    
    if(!founduser){
        throw 'No user with that username.';
    }

    const match = await bcrypt.compare(password, founduser.password);
    
    if(!match){
        throw 'Log in credentials is invalid.';
    }

    return {username: founduser.username, firstname: founduser.firstname, status: founduser.status};

}