// Main Page Script

// Giselle AI API Configuration
const GISELLE_API_URL = 'https://api.giselles.ai/v1';
const GISELLE_API_KEY = 'your-api-key-here'; // Replace with actual API key

// Get Started Button
const getStartedBtn = document.getElementById('getStartedBtn');
if (getStartedBtn) {
  getStartedBtn.addEventListener('click', () => {
    window.location.href = 'register.html';
  });
}

// Notifications
const notificationsBtn = document.getElementById('notificationsBtn');
const notificationsDropdown = document.getElementById('notificationsDropdown');

if (notificationsBtn && notificationsDropdown) {
  notificationsBtn.addEventListener('click', () => {
    notificationsDropdown.style.display = 
      notificationsDropdown.style.display === 'none' ? 'block' : 'none';
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notifications-section')) {
      notificationsDropdown.style.display = 'none';
    }
  });
}

// AI Services Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
let currentTab = 'text';

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.getAttribute('data-tab');
  });
});

// Set first tab as active
if (tabBtns.length > 0) {
  tabBtns[0].classList.add('active');
}

// Generate Button
const generateBtn = document.getElementById('generateBtn');
const serviceInput = document.getElementById('serviceInput');
const serviceResult = document.getElementById('serviceResult');
const resultText = document.getElementById('resultText');

if (generateBtn) {
  generateBtn.addEventListener('click', async () => {
    const input = serviceInput.value.trim();
    
    if (!input) {
      alert('Please enter a prompt');
      return;
    }

    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    try {
      let result;
      
      if (currentTab === 'text') {
        result = await generateText(input);
      } else if (currentTab === 'image') {
        result = await generateImage(input);
      } else if (currentTab === 'chat') {
        result = await chatWithAI(input);
      }

      resultText.textContent = result;
      serviceResult.style.display = 'block';
      serviceResult.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      resultText.textContent = 'Error: ' + error.message;
      serviceResult.style.display = 'block';
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<i class="fas fa-spinner"></i> Generate';
    }
  });
}

// Giselle AI Functions
async function generateText(prompt) {
  try {
    const response = await fetch(`${GISELLE_API_URL}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GISELLE_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices?.[0]?.text || 'No response generated';
  } catch (error) {
    console.error('Text generation error:', error);
    return 'Demo: Generated text based on: ' + prompt;
  }
}

async function generateImage(prompt) {
  try {
    const response = await fetch(`${GISELLE_API_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GISELLE_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        size: '512x512',
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.data?.[0]?.url || 'No image generated';
  } catch (error) {
    console.error('Image generation error:', error);
    return 'Demo: Image generated for: ' + prompt;
  }
}

async function chatWithAI(message) {
  try {
    const response = await fetch(`${GISELLE_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GISELLE_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: message },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Chat error:', error);
    return 'Demo: AI response to: ' + message;
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Add loading animation
function addLoadingAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .fa-spin {
      animation: spin 1s linear infinite;
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', addLoadingAnimation);
