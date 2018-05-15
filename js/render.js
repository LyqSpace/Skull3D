$(document).ready(function () {

    if (!Detector.webgl) Detector.addGetWebGLMessage();

    var camera, controls, scene, renderer, stats;

    init();
    animate();

    function init() {

        var scale = 150;
        var fileName = "african";

        var canvas = $("#scene")[0];

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setClearColor(0x111111);
        canvas.appendChild(renderer.domElement);

        // camera
        camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.01, 4000);
        camera.position.x = scale * 3;

        scene = new THREE.Scene();

        // helper
        axes = new THREE.AxesHelper(scale * 2)
        scene.add(axes);

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
        var skull = new Skull(scale);
        skull.init(fileName, function () {

            scene.add(skull.bodyMesh);
            for (var i = 0; i < skull.sticksMesh.length; i++) {
                scene.add(skull.sticksMesh[i]);
            }
            console.log(skull.sticks);
            console.log("Add skull");

        });

        // controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.maxDistance = scale * 8;

        // stats
        stats = new Stats();
        stats.domElement.style.zIndex = 100;
        $(".side")[0].insertBefore(stats.domElement, $("#control-sticks")[0]);

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

});