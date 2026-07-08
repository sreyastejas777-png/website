const cropData = [
    {
        id: "jackfruit",
        name: "Jackfruit",
        category: "fruits",
        shortDesc: "Transform fresh jackfruit into premium dried products.",
        moistureStart: "75%",
        moistureEnd: "5%",
        shelfStart: "3 Days",
        shelfEnd: "12+ Months",
        products: ["Chips", "Powder", "Snacks", "Export Ready Pieces"],
        benefits: ["Higher Profit", "Reduced Waste", "Longer Storage", "Better Transportation"],
        related: ["banana", "mango", "pineapple"],
        freshEmoji: "🍈",
        driedEmoji: "🥞"
    },
    {
        id: "banana",
        name: "Banana",
        category: "fruits",
        shortDesc: "Create high-energy banana chips and nutrient powders.",
        moistureStart: "70%",
        moistureEnd: "4%",
        shelfStart: "5 Days",
        shelfEnd: "12+ Months",
        products: ["Sweet Chips", "Energy Powder", "Baby Food Base", "Breakfast Cereal Additive"],
        benefits: ["Value Addition", "Prevents Spoilage", "Easy Export", "High Market Demand"],
        related: ["jackfruit", "mango"],
        freshEmoji: "🍌",
        driedEmoji: "🍘"
    },
    {
        id: "mango",
        name: "Mango",
        category: "fruits",
        shortDesc: "Preserve the king of fruits for year-round global sales.",
        moistureStart: "80%",
        moistureEnd: "6%",
        shelfStart: "4 Days",
        shelfEnd: "12+ Months",
        products: ["Mango Leather (Aam Papad)", "Dried Slices", "Flavor Powder", "Trail Mix Addition"],
        benefits: ["Year-Round Sales", "No Refrigeration", "Premium Export Price", "Zero Preservatives Needed"],
        related: ["jackfruit", "pineapple"],
        freshEmoji: "🥭",
        driedEmoji: "🥓"
    },
    {
        id: "pineapple",
        name: "Pineapple",
        category: "fruits",
        shortDesc: "Lock in tropical sweetness and vibrant color.",
        moistureStart: "85%",
        moistureEnd: "5%",
        shelfStart: "4 Days",
        shelfEnd: "12+ Months",
        products: ["Dried Rings", "Diced Candies", "Drink Powders", "Baking Ingredients"],
        benefits: ["Retains Vitamin C", "Volume Reduction", "Extended Shelf Life", "Versatile Use"],
        related: ["mango", "banana"],
        freshEmoji: "🍍",
        driedEmoji: "🟡"
    },
    {
        id: "tomato",
        name: "Tomato",
        category: "vegetables",
        shortDesc: "Beat market gluts by creating premium tomato powder and flakes.",
        moistureStart: "95%",
        moistureEnd: "4%",
        shelfStart: "7 Days",
        shelfEnd: "18+ Months",
        products: ["Tomato Powder", "Sun-Dried Halves", "Soup Base", "Seasoning Flakes"],
        benefits: ["Survive Price Crashes", "Massive Weight Reduction", "Easy Storage", "High FMCG Demand"],
        related: ["chilli", "pepper"],
        freshEmoji: "🍅",
        driedEmoji: "🔴"
    },
    {
        id: "chilli",
        name: "Chilli",
        category: "spices",
        shortDesc: "Ensure perfect color retention and zero fungus growth.",
        moistureStart: "60%",
        moistureEnd: "8%",
        shelfStart: "10 Days",
        shelfEnd: "24+ Months",
        products: ["Dried Whole Chilli", "Chilli Flakes", "Fine Powder", "Spice Blends"],
        benefits: ["No Aflatoxin", "Bright Natural Color", "High Pungency Retention", "Export Grade Quality"],
        related: ["pepper", "tomato"],
        freshEmoji: "🌶️",
        driedEmoji: "🥀"
    },
    {
        id: "coconut",
        name: "Coconut",
        category: "plantation",
        shortDesc: "Produce high-grade desiccated coconut hygienically.",
        moistureStart: "50%",
        moistureEnd: "2%",
        shelfStart: "14 Days",
        shelfEnd: "12+ Months",
        products: ["Desiccated Coconut", "Coconut Chips", "Baking Supplies", "Oil Extraction Prep"],
        benefits: ["No Rancidity", "Snow White Color", "Fast Processing", "Hygienic Production"],
        related: ["coffee"],
        freshEmoji: "🥥",
        driedEmoji: "🥣"
    },
    {
        id: "curryleaves",
        name: "Curry Leaves",
        category: "herbs",
        shortDesc: "Dry herbs rapidly while preserving aroma and green color.",
        moistureStart: "65%",
        moistureEnd: "5%",
        shelfStart: "4 Days",
        shelfEnd: "18+ Months",
        products: ["Dried Leaves", "Herb Powder", "Seasoning Mix", "Ayurvedic Base"],
        benefits: ["Aroma Locked In", "Vibrant Green Color", "Instant Rehydration", "High Export Value"],
        related: ["pepper", "chilli"],
        freshEmoji: "🌿",
        driedEmoji: "🍂"
    },
    {
        id: "coffee",
        name: "Coffee",
        category: "plantation",
        shortDesc: "Precision drying for specialty coffee beans.",
        moistureStart: "50%",
        moistureEnd: "11%",
        shelfStart: "10 Days",
        shelfEnd: "12+ Months",
        products: ["Parchment Coffee", "Dried Cherries", "Specialty Roasts Prep", "Export Beans"],
        benefits: ["Consistent Moisture", "No Mold", "Controlled Fermentation", "Premium Cup Score"],
        related: ["coconut"],
        freshEmoji: "🍒",
        driedEmoji: "🫘"
    },
    {
        id: "pepper",
        name: "Black Pepper",
        category: "spices",
        shortDesc: "Hygienic, rapid drying for export-grade black pepper.",
        moistureStart: "65%",
        moistureEnd: "10%",
        shelfStart: "7 Days",
        shelfEnd: "24+ Months",
        products: ["Whole Black Pepper", "Pepper Powder", "Cracked Pepper", "Spice Mixes"],
        benefits: ["Uniform Color", "Volatile Oil Preservation", "No Fungal Contamination", "Fast Processing"],
        related: ["chilli", "curryleaves"],
        freshEmoji: "🟢",
        driedEmoji: "⚫"
    }
];

