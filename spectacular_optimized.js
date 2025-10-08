/*
 * Spectacular JavaScript Effects - Optimized Version
 * - Particle system
 * - Interactive animations
 * - Dynamic enhancements
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all spectacular effects
  initSpectacularEffects();
});

/**
 * Initialize all spectacular effects at once
 */
function initSpectacularEffects() {
  // Initialize background effects
  initBackgroundEffects();
  
  // Initialize particle system
  initParticles();
  
  // Initialize fade-in animations
  initFadeInAnimations();
  
  // Initialize scroll effects
  initScrollEffects();
  
  // Initialize hover effects
  initHoverEffects();
  
  // Initialize responsive adjustments
  initResponsiveAdjustments();
  
  // Initialize smooth scrolling
  initSmoothScroll();
  
  // Initialize scroll reveal animations
  revealOnScroll();
  
  // Initialize audio effects
  initAudioEffects();
  
  // Cleanup on page unload
  window.addEventListener('unload', cleanupSpectacularEffects);
}

/**
 * Cleanup function to prevent memory leaks
 */
function cleanupSpectacularEffects() {
  // Store intervals and timeouts in a central place for cleanup
  if (window.spectacularIntervals) {
    window.spectacularIntervals.forEach(id => clearInterval(id));
  }
  
  // Disconnect all observers
  if (window.spectacularObservers) {
    window.spectacularObservers.forEach(observer => observer.disconnect());
  }
}

/**
 * Throttle function to limit the rate at which a function can fire
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Initialize advanced background effects
 */
function initBackgroundEffects() {
  // Create scanlines effect
  const scanlines = document.createElement('div');
  scanlines.classList.add('scanlines');
  document.body.appendChild(scanlines);
  
  // Create and configure grid layers
  const gridPattern = document.querySelector('.grid-pattern');
  if (gridPattern) {
    // Create layer 1
    const layer1 = document.createElement('div');
    layer1.classList.add('grid-layer', 'grid-layer-1');
    gridPattern.appendChild(layer1);
    
    // Create layer 2
    const layer2 = document.createElement('div');
    layer2.classList.add('grid-layer', 'grid-layer-2');
    gridPattern.appendChild(layer2);
    
    // Create layer 3
    const layer3 = document.createElement('div');
    layer3.classList.add('grid-layer', 'grid-layer-3');
    gridPattern.appendChild(layer3);
  }
}

/**
 * Initialize particle system
 */
function initParticles() {
  const particlesContainer = document.querySelector('.particles-container');
  if (!particlesContainer) return;
  
  // Store intervals for cleanup
  if (!window.spectacularIntervals) window.spectacularIntervals = [];
  
  const particleCount = 15; // Reduced particle count for performance
  
  // Create initial particles
  for (let i = 0; i < Math.min(8, particleCount); i++) { // Start with fewer particles
    const particleType = Math.floor(Math.random() * 4);
    createParticle(particleType);
  }
  
  // Create remaining particles with a delay to stagger creation
  for (let i = 8; i < particleCount; i++) {
    setTimeout(() => {
      if (particlesContainer) {
        const particleType = Math.floor(Math.random() * 4);
        createParticle(particleType);
      }
    }, i * 100);
  }
  
  // Create new particles periodically with increased interval
  const particleInterval = setInterval(() => {
    if (particlesContainer && particlesContainer.children.length < particleCount) {
      const particleType = Math.floor(Math.random() * 4);
      createParticle(particleType);
    }
  }, 1000); // Increased from 500ms to 1000ms
  
  window.spectacularIntervals.push(particleInterval);
}

/**
 * Create a single particle with specified type
 * @param {number} type - Particle type (0-3)
 */
