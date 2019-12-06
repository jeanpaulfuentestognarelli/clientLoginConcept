// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== 'undefined';
var SideNavOpen = false;

const Llama = ( function( ) {
    const paramsParse = function ( params ) {     
        let output = "";
        let lenght = Object.keys( params ).length;
        let index = 0;
        for( let i in params ) {
            output += i + "=" + params[ i ];
            if( index++ < lenght - 1 ) {
                output += "&";
            }
        }
        return output;
    }

    const post = function( url, params, encodingType ) {
      const FILES = 1, DEFAULT = 0;  
      const Encondings = [
          "application/x-www-form-urlencoded",
          "multipart/form-data",
          "text/plain"
        ];
        let _encondingIndex = 0;
        if( encodingType ) _encondingIndex = encodingType;
        
        // Return a new promise.
        return new Promise( function( resolve, reject ) {
          // Do the usual XHR stuff
          var req = new XMLHttpRequest(  );
          req.open( 'POST', url, true );
    
          // The autorization
          try{
            if( localStorage.getItem( "token" ) ) {                
                let token = JSON.parse( localStorage.getItem( "token" ) ).token;
                req.setRequestHeader('Authorization', token );
            }
          } catch( error) {
            localStorage.clear();
            reject( error )
          }
          
          req.onload = function(  ) {
            // This is called even on 404 etc
            // so check the status
            if ( req.status == 200 ) {
              // Resolve the promise with the response text
              let message  = "";
                try {
                    message = JSON.parse( req.response );
                } catch (error) {
                    message = req.response;
                }
              resolve( message );
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                let message  = "";
                try {
                    message = JSON.parse( req.response );
                } catch (error) {
                    message = req.response;
                }
                reject( { status: req.status, message: Error( message )} );
            }
          };
      
          // Handle network errors
          req.onerror = function(  ) {
            reject( Error( "No es posible conectarse con el servidor, verifique su conexión a internet" ) );
          };
          
          if( _encondingIndex == FILES ) {
            var formData = new FormData();
            for( let i in params ) {
              formData.append( i, params[ i ] );
            }
            req.send( formData );
          } else {
            // Parse the data 
            params = paramsParse( params );
            //Send the proper header information along with the request
            req.setRequestHeader('Content-type', Encondings[ DEFAULT ]);
            // Make the request
            req.send( params );
          }
        } );
    }

    const get = function( url ) {
      // Return a new promise.
      return new Promise( function( resolve, reject ) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest(  );
        req.open( 'GET', url );

        // The autorization
        try{
          if( localStorage.getItem( "token" ) ) {
              let token = JSON.parse( localStorage.getItem( "token" ) ).token;
              req.setRequestHeader('Authorization', token );
          }
        } catch( error) {
          localStorage.clear();
          reject( error )
        }

        req.onload = function(  ) {
          // This is called even on 404 etc
          // so check the status
          if ( req.status == 200 ) {
            // Resolve the promise with the response text
            let message  = "";
                try {
                    message = JSON.parse( req.response );
                } catch (error) {
                    message = req.response;
                }
              resolve( message );
          }
          else {
              // Otherwise reject with the status text
              // which will hopefully be a meaningful error
              let message  = "";
              try {
                  message = JSON.parse( req.response ).message;
              } catch (error) {
                  message = req.response;
              }
              reject( { status: req.status, message: Error( message )} );
          }
        };
    
        // Handle network errors
        req.onerror = function(  ) {
          reject( Error( "No es posible conectarse con el servidor, verifique su conexión a internet" ) );
        };
        
        // Make the request
        req.send( );
      } );
    }
  
    return {
        post: post,
        get: get
    };
} ) ( );

Llama.changePage = function( page ) {
  if( page ) {
    let main = document.getElementsByTagName( "main" ) [ 0 ];
    Llama.get( Llama.pages[ page ].template ).then( ( result ) => {
      // Change the URL
      parent.location.hash = page;
      main.innerHTML =  result; 
      window.scrollTo(0, 0);
      if( Llama.pages[ page ].controller ) {
        Llama.pages[ page ].controller(  );
      }
    } ).catch( ( error ) => {
      main.innerHTML =  error;
    } );
  } 
}

Llama.init = function( pages ) {
    let optionMenus = document.getElementsByClassName( "menu" );
    Llama.pages = pages;
    for( let optionMenu of optionMenus ) {
      optionMenu.addEventListener( "click", function( e ) {
        e.preventDefault();
        let path = optionMenu.getAttribute( "href" );
        Llama.changePage( path );
        closeNav( );
      } );
    }
}

Llama.setDefault = function( page ) {
  Llama.homePage = page;
  let url = parent.location.hasah.split( '#' )[ 1 ];
  if( !url ) {
    Llama.changePage( page );
  } else {
    Llama.changePage( url );
  }
  Llama.reloadMenu();
}

window.onhashchange = function( ) { 
  Llama.setDefault( Llama.homePage );
  closeNav();
  Llama.reloadMenu();
}

Llama.reloadMenu = function() {
  let opts = document.getElementsByClassName( "opt" );
  let url = parent.location.hash.split( '#' )[ 1 ];
  for( let opt of opts ) {
      if( opt.getAttribute( "href" ) == url ) {
          opt.className += " active";
          
      } else {
          opt.className = opt.className.replace( " active", "" );
      }
  }
}

