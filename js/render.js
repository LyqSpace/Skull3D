var uploadedData = {};
var uploadedDataName = {};
var defaultDataName = "european";

var scale = 120;
var camera, controls, scene, renderer, stats, animationId;
var skull;

$(document).ready(function () {

    if (!Detector.webgl) Detector.addGetWebGLMessage();

});

// functions
function uploadData() {

    var bodyFile = $("#body-file")[0].files[0];
    var faceFile = $("#face-file")[0].files[0];
    var sticksFile = $("#sticks-file")[0].files[0];

    if (bodyFile == undefined || faceFile == undefined || sticksFile == undefined) {
        console.log("[ERR]", bodyFile, faceFile, sticksFile, "can't be undefined.");
        return;
    }

    var pos = bodyFile.name.indexOf(".");
    uploadedDataName["body"] = bodyFile.name.substr(0, pos);
    var pos = faceFile.name.indexOf(".");
    uploadedDataName["face"] = faceFile.name.substr(0, pos);
    var pos = sticksFile.name.indexOf(".");
    uploadedDataName["sticks"] = sticksFile.name.substr(0, pos);

    skull = new Skull();

    clearScene();
    console.log("[INFO] Load data from client.", uploadedDataName);

    readFileFromClient(bodyFile, "body", uploadedData, getMesh);
    readFileFromClient(faceFile, "face", uploadedData, getMesh);
    readFileFromClient(sticksFile, "sticks", uploadedData, getMesh);

    $('#upload-data-modal').modal('hide');

}

function useDefaultData() {

    uploadedDataName["body"] = defaultDataName;
    uploadedDataName["face"] = defaultDataName;
    uploadedDataName["sticks"] = defaultDataName;

    skull = new Skull();

    clearScene();
    console.log("[INFO] Load data from server.", uploadedDataName);
    
    readFileFromServer(defaultDataName, "body", uploadedData, getMesh);
    readFileFromServer(defaultDataName, "face", uploadedData, getMesh);
    readFileFromServer(defaultDataName, "sticks", uploadedData, getMesh);

    $('#upload-data-modal').modal('hide');

}

function getMesh() {

    if (uploadedData.body && uploadedData.body.state == 1) {
        skull.initBody(uploadedData.body);
    }

    if (uploadedData.face && uploadedData.face.state == 1) {
        skull.initFace(uploadedData.face);
    }

    if (uploadedData.sticks && uploadedData.sticks.state == 1) {
        skull.initSticks(uploadedData.sticks);
    }

    var countState = 0;
    for (index in uploadedData) {
        if (uploadedData[index].state == 2) countState++;
    }

    if (countState == 3) {

        for (index in uploadedData) {
            uploadedData[index].state = 3;
        }
        
        initScene();
        animate();

        initControls();
        console.log("[INFO] Init controls done.");

    }

}

function clearScene() {

    $("#scene").remove();
    $("#stats").remove();
    cancelAnimationFrame(animationId);

    console.log(" ");
    console.log("[INFO] Clear scene.");

    $("#save-sticks")[0].disabled = true;
    $("#stick-index")[0].disabled = true;
    $("#stick-length-range")[0].disabled = true;
    $("#stick-length-input")[0].disabled = true;

    $("#face-opacity-range")[0].disabled = true;
    $("#face-opacity-input")[0].disabled = true;
    $("#body-opacity-range")[0].disabled = true;
    $("#body-opacity-input")[0].disabled = true;
    $("#sticks-opacity-range")[0].disabled = true;
    $("#sticks-opacity-input")[0].disabled = true;

    $("#set-camera-position")[0].disabled = true;

    console.log("[INFO] Disabled components.");

}

