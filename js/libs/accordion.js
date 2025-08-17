// Accordion functionality for Significant Others section
document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.significant-others__accordion-item');
    const visualImages = document.querySelectorAll('.significant-others__visual-img');
    
    if (accordionItems.length === 0) {
        return;
    }
    
    accordionItems.forEach((item, index) => {
        const header = item.querySelector('.significant-others__accordion-header');
        const content = item.querySelector('.significant-others__accordion-content');
        
        if (!header) {
            return;
        }
        
        // Click event handler
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleAccordion(item, index);
        });
        
        // Set proper ARIA attributes
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        if (content) content.setAttribute('aria-hidden', 'true');
    });
    
    function toggleAccordion(clickedItem, itemIndex) {
        const isActive = clickedItem.classList.contains('significant-others__accordion-item--active');
        const header = clickedItem.querySelector('.significant-others__accordion-header');
        const content = clickedItem.querySelector('.significant-others__accordion-content');
        
        // Close all accordion items
        accordionItems.forEach(item => {
            const otherHeader = item.querySelector('.significant-others__accordion-header');
            const otherContent = item.querySelector('.significant-others__accordion-content');
            
            item.classList.remove('significant-others__accordion-item--active');
            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            if (otherContent) otherContent.setAttribute('aria-hidden', 'true');
        });
        
        // Hide all visual images
        visualImages.forEach(img => {
            img.classList.remove('significant-others__visual-img--active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            clickedItem.classList.add('significant-others__accordion-item--active');
            if (header) header.setAttribute('aria-expanded', 'true');
            if (content) content.setAttribute('aria-hidden', 'false');
            
            // Show corresponding visual image
            const targetImage = document.querySelector(`.significant-others__visual-img[data-accordion="${itemIndex}"]`);
            if (targetImage) {
                targetImage.classList.add('significant-others__visual-img--active');
            }
        }
    }
    
    // Auto-open second item (iPhone and Apple Watch) on page load
    setTimeout(() => {
        if (accordionItems.length > 1) {
            toggleAccordion(accordionItems[1], 1);
        }
    }, 1000);
});
