// js/technology-webgl.js — Detailed CALOR MEGA 3D Model + GSAP Scroll
// Procedurally modeled from reference photographs

(function () {
    'use strict';

    if (typeof THREE === 'undefined' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('[TechWebGL] Missing dependencies.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ─── Globals ───
    let scene, camera, renderer;
    let machineGroup;
    let leftDoor, rightDoor;               // Animated doors
    let leftDoorPivot, rightDoorPivot;     // Pivot groups for hinge rotation
    let traysLeft = [], traysRight = [];   // Internal tray meshes
    let internalLightL, internalLightR;    // Warm internal lights
    let controlPanelGroup;                 // Center control strip
    let grilleTop, grilleBottom;           // Ventilation grilles

    // Materials (reusable)
    const matBody = new THREE.MeshStandardMaterial({ color: 0x8a8c8e, metalness: 0.4, roughness: 0.6 });
    const matDoor = new THREE.MeshStandardMaterial({ color: 0x909295, metalness: 0.35, roughness: 0.5 });
    const matBrushedSteel = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.9, roughness: 0.2 });
    const matInterior = new THREE.MeshStandardMaterial({ color: 0xe0d8ba, metalness: 0.6, roughness: 0.3 });
    const matTray = new THREE.MeshStandardMaterial({ color: 0xbcbcbc, metalness: 0.9, roughness: 0.2, transparent: true, opacity: 0.85 });
    const matHandle = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.15 });
    const matDisplayBg = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.5 });
    const matDisplayLED = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff2200, emissiveIntensity: 2.0 });
    const matRedButton = new THREE.MeshStandardMaterial({ color: 0xdd0000, emissive: 0x990000, emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.3 });
    const matGauge = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.3, roughness: 0.4 });
    const matGaugeRim = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.15 });
    const matPipe = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.85, roughness: 0.2 });
    const matWheel = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.3, roughness: 0.7 });
    const matWheelBracket = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 });
    const matGrille = new THREE.MeshStandardMaterial({ color: 0x6a6a6a, metalness: 0.6, roughness: 0.4 });

    // ─── Dimensions (proportional to reference images) ───
    const BODY_W = 3.6;      // Width
    const BODY_H = 4.8;      // Height (taller than wide)
    const BODY_D = 3.2;      // Depth
    const WALL = 0.08;       // Wall thickness
    const PANEL_W = 0.35;    // Center control panel width
    const DOOR_W = (BODY_W - PANEL_W) / 2;
    const DOOR_H = BODY_H * 0.65;   // Doors cover ~65% of front height
    const DOOR_D = 0.06;

    init();
    buildMachine();
    setupLighting();
    setupScrollTimeline();
    animate();

    // ─── Initialization ───
    function init() {
        const canvas = document.getElementById('webgl-canvas');
        if (!canvas) { console.warn('[TechWebGL] No canvas found'); return; }

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x121212);

        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 1.5, 10);
        camera.lookAt(0, 0.5, 0);

        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ─── Build the full machine geometry ───
    function buildMachine() {
        machineGroup = new THREE.Group();
        scene.add(machineGroup);

        buildBody();
        buildDoors();
        buildControlPanel();
        buildInternalTrays();
        buildVentGrilles();
        buildWheels();
        buildInternalPipes();

        // Position the machine slightly below center for a grounded look
        machineGroup.position.y = -1.0;
        machineGroup.rotation.y = -0.15; // Slight initial angle
    }

    function buildBody() {
        // Main outer shell (hollow box approximation: 5 sides, front is open for doors)
        // Back wall
        const backGeo = new THREE.BoxGeometry(BODY_W, BODY_H, WALL);
        const back = new THREE.Mesh(backGeo, matBody);
        back.position.set(0, BODY_H / 2, -BODY_D / 2);
        back.castShadow = true; back.receiveShadow = true;
        machineGroup.add(back);

        // Top wall
        const topGeo = new THREE.BoxGeometry(BODY_W, WALL, BODY_D);
        const top = new THREE.Mesh(topGeo, matBody);
        top.position.set(0, BODY_H, 0);
        top.castShadow = true;
        machineGroup.add(top);

        // Bottom wall
        const bottom = new THREE.Mesh(topGeo, matBody);
        bottom.position.set(0, 0, 0);
        bottom.receiveShadow = true;
        machineGroup.add(bottom);

        // Left side wall
        const sideGeo = new THREE.BoxGeometry(WALL, BODY_H, BODY_D);
        const leftSide = new THREE.Mesh(sideGeo, matBody);
        leftSide.position.set(-BODY_W / 2, BODY_H / 2, 0);
        leftSide.castShadow = true; leftSide.receiveShadow = true;
        machineGroup.add(leftSide);

        // Right side wall
        const rightSide = new THREE.Mesh(sideGeo, matBody);
        rightSide.position.set(BODY_W / 2, BODY_H / 2, 0);
        rightSide.castShadow = true; rightSide.receiveShadow = true;
        machineGroup.add(rightSide);

        // Interior back panel (slightly lighter, simulates interior lining)
        const interiorGeo = new THREE.BoxGeometry(BODY_W - WALL * 2, BODY_H - WALL * 2, 0.02);
        const interior = new THREE.Mesh(interiorGeo, matInterior);
        interior.position.set(0, BODY_H / 2, -BODY_D / 2 + WALL + 0.01);
        machineGroup.add(interior);

        // Front Top Panel (above doors)
        const frontTopH = (BODY_H - DOOR_H) / 2;
        const frontTopGeo = new THREE.BoxGeometry(BODY_W, frontTopH, WALL);
        const frontTop = new THREE.Mesh(frontTopGeo, matBody);
        frontTop.position.set(0, BODY_H - frontTopH / 2, BODY_D / 2);
        frontTop.castShadow = true; frontTop.receiveShadow = true;
        machineGroup.add(frontTop);

        // Front Bottom Panel (below doors)
        const frontBottomGeo = new THREE.BoxGeometry(BODY_W, frontTopH, WALL);
        const frontBottom = new THREE.Mesh(frontBottomGeo, matBody);
        frontBottom.position.set(0, frontTopH / 2, BODY_D / 2);
        frontBottom.castShadow = true; frontBottom.receiveShadow = true;
        machineGroup.add(frontBottom);

        // Name plate (top-left of front face)
        const plateGeo = new THREE.BoxGeometry(0.5, 0.15, 0.02);
        const plateMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.set(-BODY_W / 2 + 0.35, BODY_H - 0.2, BODY_D / 2 + 0.01);
        machineGroup.add(plate);
    }

    function buildDoors() {
        const doorGeo = new THREE.BoxGeometry(DOOR_W, DOOR_H, DOOR_D);

        // ─ Left Door (hinged on its left edge) ─
        leftDoorPivot = new THREE.Group();
        leftDoorPivot.position.set(-PANEL_W / 2, BODY_H * 0.35, BODY_D / 2);
        machineGroup.add(leftDoorPivot);

        leftDoor = new THREE.Mesh(doorGeo, matDoor);
        leftDoor.position.set(-DOOR_W / 2, 0, DOOR_D / 2);
        leftDoor.castShadow = true;
        leftDoorPivot.add(leftDoor);

        // Left door handle
        addDoorHandle(leftDoor, -0.15);

        // Left door latches (4 small bars)
        addDoorLatches(leftDoor, 'left');

        // ─ Right Door (hinged on its right edge) ─
        rightDoorPivot = new THREE.Group();
        rightDoorPivot.position.set(PANEL_W / 2, BODY_H * 0.35, BODY_D / 2);
        machineGroup.add(rightDoorPivot);

        rightDoor = new THREE.Mesh(doorGeo, matDoor);
        rightDoor.position.set(DOOR_W / 2, 0, DOOR_D / 2);
        rightDoor.castShadow = true;
        rightDoorPivot.add(rightDoor);

        addDoorHandle(rightDoor, 0.15);
        addDoorLatches(rightDoor, 'right');
    }

    function addDoorHandle(doorMesh, xOffset) {
        // Thick D-shaped handle
        const handleGeo = new THREE.TorusGeometry(0.12, 0.025, 8, 16, Math.PI);
        const handle = new THREE.Mesh(handleGeo, matHandle);
        handle.rotation.z = Math.PI;
        handle.position.set(xOffset, 0, DOOR_D / 2 + 0.03);
        doorMesh.add(handle);

        // Handle mounting plate
        const mountGeo = new THREE.BoxGeometry(0.18, 0.06, 0.015);
        const mount = new THREE.Mesh(mountGeo, matHandle);
        mount.position.set(xOffset, 0.12, DOOR_D / 2 + 0.01);
        doorMesh.add(mount);
    }

    function addDoorLatches(doorMesh, side) {
        const latchGeo = new THREE.BoxGeometry(0.08, 0.03, 0.02);
        const positions = [-DOOR_H * 0.35, -DOOR_H * 0.15, DOOR_H * 0.15, DOOR_H * 0.35];
        const xPos = side === 'left' ? DOOR_W / 2 - 0.06 : -DOOR_W / 2 + 0.06;

        positions.forEach(yPos => {
            const latch = new THREE.Mesh(latchGeo, matHandle);
            latch.position.set(xPos, yPos, DOOR_D / 2 + 0.01);
            doorMesh.add(latch);
        });
    }

    function buildControlPanel() {
        controlPanelGroup = new THREE.Group();
        controlPanelGroup.position.set(0, BODY_H * 0.35, BODY_D / 2 + 0.01);
        machineGroup.add(controlPanelGroup);

        // Center strip (brushed stainless steel)
        const stripGeo = new THREE.BoxGeometry(PANEL_W, BODY_H * 0.75, 0.03);
        const strip = new THREE.Mesh(stripGeo, matBrushedSteel);
        strip.position.set(0, 0, 0);
        controlPanelGroup.add(strip);

        // Key lock at very top
        const keyGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.03, 8);
        const key = new THREE.Mesh(keyGeo, matHandle);
        key.rotation.x = Math.PI / 2;
        key.position.set(0, DOOR_H * 0.42, 0.025);
        controlPanelGroup.add(key);

        // Power switch (red rocker)
        const switchGeo = new THREE.BoxGeometry(0.08, 0.04, 0.02);
        const powerSwitch = new THREE.Mesh(switchGeo, matRedButton);
        powerSwitch.position.set(0, DOOR_H * 0.35, 0.025);
        controlPanelGroup.add(powerSwitch);

        // Digital display panel
        const displayBgGeo = new THREE.BoxGeometry(0.2, 0.12, 0.02);
        const displayBg = new THREE.Mesh(displayBgGeo, matDisplayBg);
        displayBg.position.set(0, DOOR_H * 0.25, 0.025);
        controlPanelGroup.add(displayBg);

        // LED display (temperature reading)
        const ledGeo = new THREE.BoxGeometry(0.14, 0.04, 0.005);
        const led1 = new THREE.Mesh(ledGeo, matDisplayLED);
        led1.position.set(0, DOOR_H * 0.27, 0.04);
        controlPanelGroup.add(led1);

        // LED display (timer reading)
        const led2 = new THREE.Mesh(ledGeo, matDisplayLED);
        led2.position.set(0, DOOR_H * 0.23, 0.04);
        controlPanelGroup.add(led2);

        // Red emergency button
        const buttonGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.025, 16);
        const button = new THREE.Mesh(buttonGeo, matRedButton);
        button.rotation.x = Math.PI / 2;
        button.position.set(0, DOOR_H * 0.12, 0.03);
        controlPanelGroup.add(button);

        // Pressure gauge 1 (larger, upper)
        addGauge(controlPanelGroup, 0, DOOR_H * 0.0, 0.09);

        // Pressure gauge 2 (smaller, lower)
        addGauge(controlPanelGroup, 0, -DOOR_H * 0.12, 0.07);
    }

    function addGauge(parent, x, y, radius) {
        // Rim
        const rimGeo = new THREE.TorusGeometry(radius, 0.008, 8, 32);
        const rim = new THREE.Mesh(rimGeo, matGaugeRim);
        rim.position.set(x, y, 0.03);
        parent.add(rim);

        // Face
        const faceGeo = new THREE.CircleGeometry(radius - 0.005, 32);
        const face = new THREE.Mesh(faceGeo, matGauge);
        face.position.set(x, y, 0.028);
        parent.add(face);

        // Needle
        const needleGeo = new THREE.BoxGeometry(0.005, radius * 0.7, 0.003);
        const needleMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const needle = new THREE.Mesh(needleGeo, needleMat);
        needle.position.set(x, y + radius * 0.2, 0.035);
        needle.rotation.z = -0.3;
        parent.add(needle);
    }

    function buildInternalTrays() {
        const trayCount = 5;
        const trayW = DOOR_W - 0.15;
        const trayD = BODY_D - 0.3;
        const trayGeo = new THREE.BoxGeometry(trayW, 0.02, trayD);
        const spacing = (DOOR_H * 0.85) / (trayCount + 1);

        // Left compartment trays
        for (let i = 0; i < trayCount; i++) {
            const tray = new THREE.Mesh(trayGeo, matTray.clone());
            const yPos = -DOOR_H * 0.4 + spacing * (i + 1);
            tray.position.set(-PANEL_W / 2 - DOOR_W / 2, BODY_H * 0.35 + yPos, 0);
            tray.receiveShadow = true;
            machineGroup.add(tray);
            traysLeft.push(tray);

            // Tray support rails (thin bars under trays)
            const railGeo = new THREE.BoxGeometry(0.02, 0.02, trayD);
            const railL = new THREE.Mesh(railGeo, matPipe);
            railL.position.set(tray.position.x - trayW / 2 + 0.05, tray.position.y - 0.02, 0);
            machineGroup.add(railL);
            const railR = new THREE.Mesh(railGeo, matPipe);
            railR.position.set(tray.position.x + trayW / 2 - 0.05, tray.position.y - 0.02, 0);
            machineGroup.add(railR);
        }

        // Right compartment trays
        for (let i = 0; i < trayCount; i++) {
            const tray = new THREE.Mesh(trayGeo, matTray.clone());
            const yPos = -DOOR_H * 0.4 + spacing * (i + 1);
            tray.position.set(PANEL_W / 2 + DOOR_W / 2, BODY_H * 0.35 + yPos, 0);
            tray.receiveShadow = true;
            machineGroup.add(tray);
            traysRight.push(tray);

            const railGeo = new THREE.BoxGeometry(0.02, 0.02, trayD);
            const railL = new THREE.Mesh(railGeo, matPipe);
            railL.position.set(tray.position.x - trayW / 2 + 0.05, tray.position.y - 0.02, 0);
            machineGroup.add(railL);
            const railR = new THREE.Mesh(railGeo, matPipe);
            railR.position.set(tray.position.x + trayW / 2 - 0.05, tray.position.y - 0.02, 0);
            machineGroup.add(railR);
        }
    }

    function buildInternalPipes() {
        // Vertical heating pipes along interior back wall (per compartment)
        const pipeRadius = 0.02;
        const pipeGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, BODY_H * 0.6, 8);

        [-1, 1].forEach(side => {
            const baseX = side * (PANEL_W / 2 + DOOR_W * 0.3);
            for (let p = 0; p < 3; p++) {
                const pipe = new THREE.Mesh(pipeGeo, matPipe);
                pipe.position.set(baseX + (p - 1) * 0.2, BODY_H * 0.5, -BODY_D / 2 + 0.2);
                machineGroup.add(pipe);
            }
            // Horizontal cross-pipes connecting them
            const crossGeo = new THREE.CylinderGeometry(pipeRadius * 0.7, pipeRadius * 0.7, 0.6, 8);
            for (let h = 0; h < 4; h++) {
                const cross = new THREE.Mesh(crossGeo, matPipe);
                cross.rotation.z = Math.PI / 2;
                cross.position.set(baseX, BODY_H * 0.3 + h * 0.25, -BODY_D / 2 + 0.2);
                machineGroup.add(cross);
            }
        });
    }

    function buildVentGrilles() {
        // Top ventilation grille (horizontal slats)
        grilleTop = new THREE.Group();
        const slotCount = 8;
        const slotW = BODY_W * 0.6;
        const slotH = 0.015;
        const slotGap = 0.03;
        const slotGeo = new THREE.BoxGeometry(slotW, slotH, 0.01);

        for (let i = 0; i < slotCount; i++) {
            const slat = new THREE.Mesh(slotGeo, matGrille);
            slat.position.set(0, BODY_H - 0.15 - i * slotGap, BODY_D / 2 + 0.01);
            grilleTop.add(slat);
        }
        machineGroup.add(grilleTop);

        // Bottom ventilation grille
        grilleBottom = new THREE.Group();
        for (let i = 0; i < slotCount; i++) {
            const slat = new THREE.Mesh(slotGeo, matGrille);
            slat.position.set(0, 0.15 + i * slotGap, BODY_D / 2 + 0.01);
            grilleBottom.add(slat);
        }
        machineGroup.add(grilleBottom);

        // Side grille (right side, matching reference image 1)
        const sideGrilleGroup = new THREE.Group();
        const sideSlotGeo = new THREE.BoxGeometry(0.01, slotH, BODY_D * 0.5);
        for (let i = 0; i < slotCount; i++) {
            const slat = new THREE.Mesh(sideSlotGeo, matGrille);
            slat.position.set(BODY_W / 2 + 0.01, BODY_H - 0.15 - i * slotGap, 0);
            sideGrilleGroup.add(slat);
        }
        // Lower side grille
        for (let i = 0; i < slotCount; i++) {
            const slat = new THREE.Mesh(sideSlotGeo, matGrille);
            slat.position.set(BODY_W / 2 + 0.01, 0.15 + i * slotGap, 0);
            sideGrilleGroup.add(slat);
        }
        machineGroup.add(sideGrilleGroup);
    }

    function buildWheels() {
        const wheelPositions = [
            [-BODY_W / 2 + 0.25, -0.15, BODY_D / 2 - 0.25],
            [BODY_W / 2 - 0.25, -0.15, BODY_D / 2 - 0.25],
            [-BODY_W / 2 + 0.25, -0.15, -BODY_D / 2 + 0.25],
            [BODY_W / 2 - 0.25, -0.15, -BODY_D / 2 + 0.25]
        ];

        wheelPositions.forEach(pos => {
            const wheelGroup = new THREE.Group();
            wheelGroup.position.set(pos[0], pos[1], pos[2]);

            // Bracket
            const bracketGeo = new THREE.BoxGeometry(0.08, 0.12, 0.08);
            const bracket = new THREE.Mesh(bracketGeo, matWheelBracket);
            bracket.position.y = 0.06;
            wheelGroup.add(bracket);

            // Wheel
            const wheelGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
            const wheel = new THREE.Mesh(wheelGeo, matWheel);
            wheel.rotation.x = Math.PI / 2;
            wheelGroup.add(wheel);

            machineGroup.add(wheelGroup);
        });
    }

    // ─── Lighting ───
    function setupLighting() {
        // Ambient
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        // Key light (from upper right front)
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
        keyLight.position.set(5, 8, 6);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(2048, 2048);
        keyLight.shadow.camera.near = 1;
        keyLight.shadow.camera.far = 25;
        scene.add(keyLight);

        // Fill light (cool blue from left)
        const fillLight = new THREE.PointLight(0x88aacc, 0.6, 20);
        fillLight.position.set(-6, 4, 3);
        scene.add(fillLight);

        // Rim light (from behind for edge definition)
        const rimLight = new THREE.PointLight(0xffffff, 0.5, 15);
        rimLight.position.set(0, 5, -8);
        scene.add(rimLight);

        // Internal warm lights (activate when doors open)
        internalLightL = new THREE.PointLight(0xffdd88, 0, 5);
        internalLightL.position.set(-PANEL_W / 2 - DOOR_W / 2, BODY_H * 0.7, 0);
        machineGroup.add(internalLightL);

        internalLightR = new THREE.PointLight(0xffdd88, 0, 5);
        internalLightR.position.set(PANEL_W / 2 + DOOR_W / 2, BODY_H * 0.7, 0);
        machineGroup.add(internalLightR);

        // Ground plane for shadow
        const groundGeo = new THREE.PlaneGeometry(30, 30);
        const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.15;
        ground.receiveShadow = true;
        scene.add(ground);
    }

    // ─── GSAP Scroll Timeline ───
    function setupScrollTimeline() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#scroll-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                onUpdate: self => updateWayfinding(self.progress)
            }
        });

        // ── Phase 1: Closed → Rotate → Open Doors (0 → 3.0) ──

        // Slow rotation from slight angle to front view
        tl.to(machineGroup.rotation, { y: 0, duration: 0.8, ease: 'power1.inOut' }, 0);

        // Open doors
        tl.to(leftDoorPivot.rotation, { y: -Math.PI * 0.55, duration: 1.5, ease: 'power2.inOut' }, 0.8);
        tl.to(rightDoorPivot.rotation, { y: Math.PI * 0.55, duration: 1.5, ease: 'power2.inOut' }, 0.8);

        // Internal lights fade up
        tl.to(internalLightL, { intensity: 1.5, duration: 1 }, 1.2);
        tl.to(internalLightR, { intensity: 1.5, duration: 1 }, 1.2);

        // Camera pushes in slightly
        tl.to(camera.position, { z: 8, y: 1.2, duration: 1.5, ease: 'power1.inOut' }, 0.5);

        // UI cards fade in staggered
        tl.to('.card-shell', { autoAlpha: 1, x: 20, duration: 0.5 }, 1.5);
        tl.to('.card-foam', { autoAlpha: 1, x: 20, duration: 0.5 }, 1.7);
        tl.to('.card-trays', { autoAlpha: 1, x: -20, duration: 0.5 }, 1.9);

        // ── Phase 2: Thermal Engine (3.0 → 6.5) ──

        // UI cards fade out
        tl.to(['.card-shell', '.card-foam', '.card-trays'], { autoAlpha: 0, duration: 0.5 }, 3.5);

        // Rotate to angled view
        tl.to(machineGroup.rotation, { y: -0.5, duration: 1.5, ease: 'power1.inOut' }, 3.5);
        tl.to(camera.position, { x: 2, z: 7.5, y: 1.8, duration: 1.5 }, 3.5);

        // Thermal heat effect on trays
        tl.call(() => { machineGroup.userData.thermalActive = true; }, null, 4.0);

        // Thermal card appears (Hold from 4.5 to 6.5)
        tl.fromTo('.thermal-card',
            { autoAlpha: 0, y: 50 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            4.5
        );
        tl.to('.thermal-card', { autoAlpha: 0, duration: 0.5 }, 6.5);

        // ── Phase 3: The Haptic Command Center (6.5 → 9.5) ──
        
        // Rotate to focus on the center control panel
        tl.to(machineGroup.rotation, { y: 0.2, duration: 1.0, ease: 'power1.inOut' }, 6.5);
        tl.to(camera.position, { x: 0, z: 6, y: 1.8, duration: 1.0 }, 6.5);

        // Command card appears (Hold from 7.5 to 9.5)
        tl.fromTo('.command-card',
            { autoAlpha: 0, y: 50 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            7.5
        );
        tl.to('.command-card', { autoAlpha: 0, duration: 0.5 }, 9.5);

        // ── Phase 4: The Dynamic ROI Engine (9.5 → 12.5) ──

        // Stop thermal and close doors
        tl.call(() => {
            machineGroup.userData.thermalActive = false;
            [...traysLeft, ...traysRight].forEach(t => t.material.color.setHex(0xbcbcbc));
        }, null, 9.5);
        tl.to(leftDoorPivot.rotation, { y: 0, duration: 1, ease: 'power2.inOut' }, 9.5);
        tl.to(rightDoorPivot.rotation, { y: 0, duration: 1, ease: 'power2.inOut' }, 9.5);
        tl.to(internalLightL, { intensity: 0, duration: 0.5 }, 9.5);
        tl.to(internalLightR, { intensity: 0, duration: 0.5 }, 9.5);

        // Pull camera back slightly to show the whole closed machine and ventilation
        tl.to(machineGroup.rotation, { y: 0, duration: 1.0, ease: 'power1.inOut' }, 9.5);
        tl.to(camera.position, { x: 0, z: 9, y: 1.5, duration: 1.0 }, 9.5);

        // ROI card appears (Hold from 10.5 to 12.5)
        tl.fromTo('.roi-card',
            { autoAlpha: 0, y: 50 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            10.5
        );
        tl.to('.roi-card', { autoAlpha: 0, duration: 0.5 }, 12.5);

        // ── Phase 5: The Conversion Horizon (12.5 → 13.5) ──

        // Fade canvas out smoothly
        tl.to('#webgl-canvas', { opacity: 0, duration: 1 }, 13.0);
    }

    // ─── Wayfinding ───
    function updateWayfinding(progress) {
        const totalSteps = 5;
        const currentStep = Math.min(totalSteps, Math.max(1, Math.ceil(progress * totalSteps)));

        document.querySelectorAll('.progress-step').forEach((el, i) => {
            el.classList.toggle('active', i + 1 === currentStep);
        });

        const fill = document.querySelector('.progress-fill');
        if (fill) fill.style.height = `${progress * 100}%`;
    }

    // ─── Render Loop ───
    function animate() {
        requestAnimationFrame(animate);

        // Thermal pulsing effect
        if (machineGroup && machineGroup.userData.thermalActive) {
            const t = Date.now() * 0.001;
            [...traysLeft, ...traysRight].forEach((tray, i) => {
                const heat = (Math.sin(t * 2.5 + i * 0.6) + 1) / 2;
                tray.material.color.setRGB(0.85 + heat * 0.15, 0.3 + heat * 0.5, heat * 0.05);
                tray.material.emissive = tray.material.emissive || new THREE.Color();
                tray.material.emissive.setRGB(heat * 0.3, heat * 0.1, 0);
                tray.material.emissiveIntensity = heat * 0.5;
            });
        }

        renderer.render(scene, camera);
    }

})();
