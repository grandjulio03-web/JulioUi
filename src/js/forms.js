/* ===================== Jforces Form Framework ===================== */

/**
 * Auto-adjust form container height based on label transitions
 * Prevents layout shifts and maintains smooth animations
 */

class FormLabelManager {
  constructor() {
    this.init();
  }

  init() {
    // Process all form groups on page load
    this.processAllFormGroups();
    
    // Set up mutation observer for dynamic content
    this.setupMutationObserver();
    
    // Set up resize observer for responsive changes
    this.setupResizeObserver();
  }

  processAllFormGroups() {
    const formGroups = document.querySelectorAll('.group');
    formGroups.forEach(group => this.processFormGroup(group));
  }

  processFormGroup(group) {
    const input = group.querySelector('input, select, textarea');
    const label = group.querySelector('.label');
    
    if (!input || !label) return;

    // Store initial dimensions
    this.storeInitialDimensions(group, input, label);
    
    // Set up event listeners for this specific group
    this.setupGroupListeners(group, input, label);
    
    // Calculate initial height
    this.calculateGroupHeight(group);
  }

  storeInitialDimensions(group, input, label) {
    // Store original height
    const rect = group.getBoundingClientRect();
    group.dataset.originalHeight = rect.height;
    
    // Store label positions
    const labelRect = label.getBoundingClientRect();
    const groupRect = group.getBoundingClientRect();
    label.dataset.originalTop = labelRect.top - groupRect.top;
    label.dataset.bottomTop = groupRect.height - labelRect.height + 8; // 8px for margin
  }

  setupGroupListeners(group, input, label) {
    // Focus events
    input.addEventListener('focus', () => this.handleFocus(group, label));
    input.addEventListener('blur', () => this.handleBlur(group, label));
    
    // Input events for placeholder changes
    input.addEventListener('input', () => this.handleInput(group, label));
    
    // Select change events
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => this.handleInput(group, label));
    }
  }

  handleFocus(group, label) {
    this.transitionLabelToBottom(group, label);
  }

  handleBlur(group, label) {
    const input = group.querySelector('input, select, textarea');
    if (input && !input.value && input.tagName !== 'SELECT') {
      this.transitionLabelToTop(group, label);
    } else if (input && input.tagName === 'SELECT' && !input.value) {
      this.transitionLabelToTop(group, label);
    }
  }

  handleInput(group, label) {
    const input = group.querySelector('input, select, textarea');
    if (input && (input.value || (input.tagName === 'SELECT' && input.value))) {
      this.transitionLabelToBottom(group, label);
    } else {
      this.transitionLabelToTop(group, label);
    }
  }

  transitionLabelToBottom(group, label) {
    // Calculate target height
    const inputHeight = parseFloat(getComputedStyle(group.querySelector('input, select, textarea')).height);
    const labelHeight = parseFloat(getComputedStyle(label).height);
    const targetHeight = inputHeight + labelHeight + 16; // 16px for margins
    
    // Smooth height transition
    this.animateHeight(group, targetHeight);
    
    // Update label position
    label.style.top = '100%';
    label.style.marginTop = '0.5rem';
    label.style.left = '0';
  }

  transitionLabelToTop(group, label) {
    // Return to original height
    const originalHeight = parseFloat(group.dataset.originalHeight);
    this.animateHeight(group, originalHeight);
    
    // Reset label position
    label.style.top = '0.75rem';
    label.style.marginTop = '0';
    label.style.left = '1rem';
  }

  animateHeight(element, targetHeight) {
    const startHeight = element.offsetHeight;
    const duration = 400; // Match CSS transition duration
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function matching CSS cubic-bezier(0.4, 0, 0.2, 1)
      const easeProgress = this.easeOutCubic(progress);
      
      const currentHeight = startHeight + (targetHeight - startHeight) * easeProgress;
      element.style.height = `${currentHeight}px`;
      element.style.minHeight = `${currentHeight}px`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final height is set correctly
        element.style.height = `${targetHeight}px`;
        element.style.minHeight = `${targetHeight}px`;
      }
    };

    requestAnimationFrame(animate);
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  calculateGroupHeight(group) {
    const input = group.querySelector('input, select, textarea');
    const label = group.querySelector('.label');
    
    if (!input || !label) return;

    const inputHeight = parseFloat(getComputedStyle(input).height);
    const labelHeight = parseFloat(getComputedStyle(label).height);
    const labelTop = parseFloat(label.style.top) || 0.75;
    
    // Check if label is at bottom
    const isLabelAtBottom = label.style.top === '100%';
    
    let targetHeight;
    if (isLabelAtBottom) {
      targetHeight = inputHeight + labelHeight + 16; // 16px for margins
    } else {
      targetHeight = Math.max(inputHeight, labelTop + labelHeight + 16);
    }
    
    group.style.height = `${targetHeight}px`;
    group.style.minHeight = `${targetHeight}px`;
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList && node.classList.contains('group')) {
                this.processFormGroup(node);
              } else {
                // Check for form groups within added nodes
                const formGroups = node.querySelectorAll && node.querySelectorAll('.group');
                if (formGroups) {
                  formGroups.forEach(group => this.processFormGroup(group));
                }
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      this.processAllFormGroups();
    });

    // Observe all form groups
    document.querySelectorAll('.group').forEach(group => {
      resizeObserver.observe(group);
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FormLabelManager();
  });
} else {
  new FormLabelManager();
}

// Export for manual initialization if needed
window.FormLabelManager = FormLabelManager;
