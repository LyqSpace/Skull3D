function getRotationAxis(vec) {

    //Three.js uses a Y up coordinate system, so the cube inits with this vector
    var upAxis = new THREE.Vector3(0, 1, 0);

    //cross product of the up vector and direction vector
    var axis = new THREE.Vector3();
    axis.crossVectors(upAxis, vec);
    axis.normalize();

    return axis;

}

function getRotationAngle(vec) {

    //Three.js uses a Y up coordinate system, so the cube inits with this vector
    var upAxis = new THREE.Vector3(0, 1, 0);

    //euler angle between direction vector and up vector
    var angle = Math.acos(upAxis.dot(vec));

    return angle;

}

function getStickMesh(stick, scale, color=0x00aabb) {

    var geometry = new THREE.CylinderGeometry(1, 1, stick.len, 16);

    var material = new THREE.MeshPhongMaterial();
    material.side = THREE.DoubleSide;
    material.color = new THREE.Color(color);

    var halfLen = stick.len / 2;
    var centerPt = new THREE.Vector3(
        stick.startPt.x + halfLen * stick.vec.x,
        stick.startPt.y + halfLen * stick.vec.y + scale,
        stick.startPt.z + halfLen * stick.vec.z,
    );

    var cylinderMesh = new THREE.Mesh(geometry, material);
    cylinderMesh.setRotationFromAxisAngle(stick.axis, stick.angle);
    cylinderMesh.position.set(centerPt.x, centerPt.y, centerPt.z);
    console.log(cylinderMesh.position);
    
    return cylinderMesh;

}

var Skull = function (scale) {

    var object = this;

    object.scale = scale;
    object.bodyState = 0;
    object.sticksState = 0;

    object.loadData = function (fileName, callback) {

        var xhttp = {};
        var bodyFilePath = "data/" + fileName + ".obj";
        var sticksFilePath = "data/" + fileName + "_sticks.cm";

        loadXMLDoc(bodyFilePath, "body", function () {

            if (xhttp["body"].readyState != 4) return;

            object.bodyTxt = xhttp["body"].response;
            object.bodyState = 1;
            callback();

        });

        loadXMLDoc(sticksFilePath, "sticks", function () {

            if (xhttp["sticks"].readyState != 4) return;

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

    object.init = function (fileName, callback) {

        object.loadData(fileName, function () {

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

        arr.forEach(function (tupleTxt) {

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

        var geometry = new THREE.Geometry();
        geometry.vertices = vertices;
        geometry.faces = faces;
        geometry.computeFaceNormals();

        var material = new THREE.MeshLambertMaterial();
        material.side = THREE.DoubleSide;
        material.color = new THREE.Color(0xddcccc);

        object.bodyMesh = new THREE.Mesh(geometry, material);

    }

    function generateSticks() {

        var arr = object.sticksTxt.split("\n");
        object.sticksMesh = [];
        object.sticks = [];

        for (var i = 0; i < arr.length; i += 2) {

            var tuple0 = arr[i].split(" ");
            var tuple1 = arr[i + 1].split(" ");

            if (tuple0[0] == "Vertex" && tuple1[0] == "Vertex") {

                for (var j = 2; j < 5; j++) tuple0[j] = parseFloat(tuple0[j]);
                for (var j = 2; j < 5; j++) tuple1[j] = parseFloat(tuple1[j]);

                var startPt = new THREE.Vector3(tuple0[2], tuple0[3], tuple0[4]);
                var vec = new THREE.Vector3(tuple1[2] - tuple0[2], tuple1[3] - tuple0[3], tuple1[4] - tuple0[4]);
                var len = vec.length();
                vec.normalize();

                var axis = getRotationAxis(vec);
                var angle = getRotationAngle(vec);
                console.log(axis, angle);
                
                var stick = {
                    'startPt': startPt,
                    'vec': vec,
                    'len': len,
                    'axis': axis,
                    'angle': angle
                };
                object.sticks.push(stick);
                
                var stickMesh = getStickMesh(stick, object.scale);
                object.sticksMesh.push(stickMesh);

            }

        }

    }

};