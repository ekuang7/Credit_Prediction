document.addEventListener('submit', async(event) =>{
    event.preventDefault() //Prevent page from refreshing
    let form = document.getElementById('contact-form');
    let name = document.getElementById('contact-name').value;
    let email = document.getElementById('contact-email').value;
    let message = document.getElementById('contact-content').value;
    let response = document.getElementById('response');
    let title = document.getElementById('contact-head2');
    let checklabel = document.getElementById('check-label');
    let errortitle = document.getElementById('error-head');
    let errorresponse = document.getElementById('error-contact');

    name=name.trim();
    email=email.trim();
    message=message.trim();
    if(name===""){
        errortitle.textContent='Error'
        errortitle.hidden=false;
        errorresponse.hidden=false;
        errorresponse.textContent='You must include your name.';
        return;
    }

    if(email===""){
        errortitle.textContent='Error'
        errortitle.hidden=false;
        errorresponse.hidden=false;
        errorresponse.textContent='You must include your email.';
        return;
    }

    if(message===""){
        errortitle.textContent='Error'
        errortitle.hidden=false;
        errorresponse.hidden=false;
        errorresponse.textContent='You must include a message to send.';
        return;
    }

    if(name.length < 2 || name.length >40){    
        errortitle.textContent='Error'
        errortitle.hidden=false;
        errorresponse.hidden=false;
        errorresponse.textContent='Name must be between 2 to 40 characters long.';
        return;

    }

    //Use this to prevent message spam.
    if(message.length < 10){    
        errortitle.textContent='Error'
        errortitle.hidden=false;
        errorresponse.hidden=false;
        errorresponse.textContent='Message must have at least 10 characters.';
        return;

    }

    if(message.length > 1000){    
        errortitle.textContent='Error'
        errortitle.hidden=false;
        errorresponse.hidden=false;
        errorresponse.textContent='Message must not have more than 1000 character.';
        return;

    }

    if(!validator.isEmail(email)){
        errortitle.textContent='Error'
        errortitle.hidden=false;
        errorresponse.hidden=false;
        errorresponse.textContent='This is not a valid email.';
        return;
        
    }

    if(!document.getElementById('check').checked){
        errortitle.textContent='Error'
        errortitle.hidden=false;
        errorresponse.hidden=false;
        errorresponse.textContent='Please confirm you are not a robot.';
        return;
    }

    try{
        let fetchresponse = await fetch('/user/contact', {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                name:name,
                email:email,
                message: message
            })
        });
        if (fetchresponse.ok) {
            form.hidden=true;
            errortitle.hidden=true;
            errorresponse.hidden=true;
            checklabel.hidden=true;
            check.hidden=true;
            title.textContent = 'Thank you!';
            title.hidden = false;
            response.hidden = false;
            response.textContent = 'Your message has been received. We will response to you within 3-7 business days.';
            form.reset();  // Clear the form
            return;
        } else {
            // Server returned error (400, 500, etc)
            form.hidden=true;
            check.hidden=true;
            checklabel.hidden=true;
            let errorText = await fetchresponse.text();
            title.textContent = 'Error';
            title.hidden = false;
            response.hidden = false;
            response.textContent = 'Failed to send message: ' + errorText;
            return
        }
    } catch (err) {
        // Network error or other fetch issues
        form.hidden=true;
        check.hidden=true;
        checklabel.hidden=true;
        title.textContent = 'Error';
        title.hidden = false;
        response.hidden = false;
        response.textContent = 'Failed to send message: ' + err.message;
        return;
    }
    



    

})
