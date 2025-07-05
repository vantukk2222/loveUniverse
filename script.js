class LoveUniverseThreeJS {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        this.images = [];
        this.imageObjects = [];
        this.heartParticles = [];
        this.starParticles = [];

        // 2D Fireworks properties
        this.fireworksCanvas = null;
        this.fireworksCtx = null;
        this.fireworksOverlay = null;
        this.fireworksParticles = [];
        this.isFireworksActive = false;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.isAutoRotating = false;
        this.isTurbulenceMode = false;
        this.exploded = false;

        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.imageName = document.getElementById('imageName');
        this.loading = document.getElementById('loading');

        this.init();
    }

    init() {
        this.setupThreeJS();
        this.setup2DFireworks();
        this.loadImages();
        this.createBackgroundParticles();
        this.setupControls();
        this.setupEventListeners();
        this.animate();

        // Hide loading after initialization
        setTimeout(() => {
            this.loading.style.display = 'none';
        }, 2000);
        
        // Start fireworks after 3 seconds
        setTimeout(() => {
            this.startFireworks();
        }, 3000);
    }

    setupThreeJS() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x220011);

        // Camera - Much wider FOV and farther position for massive universe
        this.camera = new THREE.PerspectiveCamera(130, window.innerWidth / window.innerHeight, 0.1, 8000);
        this.camera.position.set(150, 25, 100);

        // Renderer
        const canvas = document.getElementById('threeCanvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Enable depth testing for proper occlusion
        this.renderer.sortObjects = true;
        this.renderer.shadowMap.enabled = false; // We don't need shadows but need depth

        // Set clear color and depth
        this.renderer.setClearColor(0x220011, 1);
        this.renderer.autoClear = true;

        // Controls for massive universe navigation
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 0.5;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 2000;
        this.controls.enablePan = true;
        this.controls.panSpeed = 2.0;
        
        // Mobile touch settings
        this.controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };
        this.controls.enableRotate = true;
        this.controls.rotateSpeed = 1.0;

        // Lighting for massive universe
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0xff69b4, 2, 500);
        pointLight1.position.set(200, 200, 200);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff1493, 1.5, 500);
        pointLight2.position.set(-200, -200, 200);
        this.scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0xfff0f5, 1, 400);
        pointLight3.position.set(0, 300, -200);
        this.scene.add(pointLight3);

        // Add some rim lighting for better sphere visibility
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
        rimLight.position.set(0, 0, 1);
        this.scene.add(rimLight);
    }

    async loadImages() {
        // Load images from folder (you can replace these with actual folder paths)
        // For browser environments, we need to manually specify image paths
        const sampleImages = [
            'images/0.jpg', 'images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg',
            'images/5.jpg', 'images/6.jpg', 'images/7.jpg', 'images/8.jpg', 'images/9.jpg',
            'images/10.jpg', 'images/11.jpg', 'images/12.jpg', 'images/13.jpg', 'images/14.jpg',
            'images/15.jpg', 'images/16.jpg', 'images/17.jpg', 'images/18.jpg', 'images/19.jpg',
            'images/20.jpg', 'images/21.jpg', 'images/22.jpg', 'images/23.jpg', 'images/24.jpg',
            'images/25.jpg', 'images/26.jpg', 'images/27.jpg', 'images/28.jpg', 'images/29.jpg',
            'images/30.jpg', 'images/31.jpg', 'images/32.jpg', 'images/33.jpg', 'images/34.jpg',
            'images/35.jpg', 'images/36.jpg', 'images/37.jpeg', 'images/38.jpeg'
        ];
        this.images = sampleImages;
        this.createImageRings();
    }

    createImageRings() {
        const loader = new THREE.TextureLoader();
        const planetRadius = 120; // Same as planet radius

        // Create first ring (inner ring)
        const ring1Radius = planetRadius + 40;
        const ring1ImageCount = Math.floor(this.images.length / 2);

        // Create second ring (outer ring)
        const ring2Radius = planetRadius + 38;
        const ring2ImageCount = this.images.length - ring1ImageCount;

        // Create first ring
        for (let i = 0; i < ring1ImageCount; i++) {
            const imageSrc = this.images[i];
            const geometry = new THREE.CircleGeometry(8, 32);

            loader.load(imageSrc, (texture) => {
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide,
                    depthTest: true,
                    depthWrite: true
                });

                const mesh = new THREE.Mesh(geometry, material);

                // Position images in first ring
                const angle = (i / ring1ImageCount) * Math.PI * 2;
                mesh.position.x = ring1Radius * Math.cos(angle);
                mesh.position.y = 0;
                mesh.position.z = ring1Radius * Math.sin(angle);

                mesh.lookAt(0, 0, 0);
                mesh.rotation.x += (Math.random() - 0.5) * 0.3;
                mesh.rotation.z += (Math.random() - 0.5) * 0.3;

                mesh.userData = {
                    velocity: new THREE.Vector3(0, 0, 0),
                    rotationVelocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.01,
                        (Math.random() - 0.5) * 0.01,
                        (Math.random() - 0.5) * 0.01
                    ),
                    imageSrc: imageSrc,
                    imageName: `Tình iu ❤️❤️❤️❤️❤️`,
                    originalPosition: mesh.position.clone(),
                    originalAngle: angle,
                    ringRadius: ring1Radius,
                    isImage: true,
                    isRingImage: true,
                    ringLayer: 1
                };

                this.scene.add(mesh);
                this.imageObjects.push(mesh);
            });
        }

        // Create second ring
        for (let i = 0; i < ring2ImageCount; i++) {
            const imageSrc = this.images[ring1ImageCount + i];
            const geometry = new THREE.CircleGeometry(6, 32); // Slightly smaller for outer ring

            loader.load(imageSrc, (texture) => {
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide,
                    depthTest: true,
                    depthWrite: true
                });

                const mesh = new THREE.Mesh(geometry, material);

                // Position images in second ring with offset angle
                const angle = (i / ring2ImageCount) * Math.PI * 2 + Math.PI / ring2ImageCount; // Offset angle
                mesh.position.x = ring2Radius * Math.cos(angle);
                mesh.position.y = 0;
                mesh.position.z = ring2Radius * Math.sin(angle);

                mesh.lookAt(0, 0, 0);
                mesh.rotation.x += (Math.random() - 0.5) * 0.3;
                mesh.rotation.z += (Math.random() - 0.5) * 0.3;

                mesh.userData = {
                    velocity: new THREE.Vector3(0, 0, 0),
                    rotationVelocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.008,
                        (Math.random() - 0.5) * 0.008,
                        (Math.random() - 0.5) * 0.008
                    ),
                    imageSrc: imageSrc,
                    imageName: `Kỷ niệm ${ring1ImageCount + i + 1}`,
                    originalPosition: mesh.position.clone(),
                    originalAngle: angle,
                    ringRadius: ring2Radius,
                    isImage: true,
                    isRingImage: true,
                    ringLayer: 2
                };

                this.scene.add(mesh);
                this.imageObjects.push(mesh);
            });
        }
    }

    createBackgroundParticles() {
        // Create heart particles (planet)
        this.createHeartParticles();

        // Create star particles (background)
        this.createStarParticles();
    }

    createHeartParticles() {
        // Create a massive hollow sphere planet in the center with stars on surface
        const planetRadius = 120;
        const starCount = 4000; // More stars on planet surface

        // Create invisible occlusion sphere to hide images behind planet
        const occlusionGeometry = new THREE.SphereGeometry(planetRadius - 2, 32, 16);
        const occlusionMaterial = new THREE.MeshBasicMaterial({
            color: 0x220011, // Same as background
            transparent: false,
            side: THREE.FrontSide
        });
        const occlusionSphere = new THREE.Mesh(occlusionGeometry, occlusionMaterial);
        this.scene.add(occlusionSphere);
        this.heartParticles.push({ occlusion: occlusionSphere });

        // Create a wireframe sphere to show planet structure
        const wireframeGeometry = new THREE.SphereGeometry(planetRadius, 64, 32);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xff69b4,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const wireframeSphere = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        // this.scene.add(wireframeSphere);
        // this.heartParticles.push({ wireframe: wireframeSphere });

        for (let i = 0; i < starCount; i++) {
            // Create small sphere stars for planet surface
            const starGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.5, 6, 4);

            // Random bright pink color for planet stars
            const pinkVariation = Math.random();
            let starColor;
            if (pinkVariation < 0.4) {
                starColor = new THREE.Color(1, 0.2, 0.7); // Hot pink
            } else if (pinkVariation < 0.7) {
                starColor = new THREE.Color(1, 0.5, 0.8); // Magenta pink
            } else {
                starColor = new THREE.Color(1, 0.3, 0.9); // Rose pink
            }

            // Create glowing material for planet stars
            const starMaterial = new THREE.MeshBasicMaterial({
                color: starColor,
                transparent: true,
                opacity: 0.9,
                emissive: starColor,
                emissiveIntensity: 0.4
            });

            const starMesh = new THREE.Mesh(starGeometry, starMaterial);

            // Position on sphere surface using spherical coordinates
            const phi = Math.acos(2 * Math.random() - 1); // Polar angle
            const theta = 2 * Math.PI * Math.random(); // Azimuthal angle

            starMesh.position.x = planetRadius * Math.sin(phi) * Math.cos(theta);
            starMesh.position.y = planetRadius * Math.sin(phi) * Math.sin(theta);
            starMesh.position.z = planetRadius * Math.cos(phi);

            // Add small glow effect for planet stars
            const glowGeometry = new THREE.SphereGeometry(0.8, 6, 4);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: starColor,
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
            });
            const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
            glowMesh.position.copy(starMesh.position);

            this.scene.add(starMesh);
            this.scene.add(glowMesh);
            this.heartParticles.push({
                planetStar: starMesh,
                planetGlow: glowMesh,
                originalPos: starMesh.position.clone(),
                angle: { phi: phi, theta: theta }
            });
        }
    }

    createStarParticles() {
        const starCount = 2000; // Much more background stars for massive universe

        for (let i = 0; i < starCount; i++) {
            // Create sphere geometry for each star
            const sphereGeometry = new THREE.SphereGeometry(0.5 + Math.random() * 1, 8, 6);

            // Random bright pink color
            const pinkVariation = Math.random();
            let starColor;
            if (pinkVariation < 0.3) {
                // Hot pink
                starColor = new THREE.Color(1, 0.1, 0.6);
            } else if (pinkVariation < 0.6) {
                // Magenta pink
                starColor = new THREE.Color(1, 0.4, 0.8);
            } else {
                // Rose pink
                starColor = new THREE.Color(1, 0.5, 0.9);
            }

            // Create glowing material like car headlights
            const starMaterial = new THREE.MeshBasicMaterial({
                color: starColor,
                transparent: true,
                opacity: 0.95,
                emissive: starColor,
                emissiveIntensity: 0.5
            });

            // Create mesh
            const starMesh = new THREE.Mesh(sphereGeometry, starMaterial);

            // Random position in massive universe space
            starMesh.position.x = (Math.random() - 0.5) * 1000;
            starMesh.position.y = (Math.random() - 0.5) * 1000;
            starMesh.position.z = (Math.random() - 0.5) * 1000;

            // Add glow effect - create multiple layers like car headlights
            const glowGeometry1 = new THREE.SphereGeometry(2, 8, 6);
            const glowMaterial1 = new THREE.MeshBasicMaterial({
                color: starColor,
                transparent: true,
                opacity: 0.3,
                side: THREE.BackSide
            });
            const glowMesh1 = new THREE.Mesh(glowGeometry1, glowMaterial1);
            glowMesh1.position.copy(starMesh.position);

            const glowGeometry2 = new THREE.SphereGeometry(3.5, 8, 6);
            const glowMaterial2 = new THREE.MeshBasicMaterial({
                color: starColor,
                transparent: true,
                opacity: 0.1,
                side: THREE.BackSide
            });
            const glowMesh2 = new THREE.Mesh(glowGeometry2, glowMaterial2);
            glowMesh2.position.copy(starMesh.position);

            this.scene.add(starMesh);
            this.scene.add(glowMesh1);
            this.scene.add(glowMesh2);
            this.starParticles.push({
                star: starMesh,
                glow1: glowMesh1,
                glow2: glowMesh2,
                originalPosition: starMesh.position.clone(),
                initialAngle: Math.atan2(starMesh.position.z, starMesh.position.x),
                radius: Math.sqrt(starMesh.position.x * starMesh.position.x + starMesh.position.z * starMesh.position.z)
            });
        }
    }

    setupControls() {
        // UI Controls
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.camera.position.multiplyScalar(0.8);
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            this.camera.position.multiplyScalar(1.2);
        });

        document.getElementById('reset').addEventListener('click', () => {
            this.resetCamera();
        });

        document.getElementById('rotateLeft').addEventListener('click', () => {
            this.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.2);
        });

        document.getElementById('rotateRight').addEventListener('click', () => {
            this.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.2);
        });

        document.getElementById('rotateUp').addEventListener('click', () => {
            this.camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.2);
        });

        document.getElementById('rotateDown').addEventListener('click', () => {
            this.camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.2);
        });

        document.getElementById('autoRotate').addEventListener('click', () => {
            this.toggleAutoRotate();
        });

        document.getElementById('turbulence').addEventListener('click', () => {
            this.toggleTurbulence();
        });
    }

    setupEventListeners() {
        // Mouse events for clicking images (Desktop + Mobile)
        this.renderer.domElement.addEventListener('click', (event) => {
            console.log('Mouse click detected');
            this.onImageClick(event);
        });
        
        // Touch events for mobile devices
        this.renderer.domElement.addEventListener('touchend', (event) => {
            console.log('Touch end detected');
            // Prevent default to avoid double-firing with click
            event.preventDefault();
            
            // Use the first touch point
            if (event.changedTouches && event.changedTouches.length > 0) {
                const touch = event.changedTouches[0];
                // Create a synthetic event object similar to mouse event
                const syntheticEvent = {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                };
                this.onImageClick(syntheticEvent);
            }
        });
        
        // Prevent context menu on long press (mobile)
        this.renderer.domElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Hide instructions
        // document.getElementById('hideInstructions').addEventListener('click', () => {
        //     document.getElementById('instructions').style.display = 'none';
        // });

        // Keyboard controls
        window.addEventListener('keydown', (event) => {
            this.handleKeydown(event);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    onImageClick(event) {
        // Convert mouse position to normalized device coordinates
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Check for intersections with image objects
        const intersects = this.raycaster.intersectObjects(this.imageObjects);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            if (clickedObject.userData.isImage) {
                this.showModal(clickedObject.userData.imageSrc, clickedObject.userData.imageName);
                // this.createExplosionEffect(clickedObject.position);
            }
        }
    }

    showModal(imageSrc, imageName) {
        this.modalImage.src = imageSrc;
        this.imageName.textContent = imageName;
        this.modal.style.display = 'flex';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    createExplosionEffect(position) {
        const particleCount = 50;
        const explosionGeometry = new THREE.BufferGeometry();
        const explosionPositions = new Float32Array(particleCount * 3);
        const explosionColors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            explosionPositions[i * 3] = position.x + (Math.random() - 0.5) * 8;
            explosionPositions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 8;
            explosionPositions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 8;

            explosionColors[i * 3] = 1;
            explosionColors[i * 3 + 1] = Math.random();
            explosionColors[i * 3 + 2] = 0;
        }

        explosionGeometry.setAttribute('position', new THREE.BufferAttribute(explosionPositions, 3));
        explosionGeometry.setAttribute('color', new THREE.BufferAttribute(explosionColors, 3));

        const explosionMaterial = new THREE.PointsMaterial({
            size: 6,
            vertexColors: true,
            transparent: true,
            opacity: 1
        });

        const explosion = new THREE.Points(explosionGeometry, explosionMaterial);
        this.scene.add(explosion);

        // Animate explosion
        let opacity = 1;
        const explodeAnimation = () => {
            opacity -= 0.02;
            explosion.material.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(explodeAnimation);
            } else {
                this.scene.remove(explosion);
            }
        };
        explodeAnimation();
    }

    toggleAutoRotate() {
        this.isAutoRotating = !this.isAutoRotating;
        this.controls.autoRotate = this.isAutoRotating;

        const button = document.getElementById('autoRotate');
        button.style.backgroundColor = this.isAutoRotating ? '#ff69b4' : '';
    }

    toggleTurbulence() {
        this.isTurbulenceMode = !this.isTurbulenceMode;

        const button = document.getElementById('turbulence');
        button.style.backgroundColor = this.isTurbulenceMode ? '#ff69b4' : '';
    }

    resetCamera() {
        this.camera.position.set(250, 100, 100);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        // Reset ring image positions
        this.imageObjects.forEach(obj => {
            if (obj.userData.isRingImage) {
                // Reset ring images to original positions
                obj.position.copy(obj.userData.originalPosition);
            } else {
                // Reset other images
                obj.position.copy(obj.userData.originalPosition);
                obj.userData.velocity.set(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1
                );
            }
        });
    }

    handleKeydown(event) {
        switch (event.key.toLowerCase()) {
            case 'r':
                this.resetCamera();
                break;
            case 'arrowleft':
                this.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.1);
                break;
            case 'arrowright':
                this.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.1);
                break;
            case 'arrowup':
                this.camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.1);
                break;
            case 'arrowdown':
                this.camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.1);
                break;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setup2DFireworks() {
        // Setup 2D canvas for fireworks overlay
        this.fireworksOverlay = document.getElementById('fireworksOverlay');
        this.fireworksCanvas = document.getElementById('fireworksCanvas');
        this.fireworksCtx = this.fireworksCanvas.getContext('2d');
        
        // Set canvas size
        this.resizeFireworksCanvas();
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.resizeFireworksCanvas();
        });
    }
    
    resizeFireworksCanvas() {
        this.fireworksCanvas.width = window.innerWidth;
        this.fireworksCanvas.height = window.innerHeight;
    }
    
    startFireworks() {
        if (this.isFireworksActive) return;
        
        this.isFireworksActive = true;
        
        // Launch firework from bottom center to screen center
        this.launchFirework();
        
        // Start fireworks animation loop
        this.animateFireworks();
        this.fireworksOverlay.classList.add('active');
    }
    
    launchFirework() {
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight;
        const targetX = window.innerWidth / 2;
        const targetY = window.innerHeight / 2;
        
        // Create firework projectile
        const firework = {
            x: startX,
            y: startY,
            targetX: targetX,
            targetY: targetY,
            speed: 18,
            trail: [],
            exploded: false,
            color: '#ffd700'
        };
        
        this.fireworksParticles.push(firework);
    }
    
    explodeFirework(firework) {
        if (firework.exploded) return;
        
        firework.exploded = true;
        
        // Create explosion particles
        const particleCount = 200;
        const colors = ['#ff69b4', '#ffd700', '#ff1493', '#ffa500', '#ff6347', '#da70d6'];
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 5 + 2;
            
            this.fireworksParticles.push({
                x: firework.x,
                y: firework.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.015,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 15,
                isParticle: true
            });
        }
        
        // Show birthday message after explosion
        setTimeout(() => {
            const birthdayMessage = document.getElementById('birthdayMessage');
            birthdayMessage.classList.add('show');
        }, 500);
        
        // Hide fireworks after message appears
        setTimeout(() => {
            this.hideFireworks();
        }, 8000);
    }
    
    hideFireworks() {
        this.fireworksOverlay.classList.remove('active');
        this.isFireworksActive = false;
        this.fireworksParticles = [];
        
        // Hide birthday message
        const birthdayMessage = document.getElementById('birthdayMessage');
        birthdayMessage.classList.remove('show');
        
        // Clear canvas
        this.fireworksCtx.clearRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);
    }
    
    animateFireworks() {
        if (!this.isFireworksActive) return;
        
        // Clear canvas
        this.fireworksCtx.clearRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);
        
        // Update and draw fireworks
        for (let i = this.fireworksParticles.length - 1; i >= 0; i--) {
            const particle = this.fireworksParticles[i];
            
            if (particle.isParticle) {
                // Update explosion particles
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // gravity
                particle.life -= particle.decay;
                
                if (particle.life > 0) {
                    // Draw particle
                    this.fireworksCtx.save();
                    this.fireworksCtx.globalAlpha = particle.life;
                    this.fireworksCtx.fillStyle = particle.color;
                    this.fireworksCtx.shadowBlur = 15;
                    this.fireworksCtx.shadowColor = particle.color;
                    this.fireworksCtx.beginPath();
                    this.fireworksCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.fireworksCtx.fill();
                    this.fireworksCtx.restore();
                } else {
                    this.fireworksParticles.splice(i, 1);
                }
            } else if (!particle.exploded) {
                // Update firework projectile
                const dx = particle.targetX - particle.x;
                const dy = particle.targetY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 10) {
                    this.explodeFirework(particle);
                    this.fireworksParticles.splice(i, 1);
                } else {
                    particle.x += (dx / distance) * particle.speed;
                    particle.y += (dy / distance) * particle.speed;
                    
                    // Add to trail
                    particle.trail.push({ x: particle.x, y: particle.y });
                    if (particle.trail.length > 10) {
                        particle.trail.shift();
                    }
                    
                    // Draw firework and trail
                    this.fireworksCtx.save();
                    this.fireworksCtx.strokeStyle = particle.color;
                    this.fireworksCtx.lineWidth = 3;
                    this.fireworksCtx.shadowBlur = 10;
                    this.fireworksCtx.shadowColor = particle.color;
                    this.fireworksCtx.beginPath();
                    
                    for (let j = 0; j < particle.trail.length; j++) {
                        const alpha = j / particle.trail.length;
                        this.fireworksCtx.globalAlpha = alpha;
                        if (j === 0) {
                            this.fireworksCtx.moveTo(particle.trail[j].x, particle.trail[j].y);
                        } else {
                            this.fireworksCtx.lineTo(particle.trail[j].x, particle.trail[j].y);
                        }
                    }
                    this.fireworksCtx.stroke();
                    
                    // Draw firework head
                    this.fireworksCtx.globalAlpha = 1;
                    this.fireworksCtx.fillStyle = particle.color;
                    this.fireworksCtx.beginPath();
                    this.fireworksCtx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
                    this.fireworksCtx.fill();
                    this.fireworksCtx.restore();
                }
            }
        }
        
        requestAnimationFrame(() => this.animateFireworks());
    }

    updatePhysics() {
        // Update image object physics
        this.imageObjects.forEach(obj => {
            if (obj.userData.isRingImage) {
                // Special handling for ring images - rotate around planet
                let rotationSpeed;
                let floatingSpeed;

                // Different speeds for different ring layers
                if (obj.userData.ringLayer === 1) {
                    rotationSpeed = 0.0001; // Inner ring slower
                    floatingSpeed = 1;
                } else {
                    rotationSpeed = 0.00008; // Outer ring even slower
                    floatingSpeed = 0.8;
                }

                const time = Date.now() * rotationSpeed;
                const newAngle = obj.userData.originalAngle + time;

                obj.position.x = obj.userData.ringRadius * Math.cos(newAngle);
                obj.position.z = obj.userData.ringRadius * Math.sin(newAngle);

                // Keep images facing the center
                obj.lookAt(0, 0, 0);

                // Add gentle rotation for each image
                obj.rotation.x += obj.userData.rotationVelocity.x;
                obj.rotation.y += obj.userData.rotationVelocity.y;
                obj.rotation.z += obj.userData.rotationVelocity.z;

                // Gentle floating motion with different patterns for each layer
                const floatingTime = Date.now() * 0.001 * floatingSpeed;
                if (obj.userData.ringLayer === 1) {
                    obj.position.y = Math.sin(floatingTime + obj.userData.originalAngle) * 3;
                } else {
                    obj.position.y = Math.cos(floatingTime + obj.userData.originalAngle) * 4;
                }
            } else {
                // Regular image physics (if any)
                obj.position.add(obj.userData.velocity);

                // Apply rotation
                obj.rotation.x += obj.userData.rotationVelocity.x;
                obj.rotation.y += obj.userData.rotationVelocity.y;
                obj.rotation.z += obj.userData.rotationVelocity.z;

                // Turbulence mode
                if (this.isTurbulenceMode) {
                    obj.userData.velocity.x += (Math.random() - 0.5) * 0.02;
                    obj.userData.velocity.y += (Math.random() - 0.5) * 0.02;
                    obj.userData.velocity.z += (Math.random() - 0.5) * 0.02;
                }

                // Apply friction
                obj.userData.velocity.multiplyScalar(0.98);

                // Boundary wrapping for massive universe
                const boundary = 200;
                if (Math.abs(obj.position.x) > boundary) obj.position.x *= -0.8;
                if (Math.abs(obj.position.y) > boundary) obj.position.y *= -0.8;
                if (Math.abs(obj.position.z) > boundary) obj.position.z *= -0.8;
            }
        });


        // Animate background particles
        // Animate planet stars - gentle rotation around planet center
        this.heartParticles.forEach(planetObj => {
            if (planetObj.wireframe) {
                // Rotate the wireframe sphere
                planetObj.wireframe.rotation.y += 0.002;
                planetObj.wireframe.rotation.x += 0.001;
            } else if (planetObj.occlusion) {
                // Rotate the occlusion sphere with the universe
                const time = Date.now() * 0.0001;
                planetObj.occlusion.rotation.y += 0.002;
                planetObj.occlusion.rotation.x += 0.001;
            } else if (planetObj.planetStar && planetObj.planetGlow) {
                // Gentle rotation of individual stars
                planetObj.planetStar.rotation.x += 0.005;
                planetObj.planetStar.rotation.y += 0.005;
                planetObj.planetGlow.rotation.x += 0.003;
                planetObj.planetGlow.rotation.y += 0.003;

                // Slowly rotate the entire planet by updating positions
                const time = Date.now() * 0.0001; // Match universe rotation speed
                const planetRadius = 120; // Match with createHeartParticles
                const newTheta = planetObj.angle.theta + time;

                planetObj.planetStar.position.x = planetRadius * Math.sin(planetObj.angle.phi) * Math.cos(newTheta);
                planetObj.planetStar.position.y = planetRadius * Math.sin(planetObj.angle.phi) * Math.sin(newTheta);
                planetObj.planetStar.position.z = planetRadius * Math.cos(planetObj.angle.phi);

                planetObj.planetGlow.position.copy(planetObj.planetStar.position);
            }
        });

        // Animate star spheres - gentle rotation for glow effect and universe rotation
        this.starParticles.forEach(starObj => {
            if (starObj.star && starObj.glow1 && starObj.glow2) {
                // Gentle rotation for both star and glow layers
                starObj.star.rotation.x += 0.01;
                starObj.star.rotation.y += 0.01;
                starObj.glow1.rotation.x += 0.005;
                starObj.glow1.rotation.y += 0.005;
                starObj.glow2.rotation.x += 0.003;
                starObj.glow2.rotation.y += 0.003;

                // Universe rotation - rotate all background stars around center
                const universeTime = Date.now() * 0.00005; // Very slow universe rotation
                const newAngle = starObj.initialAngle + universeTime;

                starObj.star.position.x = starObj.radius * Math.cos(newAngle);
                starObj.star.position.z = starObj.radius * Math.sin(newAngle);
                starObj.glow1.position.x = starObj.star.position.x;
                starObj.glow1.position.z = starObj.star.position.z;
                starObj.glow2.position.x = starObj.star.position.x;
                starObj.glow2.position.z = starObj.star.position.z;

                // Subtle floating motion
                const time = Date.now() * 0.001;
                const offset = Math.sin(time + starObj.initialAngle * 5) * 0.02;
                starObj.star.position.y = starObj.originalPosition.y + offset;
                starObj.glow1.position.y = starObj.star.position.y;
                starObj.glow2.position.y = starObj.star.position.y;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updatePhysics();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the love universe when page loads
window.addEventListener('DOMContentLoaded', () => {
    new LoveUniverseThreeJS();

});