function initScene() {

    var canvas = $("#scene-container")[0];

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x111111);
    renderer.domElement.id = "scene";
    canvas.append(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.01, 4000);
    camera.position.set(-scale * 3, -scale, 0);

    scene = new THREE.Scene();

    // axes helper
    // axes = new THREE.AxesHelper(scale * 2)
    // scene.add(axes);

    // light
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    var spotLight0 = new THREE.SpotLight(0xffffff, 0.5);
    spotLight0.position.set(scale * 2, -scale, scale * 2);
    spotLight0.angle = Math.PI / 4;
    scene.add(spotLight0);

    var spotLight1 = new THREE.SpotLight(0xffffff, 0.5);
    spotLight1.position.set(-scale * 2, -scale, -scale * 2);
    spotLight1.angle = Math.PI / 4;
    scene.add(spotLight1);

    var spotLight2 = new THREE.SpotLight(0xffffff, 0.5);
    spotLight2.position.set(-scale * 2, -scale, scale * 2);
    spotLight2.angle = Math.PI / 4;
    scene.add(spotLight2);

    var spotLight3 = new THREE.SpotLight(0xffffff, 0.5);
    spotLight3.position.set(scale * 2, -scale, -scale * 2);
    spotLight3.angle = Math.PI / 4;
    scene.add(spotLight3);

    // light helper
    // lightHelper0 = new THREE.SpotLightHelper( spotLight0 );
    // scene.add( lightHelper0 );

    // lightHelper1 = new THREE.SpotLightHelper( spotLight1 );
    // scene.add( lightHelper1 );

    // controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.maxDistance = scale * 8;
    controls.target.set(0, -scale, 0);
    // controls.update();

    // skull
    scene.add(skull.bodyMesh);
    scene.add(skull.faceMesh);
    for (var i = 0; i < skull.sticksMesh.length; i++) {
        scene.add(skull.sticksMesh[i]);
    }
    console.log("[INFO] Add skull elements done.");

    // stats
    stats = new Stats();
    stats.domElement.id = "stats";
    stats.domElement.style.zIndex = 100;
    $("#stats-container")[0].prepend(stats.domElement);

}

function onWindowResize() {

    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

}

function animate() {

    animationId = requestAnimationFrame(animate);

    $("#camera-x").html(Math.floor(camera.position.x * 10) / 10);
    $("#camera-y").html(Math.floor(camera.position.y * 10) / 10);
    $("#camera-z").html(Math.floor(camera.position.z * 10) / 10);
    
    controls.update();
    stats.update();
    renderer.render(scene, camera);

}

function initControls() {

    var stickIndex = 0;

    var stickIndexObj = $("#stick-index")[0];
    stickIndexObj.disabled = false;
    for (var i = 0; i < skull.sticks.length; i++) {
        var optionObj = $("<option value=\"" + i.toString() + "\">" + i.toString() + "</option>")[0];
        stickIndexObj.append(optionObj);
    }
    stickIndexObj.value = 0;

    // Init stick length
    var stickLengthRangeObj = $("#stick-length-range")[0];
    stickLengthRangeObj.disabled = false;
    stickLengthRangeObj.value = skull.sticks[stickIndex].len;

    var stickLengthInputObj = $("#stick-length-input")[0];
    stickLengthInputObj.disabled = false;
    stickLengthInputObj.value = skull.sticks[stickIndex].len;

    skull.sticks[stickIndex].highlight = true;
    updateStickMesh(stickIndex);

    // Save sticks
    $("#save-sticks")[0].disabled = false;

    // Camera
    $("#set-camera-position")[0].disabled = false;

    // Init face opacity
    var faceOpacityRangeObj = $("#face-opacity-range")[0];
    faceOpacityRangeObj.disabled = false;
    faceOpacityRangeObj.value = skull.faceOpacity;

    var faceOpacityInputObj = $("#face-opacity-input")[0];
    faceOpacityInputObj.disabled = false;
    faceOpacityInputObj.value = skull.faceOpacity;

    // Init body opacity
    var bodyOpacityRangeObj = $("#body-opacity-range")[0];
    bodyOpacityRangeObj.disabled = false;
    bodyOpacityRangeObj.value = skull.bodyOpacity;

    var bodyOpacityInputObj = $("#body-opacity-input")[0];
    bodyOpacityInputObj.disabled = false;
    bodyOpacityInputObj.value = skull.bodyOpacity;

    // Init sticks opacity
    var sticksOpacityRangeObj = $("#sticks-opacity-range")[0];
    sticksOpacityRangeObj.disabled = false;
    sticksOpacityRangeObj.value = skull.sticksOpacity;

    var sticksOpacityInputObj = $("#sticks-opacity-input")[0];
    sticksOpacityInputObj.disabled = false;
    sticksOpacityInputObj.value = skull.sticksOpacity;

}

