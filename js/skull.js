var Skull = function(scale) {
    
    var object = this;

    object.scale = scale;

    object.loadData = function(fileName, callback) {
        
        var xhttp;
        var filePath = "data/" + fileName + "_sticks.cm";

        loadXMLDoc( filePath, function () {
            
            if ( xhttp.readyState != 4 )
                return;

            var txt = xhttp.response;
            console.log(txt);
            
            // while (!doc.atEndOfStream) {
                // console.log(doc.readLine());
            // }

            // doc.close();

        });

        callback();

        function loadXMLDoc(filePath, callback) {

            if (window.XMLHttpRequest) {
                
                xhttp = new XMLHttpRequest();
        
            } else {// code for IE5 and IE6
                
                xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        
            }
        
            xhttp.onreadystatechange = callback;
            xhttp.overrideMimeType("text/plain; charset=utf-8");
            xhttp.open("GET", filePath, true);
            xhttp.send();

        }

    };

    object.init = function(fileName, callback) {
        
        object.loadData(fileName, function() {
            
            generateElements();
            callback();

        });

    };

    function generateElements() {

    }

};