var dataName;
var faceDataNameArr = ["european"];
var bodyDataNameArr = ["european", "african"];
var sticksDataNameArr = ["european", "african"];

var scale = 120;
var camera, controls, scene, renderer, stats;
var skull;

$(document).ready(function () {

    if (!Detector.webgl) Detector.addGetWebGLMessage();

    setDataName();
    if (dataName["faceDataName"] && dataName["bodyDataName"] && dataName["sticksDataName"]) {
        init_scene();
        animate();
    } else {
        console.log("Url", dataName, "is undefined.");
    }

});

// functions

function setDataName() {

    dataName = {
        "faceDataName": getParam("faceDataName"),
        "bodyDataName": getParam("bodyDataName"),
        "sticksDataName": getParam("sticksDataName")
    }    

    console.log("[INFO] Data name", dataName);

    if (faceDataNameArr.indexOf(dataName["faceDataName"]) == -1) {
        dataName["faceDataName"] = undefined;
    }
    if (bodyDataNameArr.indexOf(dataName["bodyDataName"]) == -1) {
        dataName["bodyDataName"] = undefined;
    }
    if (sticksDataNameArr.indexOf(dataName["sticksDataName"]) == -1) {
        dataName["sticksDataName"] = undefined;
    }

    $("#face-data-name")[0].value = dataName["faceDataName"];
    $("#body-data-name")[0].value = dataName["bodyDataName"];    
    $("#sticks-data-name")[0].value = dataName["sticksDataName"];    

}

function loadData() {
    var faceDataName = $("#face-data-name")[0].value;
    var bodyDataName = $("#body-data-name")[0].value;
    var sticksDataName = $("#sticks-data-name")[0].value;

    location.href = "index.html?" + 
        "faceDataName=" + faceDataName + "&" +
        "bodyDataName=" + bodyDataName + "&" +
        "sticksDataName=" + sticksDataName;

}

function init_scene() {

    var canvas = $("#scene")[0];

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x111111);
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
    skull = new Skull();
    skull.init(dataName, function () {

        scene.add(skull.bodyMesh);
        scene.add(skull.faceMesh);
        for (var i = 0; i < skull.sticksMesh.length; i++) {
            scene.add(skull.sticksMesh[i]);
        }
        console.log("[INFO] Add skull done.");

        init_stick_control();
        console.log("[INFO] Init stick control done.");

    });

    // stats
    stats = new Stats();
    stats.domElement.style.zIndex = 100;
    $("#stats")[0].prepend(stats.domElement);

}

function onWindowResize() {

    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

}

function animate() {

    requestAnimationFrame(animate);

    controls.update();
    stats.update();
    renderer.render(scene, camera);

}

function init_stick_control() {

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

    $("#save-sticks")[0].disabled = false;

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

    console.log("Select stick ", stickIndex, ", Stick length ", skull.sticks[stickIndex].len);
    stickLengthRangeObj.value = skull.sticks[stickIndex].len;

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