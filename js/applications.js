const cropData = [
    {
        id: "jackfruit",
        name: "Jackfruit",
        category: "fruits",
        emoji: "🥭",
        shortDesc: "Transform fresh jackfruit into premium dried products.",
        moistureStart: "75%",
        moistureEnd: "5%",
        shelfStart: "3 Days",
        shelfEnd: "12+ Months",
        products: ["Chips", "Powder", "Snacks", "Export Ready Pieces"],
        benefits: ["Higher Profit", "Reduced Waste", "Longer Storage", "Better Transportation"],
        related: ["banana", "mango", "pineapple"]
    },
    {
        id: "banana",
        name: "Banana",
        category: "fruits",
        emoji: "🍌",
        shortDesc: "Create high-energy banana chips and nutrient powders.",
        moistureStart: "70%",
        moistureEnd: "4%",
        shelfStart: "5 Days",
        shelfEnd: "12+ Months",
        products: ["Sweet Chips", "Energy Powder", "Baby Food Base", "Breakfast Cereal Additive"],
        benefits: ["Value Addition", "Prevents Spoilage", "Easy Export", "High Market Demand"],
        related: ["jackfruit", "mango"]
    },
    {
        id: "mango",
        name: "Mango",
        category: "fruits",
        emoji: "🥭",
        shortDesc: "Preserve the king of fruits for year-round global sales.",
        moistureStart: "80%",
        moistureEnd: "6%",
        shelfStart: "4 Days",
        shelfEnd: "12+ Months",
        products: ["Mango Leather (Aam Papad)", "Dried Slices", "Flavor Powder", "Trail Mix Addition"],
        benefits: ["Year-Round Sales", "No Refrigeration", "Premium Export Price", "Zero Preservatives Needed"],
        related: ["jackfruit", "pineapple"]
    },
    {
        id: "pineapple",
        name: "Pineapple",
        category: "fruits",
        emoji: "🍍",
        shortDesc: "Lock in tropical sweetness and vibrant color.",
        moistureStart: "85%",
        moistureEnd: "5%",
        shelfStart: "4 Days",
        shelfEnd: "12+ Months",
        products: ["Dried Rings", "Diced Candies", "Drink Powders", "Baking Ingredients"],
        benefits: ["Retains Vitamin C", "Volume Reduction", "Extended Shelf Life", "Versatile Use"],
        related: ["mango", "banana"]
    },
    {
        id: "tomato",
        name: "Tomato",
        category: "vegetables",
        emoji: "🍅",
        shortDesc: "Beat market gluts by creating premium tomato powder and flakes.",
        moistureStart: "95%",
        moistureEnd: "4%",
        shelfStart: "7 Days",
        shelfEnd: "18+ Months",
        products: ["Tomato Powder", "Sun-Dried Halves", "Soup Base", "Seasoning Flakes"],
        benefits: ["Survive Price Crashes", "Massive Weight Reduction", "Easy Storage", "High FMCG Demand"],
        related: ["chilli", "pepper"]
    },
    {
        id: "chilli",
        name: "Chilli",
        category: "spices",
        emoji: "🌶️",
        shortDesc: "Ensure perfect color retention and zero fungus growth.",
        moistureStart: "60%",
        moistureEnd: "8%",
        shelfStart: "10 Days",
        shelfEnd: "24+ Months",
        products: ["Dried Whole Chilli", "Chilli Flakes", "Fine Powder", "Spice Blends"],
        benefits: ["No Aflatoxin", "Bright Natural Color", "High Pungency Retention", "Export Grade Quality"],
        related: ["pepper", "tomato"]
    },
    {
        id: "coconut",
        name: "Coconut",
        category: "plantation",
        emoji: "🥥",
        shortDesc: "Produce high-grade desiccated coconut hygienically.",
        moistureStart: "50%",
        moistureEnd: "2%",
        shelfStart: "14 Days",
        shelfEnd: "12+ Months",
        products: ["Desiccated Coconut", "Coconut Chips", "Baking Supplies", "Oil Extraction Prep"],
        benefits: ["No Rancidity", "Snow White Color", "Fast Processing", "Hygienic Production"],
        related: ["coffee"]
    },
    {
        id: "curryleaves",
        name: "Curry Leaves",
        category: "herbs",
        emoji: "🌿",
        shortDesc: "Dry herbs rapidly while preserving aroma and green color.",
        moistureStart: "65%",
        moistureEnd: "5%",
        shelfStart: "4 Days",
        shelfEnd: "18+ Months",
        products: ["Dried Leaves", "Herb Powder", "Seasoning Mix", "Ayurvedic Base"],
        benefits: ["Aroma Locked In", "Vibrant Green Color", "Instant Rehydration", "High Export Value"],
        related: ["pepper", "chilli"]
    },
    {
        id: "coffee",
        name: "Coffee",
        category: "plantation",
        emoji: "☕",
        shortDesc: "Precision drying for specialty coffee beans.",
        moistureStart: "50%",
        moistureEnd: "11%",
        shelfStart: "10 Days",
        shelfEnd: "12+ Months",
        products: ["Parchment Coffee", "Dried Cherries", "Specialty Roasts Prep", "Export Beans"],
        benefits: ["Consistent Moisture", "No Mold", "Controlled Fermentation", "Premium Cup Score"],
        related: ["coconut"]
    },
    {
        id: "pepper",
        name: "Black Pepper",
        category: "spices",
        emoji: "🌶️",
        shortDesc: "Hygienic, rapid drying for export-grade black pepper.",
        moistureStart: "65%",
        moistureEnd: "10%",
        shelfStart: "7 Days",
        shelfEnd: "24+ Months",
        products: ["Whole Black Pepper", "Pepper Powder", "Cracked Pepper", "Spice Mixes"],
        benefits: ["Uniform Color", "Volatile Oil Preservation", "No Fungal Contamination", "Fast Processing"],
        related: ["chilli", "curryleaves"]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('crop-grid');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const modal = document.getElementById('crop-modal');
    const modalClose = document.getElementById('modal-close');

    // Render Grid
    function renderGrid(filter = 'all') {
        gridContainer.innerHTML = '';
        const filteredData = filter === 'all' ? cropData : cropData.filter(c => c.category === filter);
        
        filteredData.forEach(crop => {
            const card = document.createElement('div');
            card.className = 'crop-card';
            card.dataset.id = crop.id;
            
            card.innerHTML = `
                <div class="crop-img-placeholder">
                    ${crop.emoji}
                </div>
                <div class="crop-card-content">
                    <h3>${crop.name}</h3>
                    <p>${crop.shortDesc}</p>
                </div>
            `;
            
            card.addEventListener('click', () => openModal(crop.id));
            gridContainer.appendChild(card);
        });
    }

    // Category Filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGrid(btn.dataset.filter);
        });
    });

    // Open Modal
    function openModal(id) {
        const crop = cropData.find(c => c.id === id);
        if (!crop) return;

        // Populate Data
        document.getElementById('modal-title').textContent = crop.name;
        document.getElementById('modal-emoji-fresh').textContent = crop.emoji;
        document.getElementById('modal-emoji-dried').textContent = crop.emoji; // In real app, maybe a different image
        
        document.getElementById('modal-moisture-start').textContent = crop.moistureStart;
        document.getElementById('modal-moisture-end').textContent = crop.moistureEnd;
        
        document.getElementById('modal-shelf-start').textContent = crop.shelfStart;
        document.getElementById('modal-shelf-end').textContent = crop.shelfEnd;

        // Populate Products
        const productsList = document.getElementById('modal-products');
        productsList.innerHTML = '';
        crop.products.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p;
            productsList.appendChild(li);
        });

        // Populate Benefits
        const benefitsList = document.getElementById('modal-benefits');
        benefitsList.innerHTML = '';
        crop.benefits.forEach(b => {
            const li = document.createElement('li');
            li.textContent = b;
            benefitsList.appendChild(li);
        });

        // Populate Related
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
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Initial render
    renderGrid('all');
});