function changeStickIndex() {

    var stickIndex = $("#stick-index")[0].value;
    var stickLengthRangeObj = $("#stick-length-range")[0];
    var stickLengthInputObj = $("#stick-length-input")[0];

    console.log("Select stick ", stickIndex, ", Stick length ", skull.sticks[stickIndex].len);
    stickLengthRangeObj.value = skull.sticks[stickIndex].len;
    stickLengthInputObj.value = skull.sticks[stickIndex].len;

    for (var i = 0; i < skull.sticks.length; i++) {

        if (i == stickIndex) {
            skull.sticks[stickIndex].highlight = true;
            updateStickMesh(stickIndex);
        } else {
            if (skull.sticks[i].highlight == true) {
                skull.sticks[i].highlight = false;
                updateStickMesh(i);
            }
        }

    }

}

function setCameraPosition() {

    var x = $("#set-camera-x")[0].value;
    var y = $("#set-camera-y")[0].value;
    var z = $("#set-camera-z")[0].value;

    camera.position.set(x, y, z);

}

// Change Stick Length
function updateStickMesh(stickIndex) {

    var newStickMesh = getStickMesh(skull.sticks[stickIndex], skull.sticksOpacity);
    scene.remove(skull.sticksMesh[stickIndex]);
    skull.sticksMesh[stickIndex].geometry.dispose();
    skull.sticksMesh[stickIndex].material.dispose();

    skull.sticksMesh[stickIndex] = newStickMesh;
    scene.add(skull.sticksMesh[stickIndex]);

}

function changeStickLengthByRange() {

    var stickIndex = $("#stick-index")[0].value;
    var stickLength = $("#stick-length-range")[0].value;
    var stickLengthInputObj = $("#stick-length-input")[0];

    console.log("Change stick by range ", stickIndex, ", length to ", stickLength);
    stickLengthInputObj.value = stickLength;

    skull.sticks[stickIndex].len = stickLength;
    updateStickMesh(stickIndex);

}

function changeStickLengthByInput() {

    var stickIndex = $("#stick-index")[0].value;
    var stickLength = $("#stick-length-input")[0].value;
    var stickLengthInputObj = $("#stick-length-input")[0];
    var stickLengthRangeObj = $("#stick-length-range")[0];
    var updateStickLength = false;

    if (stickLength.length == 0 || isNaN(stickLength)) {
        console.log("Change stick by input ", stickLength, " not a number");
        return;
    } else {
        stickLength = parseFloat(stickLength);
        if (stickLength > 30 || stickLength < 0) {
            updateStickLength = true;
        }
        stickLength = Math.min(30, stickLength);
        stickLength = Math.max(0, stickLength);
    }

    console.log("Change stick by input ", stickIndex, ", length to ", stickLength);

    if (updateStickLength) {
        stickLengthInputObj.value = stickLength;
    }
    stickLengthRangeObj.value = stickLength;

    skull.sticks[stickIndex].len = stickLength;
    updateStickMesh(stickIndex);

}

// Change Face Opacity
function changeFaceOpacityByRange() {

    var opacity = $("#face-opacity-range")[0].value;
    var faceOpacityInputObj = $("#face-opacity-input")[0];

    console.log("Change face opacity by range to ", opacity);
    faceOpacityInputObj.value = opacity;

    skull.faceOpacity = opacity;
    skull.faceMesh.material.opacity = opacity;

}

