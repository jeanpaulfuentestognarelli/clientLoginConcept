function HomeController() {
    var _homeView;
    var URL = "http:///localhost:3000/";

    this.init = function() {
        _homeView = new HomeView( this );
    }

    this.verifySecurity = function() {
        Llama.get( URL ).then( ( data ) => { 
            if( !data.message ) {
                console.log( "No message: ", data );
                window.location.href = "/login.html";
            } else {               
                _homeView.showContent();
            }
        } ).catch( ( error ) => {
            console.error( error );
            window.location.href = "/login.html";
        } );
    }
}