// --- Three.js Multi-Viewport Engine ---
class Crop3DEngine {
    constructor() {
        this.canvas = document.getElementById('crop-webgl-canvas');
        if (!this.canvas) return;

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.lastWidth = document.documentElement.scrollWidth;
        this.lastHeight = document.documentElement.scrollHeight;
        this.renderer.setSize(this.lastWidth, this.lastHeight);
        this.renderer.setScissorTest(true);

        this.scene = new THREE.Scene();
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 3.0); // Extremely bright
        this.scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 3.0); // Extremely bright
        dirLight.position.set(5, 10, 7);
        this.scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0x8cc63f, 1.0); 
        fillLight.position.set(-5, 0, -5);
        this.scene.add(fillLight);

        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        this.camera.position.z = 5;

        this.models = {}; 
        this.createModels();

        this.clock = new THREE.Clock();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    createModels() {
        this.loader = new THREE.GLTFLoader();
        
        const loadGLTF = (id, url, scale = 1, yOffset = 0) => {
            this.loader.load(url, (gltf) => {
                const model = gltf.scene;
                
                // Auto center and scale
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                const maxDim = Math.max(size.x, size.y, size.z);
                const normalizedScale = (2.0 / maxDim) * scale; // Target size is roughly 2.0 units
                
                model.scale.setScalar(normalizedScale);
                model.position.sub(center.multiplyScalar(normalizedScale));
                model.position.y += yOffset;

                const group = new THREE.Group();
                group.add(model);
                this.models[id] = group;
            });
        };

        // 1. Jackfruit (GLB)
        loadGLTF('jackfruit', 'models/jackfruit.glb', 1.0);

        // 2. Banana (GLB)
        loadGLTF('banana', 'models/banana.glb', 1.0);

        // 3. Mango (GLB)
        loadGLTF('mango', 'models/mango.glb', 1.0);

        // 4. Pineapple (GLB)
        loadGLTF('pineapple', 'models/pineapple.glb', 1.0);

        // 5. Tomato (GLB)
        loadGLTF('tomato', 'models/tomato.glb', 1.0);

        // 6. Chilli (GLB)
        loadGLTF('chilli', 'models/chilli.glb', 1.0);

        // 7. Coconut (GLB)
        loadGLTF('coconut', 'models/coconut.glb', 1.0);

        // 8. Curry Leaves (GLB)
        loadGLTF('curryleaves', 'models/curry_leaves.glb', 1.0);

        // 9. Coffee (red cherry)
        const coffGeom = new THREE.SphereGeometry(0.8, 16, 16);
        const coffMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.2 });
        this.models['coffee'] = new THREE.Mesh(coffGeom, coffMat);

        // 10. Pepper (small black spheres)
        const pepGroup = new THREE.Group();
        const pepGeom = new THREE.SphereGeometry(0.3, 8, 8);
        const pepMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 });
        for(let i=0; i<6; i++) {
            const p = new THREE.Mesh(pepGeom, pepMat);
            p.position.set((Math.random() - 0.5)*1.5, (Math.random() - 0.5)*1.5, (Math.random() - 0.5)*1.5);
            pepGroup.add(p);
        }
        this.models['pepper'] = pepGroup;
    }

    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate);
        const time = this.clock.getElapsedTime();

        // Clear canvas
        this.renderer.setScissorTest(false);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.renderer.clear();
        this.renderer.setScissorTest(true);

        // Auto-resize canvas if document size changes (e.g. from filtering)
        const currentWidth = document.documentElement.scrollWidth;
        const currentHeight = document.documentElement.scrollHeight;
        if (this.lastWidth !== currentWidth || this.lastHeight !== currentHeight) {
            this.renderer.setSize(currentWidth, currentHeight);
            this.lastWidth = currentWidth;
            this.lastHeight = currentHeight;
        }

        // Cache cards array to avoid DOM query thrashing on every frame
        if (!this.cards || this.cards.length === 0) {
            this.cards = Array.from(document.querySelectorAll('.crop-card'));
        }
        
        this.cards.forEach(card => {
            const id = card.dataset.id;
            const model = this.models[id];
            if (!model) return;

            const placeholder = card.querySelector('.crop-img-placeholder');
            if (!placeholder) return;
            const rect = placeholder.getBoundingClientRect();

            // Check if on screen (viewport culling)
            if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
                return;
            }

            // Sync 3D model opacity with CSS card opacity without forcing layout reflows!
            let cardOpacity = 1;
            if (card.style.opacity !== "") {
                cardOpacity = parseFloat(card.style.opacity);
            }
            if (card.style.display === 'none') {
                cardOpacity = 0;
            }

            if (cardOpacity <= 0.01) return; // Skip rendering if invisible
            
            model.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.transparent = true;
                    child.material.opacity = cardOpacity;
                }
            });

            // Calculate absolute position on the document since canvas is position: absolute
            const absoluteTop = rect.top + window.scrollY;
            const absoluteBottom = absoluteTop + (rect.bottom - rect.top);
            const absoluteLeft = rect.left + window.scrollX;
            const absoluteRight = rect.right + window.scrollX;

            // Set scissor and viewport relative to the FULL document canvas
            const width = Math.round(absoluteRight - absoluteLeft);
            const height = Math.round(absoluteBottom - absoluteTop);
            const left = Math.round(absoluteLeft);
            
            // WebGL's Y axis starts from the bottom of the canvas
            const bottom = Math.round(currentHeight - absoluteBottom);

            this.renderer.setViewport(left, bottom, width, height);
            this.renderer.setScissor(left, bottom, width, height);

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();

            // Rotate and scale based on hover state
            const isDragged = card.dataset.dragged === "true";
            const isHovered = card.matches(':hover') && !isDragged;
            const speed = isHovered ? 2.0 : 0.5;
            
            if (card.rotationOffset) {
                model.rotation.y += card.rotationOffset.y;
                model.rotation.x += card.rotationOffset.x;
                
                // Add continuous momentum based on the last drag
                card.rotationOffset.y *= 0.95;
                card.rotationOffset.x *= 0.95;
                
                // Keep the auto-rotation baseline alive
                model.rotation.y += 0.005 * speed;
            } else {
                model.rotation.y += 0.01 * speed;
                model.rotation.x = Math.sin(time * speed + model.id) * 0.1;
            }
            
            // Smooth scaling
            const targetScale = isHovered ? 1.2 : 1.0;
            model.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            this.scene.add(model);
            this.renderer.render(this.scene, this.camera);
            this.scene.remove(model);
        });
    }
}


