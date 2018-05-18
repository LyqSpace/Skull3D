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

function getStickMesh(stick, scale) {

    var defaultColor = 0x00aabb;
    var highlightColor = 0xff9900;

    var geometry = new THREE.CylinderGeometry(1, 1, stick.len, 16);

    var material = new THREE.MeshPhongMaterial();
    material.side = THREE.DoubleSide;
    if (stick.highlight) {
        material.color = new THREE.Color(highlightColor);
    } else {
        material.color = new THREE.Color(defaultColor);
    }

    var halfLen = stick.len / 2;
    var centerPt = new THREE.Vector3(
        stick.startPt.x + halfLen * stick.vec.x,
        stick.startPt.y + halfLen * stick.vec.y,
        stick.startPt.z + halfLen * stick.vec.z,
    );

    var cylinderMesh = new THREE.Mesh(geometry, material);
    cylinderMesh.setRotationFromAxisAngle(stick.axis, stick.angle);
    cylinderMesh.position.set(centerPt.x, centerPt.y, centerPt.z);
    // console.log(cylinderMesh.position);

    return cylinderMesh;

}

var Skull = function (scale) {

    var object = this;

    object.scale = scale;
    object.bodyState = 0;
    object.sticksState = 0;
    object.faceState = 0;

    object.loadData = function (objName, callback) {

        var xhttp = {};
        var bodyFilePath = "models/" + objName + ".obj";
        var sticksFilePath = "models/" + objName + "_sticks.cm";
        var faceFilePath = "models/" + objName + "_face.obj";

        var manager = new THREE.LoadingManager();
        
        // Load skull body
        var bodyLoader = new THREE.OBJLoader(manager);
        bodyLoader.load(

            bodyFilePath, // resource URL

            function (obj) { // onLoad callback
                object.bodyMesh = obj.children[0];
                object.bodyState = 1;
                callback();
            },

            function (xhr) { // onProgress callback
                var progress = xhr.loaded / xhr.total * 100;
                if (!isNaN(progress)) {
                    console.log("Skull body", progress + "% loaded.");
                }
            },

            function (err) { // onError callback
                console.error("An error happened when loading skull body.", err);
            }

        );

        // Load face
        var faceLoader = new THREE.OBJLoader(manager);
        faceLoader.load(

            faceFilePath,

            function (obj) { // onLoad callback
                object.faceMesh = obj.children[0];
                object.faceState = 1;
                callback();
            },

            function (xhr) { // onProgress callback
                var progress = xhr.loaded / xhr.total * 100;
                if (!isNaN(progress)) {
                    console.log("Face", progress + "% loaded.");
                }
            },

            function (err) { // onError callback
                console.error("An error happened when loading face.", err);
            }

        );

        // Load sticks
        var SticksLoader = new THREE.FileLoader();
        SticksLoader.load(

            sticksFilePath,

            function (data) { // onLoad callback
                object.sticksTxt = data
                object.sticksState = 1;
                callback();
            },

            function (xhr) { // onProgress callback
                var progress = xhr.loaded / xhr.total * 100;
                if (!isNaN(progress)) {
                    console.log("Sticks", progress + "% loaded.");
                }
            },

            function (err) { // onError callback
                console.error("An error happened when loading sticks.", err);
            }

        );


    };

    object.init = function (objName, callback) {

        object.loadData(objName, function () {

            if (object.bodyState == 1) {
                object.bodyState = 2;
            }

            if (object.sticksState == 1) {
                generateSticks();
                object.sticksState = 2;
            }

            if (object.faceState == 1) {
                object.faceState = 2;
            }

            if (object.bodyState == 2 && object.sticksState == 2 && object.faceState == 2) {
                callback();
            }

        });

    };

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
                // console.log(axis, angle);

                var stick = {
                    "startPt": startPt,
                    "vec": vec,
                    "len": len,
                    "axis": axis,
                    "angle": angle,
                    "highlight": false,
                };
                object.sticks.push(stick);

                var stickMesh = getStickMesh(stick, object.scale);
                object.sticksMesh.push(stickMesh);

            }

        }

    }

};