function createParticle(type = 0) {
  const particlesContainer = document.querySelector('.particles-container');
  if (!particlesContainer) return;
  
  const particle = document.createElement('div');
  particle.classList.add('particle');
  
  // Random properties
  const size = Math.random() * 80 + 30; // Smaller particle sizes for performance
  const x = Math.random() * 100;
  let duration = Math.random() * 15 + 10;
  const delay = Math.random() * 5; // Shorter delay for faster startup
  const opacity = Math.random() * 0.2 + 0.05; // Reduced opacity
  
  // Set particle color based on type and page
  let particleColor = 'rgba(0, 255, 128, 0.7)'; // Default green
  if (window.location.pathname.includes('timebound')) {
    particleColor = 'rgba(75, 118, 180, 0.7)'; // Blue for timebound
  } else if (window.location.pathname.includes('teams')) {
    particleColor = 'rgba(255, 215, 0, 0.7)'; // Yellow
  }
  
  switch(type) {
    case 1:
      particleColor = 'rgba(0, 255, 255, 0.7)'; // Cyan
      break;
    case 2:
      particleColor = 'rgba(255, 0, 255, 0.7)'; // Pink
      duration *= 0.7; // Make neon colors move faster
      break;
    case 3:
      particleColor = 'rgba(255, 255, 0, 0.7)'; // Yellow
      duration *= 0.7; // Make neon colors move faster
      break;
  }
  
  // Apply gradient for a more dynamic look
  particle.style.background = `radial-gradient(circle, ${particleColor}, transparent 70%)`;
  
  // Apply styles
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${x}%`;
  particle.style.bottom = `-${size}px`; // Start below the viewport
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `${delay}s`;
  particle.style.opacity = `${opacity}`;
  
  // Use will-change for better animation performance
  particle.style.willChange = 'transform, opacity';
  
  // Add to container
  particlesContainer.appendChild(particle);
  
  // Remove particle after animation completes
  setTimeout(() => {
    if (particlesContainer && particle.parentNode === particlesContainer) {
      // Fade out before removing
      particle.style.transition = 'opacity 0.5s ease';
      particle.style.opacity = '0';
      setTimeout(() => {
        if (particle.parentNode === particlesContainer) {
          particlesContainer.removeChild(particle);
        }
      }, 500);
    }
  }, (duration + delay) * 1000);
}

/**
 * Initialize fade-in animations for elements
 */
function initFadeInAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in');
  if (!animatedElements.length) return;
  
  // Store observers for cleanup
  if (!window.spectacularObservers) window.spectacularObservers = [];
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger earlier
  });
  
  animatedElements.forEach(element => {
    element.style.animationPlayState = 'paused';
    observer.observe(element);
  });
  
  window.spectacularObservers.push(observer);
}

/**
 * Initialize scroll effects
 */
function initScrollEffects() {
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');
  
  // Throttle scroll event for better performance
  const throttledScroll = throttle(() => {
    // Navbar scroll effect
    if (nav) {
      if (window.scrollY > 50) {
        nav.style.padding = '15px 30px';
        // Use different nav shadow color based on current page
        if (window.location.pathname.includes('timebound')) {
          nav.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.4), 0 0 20px rgba(75, 118, 180, 0.2)';
        } else if (window.location.pathname.includes('teams')) {
          nav.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.2)'; // Yellow shadow
        } else {
          nav.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 255, 128, 0.2)';
        }
      } else {
        nav.style.padding = '20px 30px';
        nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
      }
    }
    
    // Parallax effect for hero section
    if (hero) {
      requestAnimationFrame(() => {
        const scrollPos = window.scrollY;
        hero.style.backgroundPositionY = `${scrollPos * 0.5}px`;
      });
    }
  }, 16); // ~60fps
  
  window.addEventListener('scroll', throttledScroll);
}

/**
 * Initialize hover effects for interactive elements
 */
function initHoverEffects() {
  // Button ripple effect
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mousedown', (e) => {
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('ripple');
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Enhanced card hover effect with performance optimizations
  const cards = document.querySelectorAll('.event-card, .card');
  
  // Reuse mouse move handler for all cards
  const handleCardMouseMove = (card, e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt based on cursor position
    const tiltX = (y - centerY) / 15;
    const tiltY = (centerX - x) / 15;
    
    // Calculate distance from center for glow intensity
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
    const glowIntensity = 1 - (distance / maxDistance);
    
    // Create dynamic glow color based on cursor position
    const hue = (x / rect.width) * 180; // 0-180 for green to blue
    const glowColor = `hsla(${hue}, 100%, 50%, ${0.3 * glowIntensity})`;
    
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
      // Apply transform with enhanced perspective
      card.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
      
      // Create multi-layered box shadow for depth
      card.style.boxShadow = 
        `0 20px 40px rgba(0, 0, 0, 0.5), 
         0 0 30px ${glowColor}, 
         inset 0 0 20px ${glowColor}`;
      
      // Position and animate the glow element
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, ${glowColor}, transparent 70%)`;
        glow.style.opacity = '0.6';
      }
      
      // Add subtle gradient slide animation
      // Use different card gradient based on current page
      if (window.location.pathname.includes('timebound')) {
        card.style.backgroundImage = `linear-gradient(135deg, rgba(75, 118, 180, 0.05), rgba(115, 169, 255, 0.05))`;
      } else if (window.location.pathname.includes('teams')) {
        card.style.backgroundImage = `linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 240, 128, 0.05))`; // Yellow gradient
      } else {
        card.style.backgroundImage = `linear-gradient(135deg, rgba(232, 76, 94, 0.05), rgba(75, 118, 180, 0.05))`;
      }
      card.style.backgroundSize = '200% 200%';
      card.style.backgroundPosition = `${x / rect.width * 100}% ${y / rect.height * 100}%`;
    });
  };
  
  cards.forEach(card => {
    // Create a glow element for the card
    const glow = document.createElement('div');
    glow.classList.add('card-glow');
    glow.style.position = 'absolute';
    glow.style.width = '100%';
    glow.style.height = '100%';
    glow.style.borderRadius = 'inherit';
    glow.style.pointerEvents = 'none';
    glow.style.zIndex = '-1';
    glow.style.opacity = '0';
    glow.style.transition = 'opacity 0.3s ease';
    card.appendChild(glow);
    
    // Make sure card has position relative
    if (getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }
    
    // Add will-change for better performance
    card.style.willChange = 'transform, box-shadow, background-position';
    
    // Add event listeners
    card.addEventListener('mousemove', (e) => handleCardMouseMove(card, e));
    
    card.addEventListener('mouseleave', () => {
      // Smooth return to original state
      card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale(1)';
      card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
      card.style.backgroundImage = '';
      
      // Fade out glow
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.opacity = '0';
      }
    });
  });
}

