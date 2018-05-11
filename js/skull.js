var Skull = function(scale) {
    
    var object = this;

    object.scale = scale;
    object.bodyState = 0;
    object.sticksState = 0;

    object.loadData = function(fileName, callback) {
        
        var xhttp = {};
        var bodyFilePath = "data/" + fileName + ".obj";
        var sticksFilePath = "data/" + fileName + "_sticks.cm";

        loadXMLDoc( bodyFilePath, "body", function () {
            
            if ( xhttp["body"].readyState != 4 ) return;
            
            object.bodyTxt = xhttp["body"].response;
            object.bodyState = 1;
            callback();

        });

        loadXMLDoc( sticksFilePath, "sticks", function () {
            
            if ( xhttp["sticks"].readyState != 4 ) return;
            
            object.sticksTxt = xhttp["sticks"].response;
            object.sticksState = 1;
            callback();

        });

        function loadXMLDoc(filePath, name, callback) {

            if (window.XMLHttpRequest) {
                
                xhttp[name] = new XMLHttpRequest();
        
            } else {// code for IE5 and IE6
                
                xhttp[name] = new ActiveXObject("Microsoft.XMLHTTP");
        
            }
        
            xhttp[name].onreadystatechange = callback;
            xhttp[name].overrideMimeType("text/plain; charset=utf-8");
            xhttp[name].open("GET", filePath, true);
            xhttp[name].send();

        }

    };

    object.init = function(fileName, callback) {
        
        object.loadData(fileName, function() {
            
            if (object.bodyState == 1) {
                generateBody();
                object.bodyState = 2;
            }

            if (object.sticksState == 1) {
                generateSticks();
                object.sticksState = 2;
            }

            if (object.bodyState == 2 && object.sticksState == 2) {
                callback();
            }

        });

    };

    function generateBody() {
        
        var arr = object.bodyTxt.split("\n");
        var vertices = [];
        var faces = [];

        arr.forEach(function(tupleTxt) {
            
            var tuple = tupleTxt.split(" ");
            
            if (tuple[0] == "v") {
                for (var i = 1; i < 4; i++) tuple[i] = parseFloat(tuple[i]);
                vertices.push(new THREE.Vector3(tuple[1], tuple[2] + object.scale, tuple[3]));
            }

            if (tuple[0] == "f") {
                for (var i = 1; i < 4; i++) tuple[i] = parseInt(tuple[i]) - 1;
                faces.push(new THREE.Face3(tuple[1], tuple[2], tuple[3]));
            }

        });

        console.log(vertices);

        var geometry = new THREE.Geometry();
        geometry.vertices = vertices;
        geometry.faces = faces;
        geometry.computeFaceNormals();

        var material = new THREE.MeshLambertMaterial();
        material.side = THREE.DoubleSide;
        material.color = new THREE.Color(0xddcccc);

        object.bodyMesh = new THREE.Mesh( geometry, material );

    }

    function generateSticks() {
        
        var vertices = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 100, 0),
            new THREE.Vector3(100, 0, 0),
            new THREE.Vector3(0, 0, 100),
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(0, 1, 3),
            new THREE.Face3(0, 2, 3),
            new THREE.Face3(1, 2, 3),
        ];

        var geometry = new THREE.Geometry();
        geometry.vertices = vertices;
        geometry.faces = faces;
        geometry.computeFaceNormals();

        // var geometry = new THREE.BoxGeometry( 30, 10, 20 );

        var material = new THREE.MeshPhongMaterial();
        material.side = THREE.DoubleSide;
        material.color = new THREE.Color(0xaabb00);
        

        object.sticksMesh = new THREE.Mesh( geometry, material );

    }

};