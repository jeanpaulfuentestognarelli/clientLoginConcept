function HomeView( controller ) {
    var content = null;
    var main = document.getElementById( "main" ); 
    var style = document.createElement( "link" );
    style.rel = "stylesheet";
    style.href = "css/ditto.css";

    controller.verifySecurity();

    this.showContent = function( ) {
        if( content == null ) {
            Llama.get( "app/templates/ditto.html" ).then( ( data ) => {                
                document.head.appendChild( style );
                content = data;
                main.innerHTML = content;
            } )
        } else {
            main.innerHTML = content;s
        }
    }
}