function changeFaceOpacityByInput() {

    var opacity = $("#face-opacity-input")[0].value;
    var faceOpacityInputObj = $("#face-opacity-input")[0];
    var faceOpacityRangeObj = $("#face-opacity-range")[0];
    var updateOpacity = false;

    if (opacity.length == 0 || isNaN(opacity)) {
        console.log("Change face opacity by input ", opacity, " not a number");
        return 0;
    } else {
        opacity = parseFloat(opacity);
        if (opacity > 1 || opacity < 0) {
            updateOpacity = true;
        }
        opacity = Math.min(1, opacity);
        opacity = Math.max(0, opacity);
    }

    console.log("Change face opacity by input to ", opacity);

    if (updateOpacity) {
        faceOpacityInputObj.value = opacity;
    }
    faceOpacityRangeObj.value = opacity;

    skull.faceOpacity = opacity;
    skull.faceMesh.material.opacity = opacity;

}

// Change body Opacity
function changeBodyOpacityByRange() {

    var opacity = $("#body-opacity-range")[0].value;
    var bodyOpacityInputObj = $("#body-opacity-input")[0];

    console.log("Change body opacity by range to ", opacity);
    bodyOpacityInputObj.value = opacity;

    skull.bodyOpacity = opacity;
    skull.bodyMesh.material.opacity = opacity;

}

function changeBodyOpacityByInput() {

    var opacity = $("#body-opacity-input")[0].value;
    var bodyOpacityInputObj = $("#body-opacity-input")[0];
    var bodyOpacityRangeObj = $("#body-opacity-range")[0];
    var updateOpacity = false;

    if (opacity.length == 0 || isNaN(opacity)) {
        console.log("Change body opacity by input ", opacity, " not a number");
        opacity = 0;
    } else {
        opacity = parseFloat(opacity);
        if (opacity > 1 || opacity < 0) {
            updateOpacity = true;
        }
        opacity = Math.min(1, opacity);
        opacity = Math.max(0, opacity);
    }

    console.log("Change body opacity by input to ", opacity);

    if (updateOpacity) {
        bodyOpacityInputObj.value = opacity;
    }
    bodyOpacityRangeObj.value = opacity;

    skull.bodyOpacity = opacity;
    skull.bodyMesh.material.opacity = opacity;

}

// Change sticks Opacity
function changeSticksOpacityByRange() {

    var opacity = $("#sticks-opacity-range")[0].value;
    var sticksOpacityInputObj = $("#sticks-opacity-input")[0];

    console.log("Change sticks opacity by range to ", opacity);
    sticksOpacityInputObj.value = opacity;

    skull.sticksOpacity = opacity;
    for (var i = 0; i < skull.sticks.length; i++) {
        updateStickMesh(i);
    }

}

function changeSticksOpacityByInput() {

    var opacity = $("#sticks-opacity-input")[0].value;
    var sticksOpacityInputObj = $("#sticks-opacity-input")[0];
    var sticksOpacityRangeObj = $("#sticks-opacity-range")[0];
    var updateOpacity = false;

    if (opacity.length == 0 || isNaN(opacity)) {
        console.log("Change sticks opacity by input ", opacity, " not a number");
        opacity = 0;
    } else {
        opacity = parseFloat(opacity);
        if (opacity > 1 || opacity < 0) {
            updateOpacity = true;
        }
        opacity = Math.min(1, opacity);
        opacity = Math.max(0, opacity);
    }

    console.log("Change sticks opacity by input to ", opacity);

    if (updateOpacity) {
        sticksOpacityInputObj.value = opacity;
    }
    sticksOpacityRangeObj.value = opacity;

    skull.sticksOpacity = opacity;
    for (var i = 0; i < skull.sticks.length; i++) {
        updateStickMesh(i);
    }

}