// --- UI Logic & GSAP FLIP ---
document.addEventListener('DOMContentLoaded', () => {
    // Start 3D Engine
    if (typeof THREE !== 'undefined') {
        new Crop3DEngine();
    }

    if (typeof gsap !== 'undefined') {
        if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero scroll lock and fade transition
            gsap.to('.hero', {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                opacity: 0,
                y: -50
            });
        }
    }

    const gridContainer = document.getElementById('crop-grid');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const modal = document.getElementById('crop-modal');
    const modalClose = document.getElementById('modal-close');

    // Create all cards initially
    function initGrid() {
        gridContainer.innerHTML = '';
        cropData.forEach(crop => {
            const card = document.createElement('div');
            card.className = 'crop-card';
            card.dataset.id = crop.id;
            card.dataset.category = crop.category;
            
            card.innerHTML = `
                <div class="crop-img-placeholder"></div>
                <div class="crop-card-content" style="text-align: center;">
                    <h3 style="margin: 0;">${crop.name}</h3>
                </div>
            `;
            
            // Interaction logic for drag-to-rotate
            let isDragging = false;
            let startX, startY;
            card.dataset.dragged = "false";
            
            card.addEventListener('pointerdown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                card.setPointerCapture(e.pointerId);
            });
            
            card.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                if (!card.rotationOffset) card.rotationOffset = {x: 0, y: 0};
                card.rotationOffset.y += deltaX * 0.015;
                card.rotationOffset.x += deltaY * 0.015;
                
                startX = e.clientX;
                startY = e.clientY;
                
                if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                    card.dataset.dragged = "true";
                }
            });
            
            card.addEventListener('pointerup', (e) => {
                isDragging = false;
                card.releasePointerCapture(e.pointerId);
                // Reset dragged state after a short delay so click can be prevented
                setTimeout(() => {
                    card.dataset.dragged = "false";
                }, 50);
            });

            card.addEventListener('click', (e) => {
                if (card.dataset.dragged === "true") {
                    e.preventDefault();
                    return;
                }
                openModal(crop.id);
            });
            
            gridContainer.appendChild(card);
        });
    }

    // Filter using GSAP FLIP
    function filterGrid(filter) {
        if (typeof Flip === 'undefined') return;

        const cards = document.querySelectorAll('.crop-card');
        const grid = document.querySelector('.crop-grid');
        
        // 1. Get initial state and height
        const state = Flip.getState(cards);
        const currentHeight = grid.offsetHeight;
        
        // 2. Apply filtering
        cards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // 3. Calculate new height and lock grid to old height
        const newHeight = grid.offsetHeight;
        grid.style.height = currentHeight + 'px';

        // 4. Smoothly animate grid height to new height
        gsap.to(grid, {
            height: newHeight,
            duration: 0.6,
            ease: "power2.inOut",
            clearProps: "height"
        });

        // 5. Flip animate the cards
        Flip.from(state, {
            targets: cards,
            duration: 0.6,
            ease: "power2.inOut",
            absolute: true,
            stagger: 0.05,
            onEnter: elements => gsap.fromTo(elements, {opacity: 0, scale: 0.8}, {opacity: 1, scale: 1, duration: 0.4}),
            onLeave: elements => gsap.to(elements, {opacity: 0, scale: 0.8, duration: 0.4})
        });
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterGrid(btn.dataset.filter);
        });
    });

    // Modal Logic
    function openModal(id) {
        const crop = cropData.find(c => c.id === id);
        if (!crop) return;

        document.getElementById('modal-title').textContent = crop.name;
        document.getElementById('modal-emoji-fresh').textContent = crop.freshEmoji || "🌿"; 
        document.getElementById('modal-emoji-dried').textContent = crop.driedEmoji || "🍂";
        
        document.getElementById('modal-moisture-start').textContent = crop.moistureStart;
        document.getElementById('modal-moisture-end').textContent = crop.moistureEnd;
        document.getElementById('modal-shelf-start').textContent = crop.shelfStart;
        document.getElementById('modal-shelf-end').textContent = crop.shelfEnd;

        const productsList = document.getElementById('modal-products');
        productsList.innerHTML = '';
        crop.products.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p;
            productsList.appendChild(li);
        });

        const benefitsList = document.getElementById('modal-benefits');
        benefitsList.innerHTML = '';
        crop.benefits.forEach(b => {
            const li = document.createElement('li');
            li.textContent = b;
            benefitsList.appendChild(li);
        });

        const relatedGrid = document.getElementById('modal-related');
        relatedGrid.innerHTML = '';
        crop.related.forEach(relId => {
            const relCrop = cropData.find(c => c.id === relId);
            if (relCrop) {
                const tag = document.createElement('div');
                tag.className = 'related-tag';
                tag.textContent = relCrop.name;
                tag.addEventListener('click', () => {
                    openModal(relCrop.id);
                });
                relatedGrid.appendChild(tag);
            }
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    initGrid();
});
