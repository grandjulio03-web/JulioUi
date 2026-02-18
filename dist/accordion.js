// Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const btn = accordion.querySelector('.accordion-btn');
                const panel = accordion.querySelector('.accordion-panel');
                
                btn.addEventListener('click', function() {
                    const isOpen = accordion.classList.contains('is-open');
                    
                    // Close all other accordions
                    accordions.forEach(acc => {
                        if (acc !== accordion) {
                            acc.classList.remove('is-open');
                        }
                    });
                    
                    // Toggle current accordion
                    if (isOpen) {
                        accordion.classList.remove('is-open');
                    } else {
                        accordion.classList.add('is-open');
                    }
                });
            });
        });
