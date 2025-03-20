import bcrypt from 'bcrypt';
import {ObjectId} from 'mongodb';
import {user} from '../config/mongoCollections.js';
import validator from 'validator';


//Create user function
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

    //Make sure username is between 5 to 15 characters.
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

    //Making sure password has a special character.
    const passcheck1 = /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>?]/;

    if(!passcheck1.test(password)){
        throw 'Password must contain a special character.';
    }

    //Making sure password has a lowecase.
    const passcheck2 = /[a-z]/;

    if(!passcheck2.test(password)){
        throw 'Password must have a lowercase.';
    }

    //Make sure the password has an uppercase.
    const passcheck3 = /[A-Z]/;

    if(!passcheck3.test(password)){
        throw 'Password must have an uppercase.';

    }

    //Make sure password has a number.
    const passcheck4 = /[0-9]/;

    if(!passcheck4.test(password)){
        throw 'Password must have a number.';
    }

    //Using bcrypt to has the password.
    const hashpassword = await bcrypt.hash(password, 10);

    const userCollection = await user();

    const status = "";

    const income=null;

    //Income and status initially empty/null. Will be input by user.
    let newuser={
        "username": username,
        "password": hashpassword,
        "email": email,
        "firstname": firstname,
        "lastname": lastname,
        "status": status,
        "income": income
    }

    //Making sure the email being stored is not already in use.
    let email2 = await userCollection.findOne({"email": email});

    if(email2){
        throw 'That email is already used by another user. Please use another one.';
    }

    username=username.toLowerCase();
    email=email.toLowerCase();

    //Making sure username is not in used by another user.
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


//Update approval status and income.
export const update_status = async(
    username,
    stat,
    income
)=>{
    if(username === undefined){
        throw 'You must enter a user name.';
    }

    if(stat===undefined){
        throw 'A status is needed.';
    }

    if(income===undefined){
        throw 'Income must be provided,';
    }
    if(typeof(income)!='number'){
        throw 'Income must be a number.';
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

    const updated = await userCollection.updateOne({"username":username}, {$set:{"status":Number(stat), "income":Number(income)}});
    

    if(!updated.modifiedCount===0){
        throw 'Did not update.';
    }

   

    return {username: founduser.username, firstname: founduser.firstname, status: Number(founduser.status), income:Number(founduser.income)};

}


//Login functiton
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

    //Bcrypt to compared the hashed password with the input one.
    const match = await bcrypt.compare(password, founduser.password);
    
    if(!match){
        throw 'Log in credentials is invalid.';
    }

    return {username: founduser.username, firstname: founduser.firstname, status: founduser.status, income:founduser.income};

}

//Get approval income and denied income and status data.
export const getAll = async()=>{
    const userCollection = await user();
    const data = await userCollection.find().toArray();
    const all = data.map((x)=>x.status);
    const approved = await userCollection.find({"status": 0}, {projection:{"income":1}}).toArray();
    const approved2= approved.map((x)=>x.income);
    const denied = await userCollection.find({"status":1}, {projection:{"income":1}}).toArray();
    const denied2 = denied.map((x)=>x.income);

    return {data:all, approved:approved2, denied:denied2};
}

//Helper function to calculate average income.
export const average = async(arr)=>{
    
    if(arr===undefined){
        throw 'Need input.';
    }
    
    if(!Array.isArray(arr)){
        throw 'Input must be an array.';
    }

    let sum=0;
    let total=arr.length;

    if(arr.length===0){
        return {mean:0};
    }

    for(let i = 0; i<arr.length; i++){
        if(typeof(arr[i])!=='number'){
            throw 'A value is not a number.';
        }
        else{
            sum=sum+arr[i];
        }
    }

    let mean = sum/total;
    let mean2 = mean.toFixed(2);
    let mean3 = Number(mean2);
    return{mean:mean3};
}

//Helper function to get the median of income.
export const median = async(arr)=>{
    if(arr===undefined){
        throw 'Need input.';
    }
    
    if(!Array.isArray(arr)){
        throw 'Input must be an array.';
    }

    for(let i = 0; i<arr.length; i++){
        if(typeof(arr[i])!=='number'){
            throw 'A value is not a number.';
        }
    }

    if(arr.length===0){
        return{median:0};
    }

    let arr2 = arr.slice().sort((a, b) => a - b);
    if(arr2.length%2!==0){
        let index = Math.floor(arr2.length/2);
        return {median:arr2[index]};
    }

    if(arr2.length%2===0){
        let index1 = (arr2.length/2)-1;
        let index2 = (arr2.length/2);
        let value = ((arr2[index2]+arr2[index1])/2)
        let median = Number(value.toFixed(2));
        return {median:median};
        
    }


}
