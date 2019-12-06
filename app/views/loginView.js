function LoginView( controller ) 
{
    const loginForm = document.getElementById( "loginForm" );
    const txtUserName = document.getElementById( "txtUsername" );
    const txtPassword = document.getElementById( "txtPassword" );
    const btnSubmit = document.getElementById( "btnSubmit" );
    const txtMessage = document.getElementById( "txtMessage" );

    // Add the event submit to the button
    loginForm.addEventListener( "submit", function( e ) {
        e.preventDefault();
        
        controller.authenticate( txtUserName.value, txtPassword.value );
        txtPassword.value = "";
        btnSubmit.disabled = true;
 
    } );

    this.receiveResponse = function( message ) 
    {
        txtMessage.innerHTML = message;
        txtMessage.style.display = "block";
        btnSubmit.disabled = false;
    }
}

(function ($) {
    "use strict";
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('fa-eye');
            $(this).find('i').addClass('fa-eye-slash');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').removeClass('fa-eye-slash');
            $(this).find('i').addClass('fa-eye');
            showPass = 0;
        }
        
    });
})(jQuery);