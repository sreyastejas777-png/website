document.addEventListener('DOMContentLoaded', () => {
    const fabBtn = document.getElementById('fab-calc-btn');
    const modal = document.getElementById('calc-modal');
    const closeBtn = document.getElementById('calc-close');

    // Inputs
    const productType = document.getElementById('calc-product');
    const inputKg = document.getElementById('calc-input-kg');
    const powerCost = document.getElementById('calc-power');
    const batches = document.getElementById('calc-batches');

    // Outputs
    const resOutput = document.getElementById('res-output');
    const resMonthlyOutput = document.getElementById('res-monthly-output');
    const resPowerCost = document.getElementById('res-power-cost');

    // Toggle Modal
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    fabBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Calculation Logic
    function calculate() {
        const moistureLoss = parseFloat(productType.value) || 0.8;
        const inputWeight = parseFloat(inputKg.value) || 0;
        const powerRate = parseFloat(powerCost.value) || 0;
        const monthlyBatches = parseInt(batches.value) || 0;

        // Output Yield = Input * (1 - Moisture Loss)
        const outputYield = inputWeight * (1 - moistureLoss);
        
        // Monthly Output
        const monthlyTotal = outputYield * monthlyBatches;

        // Power Cost (Assuming 150kW machine running for avg 6 hours per batch)
        // Adjust these constants as needed for the specific machine model
        const kWhPerBatch = 150 * 6; 
        const costPerBatch = kWhPerBatch * powerRate;

        // Format and display
        resOutput.textContent = outputYield.toLocaleString(undefined, { maximumFractionDigits: 1 });
        resMonthlyOutput.textContent = monthlyTotal.toLocaleString(undefined, { maximumFractionDigits: 1 });
        resPowerCost.textContent = costPerBatch.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Add event listeners to all inputs
    [productType, inputKg, powerCost, batches].forEach(input => {
        input.addEventListener('input', calculate);
        input.addEventListener('change', calculate); // For the select dropdown
    });

    // Initial calculation
    calculate();
});
