/**
 * Spectacular JavaScript Effects
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
  
  const particleCount = 40; // Increased number of particles
  
  for (let i = 0; i < particleCount; i++) {
    // Create different types of particles with varying colors
    const particleType = Math.floor(Math.random() * 4);
    createParticle(particleType);
  }
  
  // Create new particles periodically
  setInterval(() => {
    if (particlesContainer && particlesContainer.children.length < particleCount) {
      const particleType = Math.floor(Math.random() * 4);
      createParticle(particleType);
    }
  }, 500);
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
  const size = Math.random() * 100 + 50; // Size between 50px and 150px
  const x = Math.random() * 100; // X position (percentage)
  let duration = Math.random() * 15 + 10; // Duration between 10s and 25s
  const delay = Math.random() * 10; // Random delay
  const opacity = Math.random() * 0.3 + 0.1; // Random opacity
  
  // Set particle color based on type
  // Use different particle colors based on the current page
  let particleColor = 'rgba(0, 255, 128, 0.7)'; // Default green
  if (window.location.pathname.includes('timebound')) {
    particleColor = 'rgba(75, 118, 180, 0.7)'; // Blue for timebound
  }
  // For teams pages, use yellow color
  else if (window.location.pathname.includes('teams')) {
    particleColor = 'rgba(255, 215, 0, 0.7)'; // Yellow
  }
  
  switch(type) {
    case 1:
      particleColor = 'rgba(0, 255, 255, 0.7)'; // Cyan
      break;
    case 2:
      particleColor = 'rgba(255, 0, 255, 0.7)'; // Pink
      break;
    case 3:
      particleColor = 'rgba(255, 255, 0, 0.7)'; // Yellow
      break;
  }
  
  // Apply gradient for a more dynamic look
  particle.style.background = `radial-gradient(circle, ${particleColor}, transparent 70%)`;
  
  // Adjust duration for different particle types
  if (type === 2 || type === 3) {
    duration *= 0.7; // Make neon colors move faster
  }
  
  // Apply styles
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${x}%`;
  particle.style.bottom = `-${size}px`; // Start below the viewport
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `${delay}s`;
  particle.style.opacity = `${opacity}`;
  
  // Add to container
  particlesContainer.appendChild(particle);
  
  // Remove particle after animation completes
  setTimeout(() => {
    if (particlesContainer && particle.parentNode === particlesContainer) {
      particlesContainer.removeChild(particle);
    }
  }, (duration + delay) * 1000);
}

/**
 * Initialize fade-in animations for elements
 */
function initFadeInAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in');
  if (!animatedElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  animatedElements.forEach(element => {
    element.style.animationPlayState = 'paused';
    observer.observe(element);
  });
}

/**
 * Initialize scroll effects
 */
function initScrollEffects() {
  const nav = document.querySelector('.nav');
  
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
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
    const hero = document.querySelector('.hero');
    if (hero) {
      const scrollPos = window.scrollY;
      hero.style.backgroundPositionY = `${scrollPos * 0.5}px`;
    }
  });
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
  
  // Enhanced card hover effect with dynamic cursor following and multi-color glows
  const cards = document.querySelectorAll('.event-card, .card');
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
    
    card.addEventListener('mousemove', (e) => {
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
      
      // Create glow color leaning red (removes green)
      const glowColor = `hsla(0, 85%, 60%, ${0.3 * glowIntensity})`;
      
      // Apply transform with enhanced perspective
      card.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
      
      // Create multi-layered box shadow for depth
      card.style.boxShadow = 
        `0 20px 40px rgba(0, 0, 0, 0.5), 
         0 0 30px ${glowColor}, 
         inset 0 0 20px ${glowColor}`;
      
      // Position and animate the glow element
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, ${glowColor}, transparent 70%)`;
      glow.style.opacity = '0.6';
      
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
  // Adjust particle count based on window size - reduced particle count as requested
  function adjustParticleCount() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    const windowWidth = window.innerWidth;
    const currentCount = particlesContainer.children.length;
    const targetCount = windowWidth < 768 ? 8 : 15; // Reduced from 15/30 to 8/15
    
    if (currentCount < targetCount) {
      for (let i = 0; i < targetCount - currentCount; i++) {
        const particleType = Math.floor(Math.random() * 4);
        createParticle(particleType);
      }
    }
  }
  
  // Initial adjustment
  adjustParticleCount();
  
  // Adjust on resize
  window.addEventListener('resize', adjustParticleCount);
}

/**
 * Scroll reveal animation utility
 */
function revealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;
  
  const reveal = () => {
    revealElements.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', reveal);
  // Initial check
  reveal();
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