/**
 * Initialize responsive adjustments
 */
function initResponsiveAdjustments() {
  // Adjust particle count based on window size
  function adjustParticleCount() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    const windowWidth = window.innerWidth;
    const currentCount = particlesContainer.children.length;
    const targetCount = windowWidth < 768 ? 5 : 10; // Reduced for better mobile performance
    
    // Only add particles if needed (don't remove existing ones abruptly)
    if (currentCount < targetCount) {
      // Add particles gradually
      const particlesToAdd = targetCount - currentCount;
      for (let i = 0; i < particlesToAdd; i++) {
        setTimeout(() => {
          const particleType = Math.floor(Math.random() * 4);
          createParticle(particleType);
        }, i * 200);
      }
    }
  }
  
  // Initial adjustment
  adjustParticleCount();
  
  // Throttle resize event
  const throttledResize = throttle(adjustParticleCount, 200);
  window.addEventListener('resize', throttledResize);
}

/**
 * Scroll reveal animation utility
 */
function revealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;
  
  // Store observers for cleanup
  if (!window.spectacularObservers) window.spectacularObservers = [];
  
  // Use Intersection Observer instead of scroll event for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger earlier
  });
  
  revealElements.forEach(element => {
    observer.observe(element);
  });
  
  window.spectacularObservers.push(observer);
}

/**
 * Generate random color within theme palette
 */
function getRandomThemeColor() {
  const colors = ['#00ff80', '#00e0c0', '#00ffff', '#9d4edd', '#ffd700'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Smooth scroll to section
 */
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Add event listeners to navigation links for smooth scrolling
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      smoothScrollTo(targetId);
    });
  });
}

/**
 * Initialize audio effects system
 */
