var scale = 150;
var camera, controls, scene, renderer, stats;
var skull;

function init() {

    var fileName = "african";

    var canvas = $("#scene")[0];

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x111111);
    canvas.append(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.01, 4000);
    camera.position.x = -scale * 3;

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

    // skull
    skull = new Skull(scale);
    skull.init(fileName, function () {

        scene.add(skull.bodyMesh);
        for (var i = 0; i < skull.sticksMesh.length; i++) {
            scene.add(skull.sticksMesh[i]);
        }
        console.log("Add skull done.");

        init_stick_control();
        console.log("Init stick control done.");

    });

    // controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.maxDistance = scale * 8;

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
        var optionObj = $("<option value=\"" + i.toString() + "\">" + i.toString() +"</option>")[0];
        stickIndexObj.append(optionObj);
    }
    stickIndexObj.value = 0;

    var stickLengthObj = $("#stick-length")[0];
    stickLengthObj.disabled = false;
    stickLengthObj.value = skull.sticks[stickIndex].len;

    skull.sticks[stickIndex].highlight = true;
    updateStickMesh(stickIndex);

}

function changeStickIndex() {

    var stickIndex = $("#stick-index")[0].value;
    var stickLengthObj = $("#stick-length")[0];
    
    console.log("Select stick ", stickIndex, ", Stick length ", skull.sticks[stickIndex].len);
    stickLengthObj.value = skull.sticks[stickIndex].len;

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

function changeStickLength() {

    var stickIndex = $("#stick-index")[0].value;
    var stickLength = $("#stick-length")[0].value;
    
    console.log("Change stick ", stickIndex, ", length to ", skull.sticks[stickIndex].len);
    skull.sticks[stickIndex].len = stickLength;
    updateStickMesh(stickIndex);

}

$(document).ready(function () {

    if (!Detector.webgl) Detector.addGetWebGLMessage();

    init();
    animate();

});