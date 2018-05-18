var objName = "european";
var scale = 150;
var camera, controls, scene, renderer, stats;
var skull;

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
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    var spotLight0 = new THREE.SpotLight(0xffffff, 1);
    spotLight0.position.set(scale * 2, scale * 2, scale * 2);
    spotLight0.angle = Math.PI / 4;
    scene.add(spotLight0);

    var spotLight1 = new THREE.SpotLight(0xffffff, 1);
    spotLight1.position.set(-scale * 2, scale * 2, -scale * 2);
    spotLight1.angle = Math.PI / 4;
    scene.add(spotLight1);

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
    skull = new Skull(scale);
    skull.init(objName, function () {

        scene.add(skull.bodyMesh);
        scene.add(skull.faceMesh);
        for (var i = 0; i < skull.sticksMesh.length; i++) {
            scene.add(skull.sticksMesh[i]);
        }
        console.log("Add skull done.");

        init_stick_control();
        console.log("Init stick control done.");

    });

    // stats
    stats = new Stats();
    stats.domElement.style.zIndex = 100;
    $(".side")[0].prepend(stats.domElement);

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

function updateStickMesh(stickIndex) {

    var newStickMesh = getStickMesh(skull.sticks[stickIndex], scale);
    scene.remove(skull.sticksMesh[stickIndex]);
    skull.sticksMesh[stickIndex].geometry.dispose();
    skull.sticksMesh[stickIndex].material.dispose();

    skull.sticksMesh[stickIndex] = newStickMesh;
    scene.add(skull.sticksMesh[stickIndex]);

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

    var stickLengthRangeObj = $("#stick-length-range")[0];
    stickLengthRangeObj.disabled = false;
    stickLengthRangeObj.value = skull.sticks[stickIndex].len;

    var stickLengthInputObj = $("#stick-length-input")[0];
    stickLengthInputObj.disabled = false;
    stickLengthInputObj.value = skull.sticks[stickIndex].len;

    skull.sticks[stickIndex].highlight = true;
    updateStickMesh(stickIndex);

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

    console.log("Change stick by input ", stickIndex, ", length to ", stickLength);

    if (isNaN(stickLength)) {
        console.log("Change stick by input ", stickLength, " not a number");
        return;
    } else {
        stickLength = parseFloat(stickLength);
        stickLength = Math.min(30, stickLength);
        stickLength = Math.max(0.1, stickLength);
    }

    stickLengthInputObj.value = stickLength;
    stickLengthRangeObj.value = stickLength;

    skull.sticks[stickIndex].len = stickLength;
    updateStickMesh(stickIndex);

}

$(document).ready(function () {

    if (!Detector.webgl) Detector.addGetWebGLMessage();

    init_scene();
    animate();

});