function initAudioEffects() {
  // Audio context for better performance
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return; // Browser doesn't support Web Audio API
  
  let audioCtx = null;
  let engineSoundNode = null;
  let clickSoundNode = null;
  let isEnginePlaying = false;
  let audioInitialized = false;
  
  // Initialize audio on first user interaction to comply with browser policies
  function initializeAudio() {
    if (!audioInitialized && AudioContext) {
      audioCtx = new AudioContext();
      audioInitialized = true;
      // Play a tiny silent sound to unlock audio
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      gainNode.gain.value = 0;
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    }
    return audioCtx;
  }
  
  // Function to create and play engine sound
  function playEngineSound() {
    if (!initializeAudio()) return;
    
    // If engine sound is already playing, don't create a new one
    if (isEnginePlaying && engineSoundNode) return;
    
    // Create oscillator for engine sound
    engineSoundNode = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Set up engine-like sound
    engineSoundNode.type = 'sawtooth';
    engineSoundNode.frequency.value = 80;
    gainNode.gain.value = 0.1;
    
    // Connect nodes
    engineSoundNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Start engine sound
    engineSoundNode.start();
    isEnginePlaying = true;
    
    // Rev effect
    let revInterval = setInterval(() => {
      if (!isEnginePlaying) {
        clearInterval(revInterval);
        return;
      }
      engineSoundNode.frequency.value = 80 + Math.random() * 40;
    }, 200);
  }
  
  // Function to stop engine sound
  function stopEngineSound() {
    if (engineSoundNode && isEnginePlaying) {
      const gainNode = engineSoundNode.context.createGain();
      engineSoundNode.connect(gainNode);
      gainNode.connect(engineSoundNode.context.destination);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      
      setTimeout(() => {
        if (engineSoundNode) {
          engineSoundNode.stop();
          engineSoundNode = null;
        }
        isEnginePlaying = false;
      }, 500);
    }
  }
  
  // Function to play click sound (race start)
  function playClickSound() {
    if (!initializeAudio()) return;
    
    // Create click sound (like a race start)
    clickSoundNode = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    clickSoundNode.type = 'square';
    clickSoundNode.frequency.value = 523; // C5 note
    gainNode.gain.value = 0.2;
    
    // Connect nodes
    clickSoundNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Start sound
    clickSoundNode.start();
    
    // Quick fade out
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    // Stop after short duration
    setTimeout(() => {
      if (clickSoundNode) {
        clickSoundNode.stop();
        clickSoundNode = null;
      }
    }, 300);
  }
  
  // Add initial user interaction to unlock audio
  document.addEventListener('click', initializeAudio, { once: true });
  document.addEventListener('keydown', initializeAudio, { once: true });
  
  // Add hover effects with sound to event buttons
  const eventButtons = document.querySelectorAll('.event-btn, .btn');
  eventButtons.forEach(button => {
    // Add mouseover event for engine sound
    button.addEventListener('mouseenter', () => {
      playEngineSound();
    });
    
    // Add mouseleave event to stop engine sound
    button.addEventListener('mouseleave', () => {
      // Delay stopping to allow for continuous sound if moving between buttons
      setTimeout(() => {
        // Check if mouse is still over any button before stopping
        const anyButtonHovered = Array.from(eventButtons).some(btn => {
          const rect = btn.getBoundingClientRect();
          return mouseX >= rect.left && mouseX <= rect.right && 
                 mouseY >= rect.top && mouseY <= rect.bottom;
        });
        
        if (!anyButtonHovered) {
          stopEngineSound();
        }
      }, 100);
    });
    
    // Add click sound
    button.addEventListener('click', () => {
      playClickSound();
      // Stop engine sound after click
      stopEngineSound();
    });
  });
  
  // Track mouse position globally for hover detection
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
}

/**
 * Export public functions
 */
window.spectacular = {
  initParticles,
  initFadeInAnimations,
  initScrollEffects,
  initHoverEffects,
  initResponsiveAdjustments,
  revealOnScroll,
  getRandomThemeColor,
  smoothScrollTo,
  initSmoothScroll,
  initAudioEffects
};