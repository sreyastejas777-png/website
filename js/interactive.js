const componentData = {
    fans: {
        title: "Air Circulation Fans",
        desc: "High efficiency fans ensure uniform airflow throughout the chamber for consistent drying.",
        benefits: [
            "Uniform heat distribution",
            "Energy efficient operation",
            "Long life & low maintenance"
        ]
    },
    trays: {
        title: "SS Drying Trays",
        desc: "Food-grade stainless steel 304 trays optimized for maximum air contact with produce.",
        benefits: [
            "Zero contamination risk",
            "Easy to remove and wash",
            "High load bearing capacity"
        ]
    },
    chamber: {
        title: "Insulated Chamber",
        desc: "Advanced multi-layer thermal insulation traps heat inside, drastically reducing power consumption.",
        benefits: [
            "Minimal heat loss",
            "Lower electricity bills",
            "Safe exterior temperature"
        ]
    },
    heating: {
        title: "Heating System",
        desc: "Precision industrial heating elements that ramp up temperature quickly and maintain it flawlessly.",
        benefits: [
            "Rapid heat-up times",
            "Consistent drying cycles",
            "Auto cut-off safety feature"
        ]
    },
    control: {
        title: "Control Panel",
        desc: "Intuitive digital PLC interface allowing precise control over temperature and humidity profiles.",
        benefits: [
            "Programmable drying recipes",
            "Real-time moisture tracking",
            "User-friendly for operators"
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const hotspots = document.querySelectorAll('.hotspot');
    const sidebarItems = document.querySelectorAll('.sidebar-list li');
    const card = document.getElementById('info-card');
    const closeBtn = document.getElementById('close-card');
    
    const cardTitle = document.getElementById('card-title');
    const cardDesc = document.getElementById('card-desc');
    const cardBenefits = document.getElementById('card-benefits');

    function openCard(targetId) {
        const data = componentData[targetId];
        if (!data) return;

        // Update active states
        hotspots.forEach(h => h.classList.remove('active'));
        sidebarItems.forEach(s => s.classList.remove('active'));

        const hotspot = document.querySelector(`.hotspot[data-target="${targetId}"]`);
        const sidebarItem = document.querySelector(`.sidebar-list li[data-target="${targetId}"]`);
        
        if (hotspot) hotspot.classList.add('active');
        if (sidebarItem) sidebarItem.classList.add('active');

        const updateCard = () => {
            // Populate card data
            cardTitle.textContent = data.title;
            cardDesc.textContent = data.desc;
            
            cardBenefits.innerHTML = '';
            data.benefits.forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = benefit;
                cardBenefits.appendChild(li);
            });

            // Show card
            card.classList.add('active');
        };

        if (card.classList.contains('active')) {
            card.classList.remove('active');
            setTimeout(updateCard, 300); // wait for fade out
        } else {
            updateCard();
        }
    }

    function closeCardAction() {
        card.classList.remove('active');
        hotspots.forEach(h => h.classList.remove('active'));
        sidebarItems.forEach(s => s.classList.remove('active'));
    }

    // Event Listeners
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            openCard(hotspot.dataset.target);
        });
    });

    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            openCard(item.dataset.target);
        });
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCardAction();
    });

    // Close card when clicking outside
    document.addEventListener('click', (e) => {
        if (card.classList.contains('active') && !card.contains(e.target) && !e.target.classList.contains('hotspot')) {
            closeCardAction();
        }
    });
});
