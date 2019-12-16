function LoginController( ) {
    var _loginView;
    var URL = "https://themisds-criminal-server.azurewebsites.net/";
    //var URL = "http://localhost:3000/";

    this.init = function( ) {
        localStorage.clear();
        if( !_loginView ) {
            _loginView = new LoginView( this );
        }
    }

    this.authenticate = function( user, pass ) {
        console.log(user + ", " + pass );
        Llama.post( URL + "authenticate", { username: user, password: pass }, 0 ).then( ( data ) => {
            var message = "Username or password are incorrect";
            if( data.token ) {
                message = "";
                console.log( "token:", data.token );
                var toSave =  {
                    token: data.token
                }
                localStorage.setItem( "token", JSON.stringify( toSave ) );
                window.location.href = "/index.html";
            }
            _loginView.receiveResponse( message );
            console.log( data );
        } ).catch( ( error ) => {
            _loginView.receiveResponse( "Error:" + error );
            console.error( "error:", error );  
        });
    }
}