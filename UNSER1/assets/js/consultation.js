document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesContainer = document.getElementById('messages');
    const fieldButtons = document.querySelectorAll('.field');
    const chatTitle = document.getElementById('chatTitle');

    const advisorData = {
        business: {
            title: 'Business Consultation',
            welcome: 'Hello! I am your <strong>Business Consultation</strong> specialist. How can I help you optimize your operations or strategy today?'
        },
        technology: {
            title: 'Technology Consultation',
            welcome: 'Welcome to <strong>Technology Consultation</strong>. I can assist with AI implementation, software architecture, or digital transformation. What tech challenge are we solving?'
        },
        healthcare: {
            title: 'Healthcare Consultation',
            welcome: 'Greetings. As your <strong>Healthcare AI Advisor</strong>, I can help with health data analysis or medical tech inquiries. How can I assist you?'
        },
        legal: {
            title: 'Legal Consultation',
            welcome: 'Hello. I am the <strong>Legal AI Assistant</strong>. I can help you with document review or regulatory compliance questions. What do you need help with?'
        }
    };

    // Handle Field Selection
    fieldButtons.forEach(button => {
        button.addEventListener('click', () => {
            const field = button.getAttribute('data-field');
            
            // Update active state
            fieldButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update Chat Header
            chatTitle.innerText = advisorData[field].title;
            
            // Clear messages and add welcome
            messagesContainer.innerHTML = '';
            addMessage('consultant', advisorData[field].welcome);
        });
    });

    // Send Message Function
    function sendMessage() {
        const text = messageInput.value.trim();
        if (text === '') return;

        // Add User Message
        addMessage('user', text);
        messageInput.value = '';

        // Simulate AI Response
        setTimeout(() => {
            const activeField = document.querySelector('.field.active').getAttribute('data-field');
            const response = `I understand your request regarding ${activeField}. Let me analyze that for you... [This is a simulated AI response for the demo]`;
            addMessage('consultant', response);
        }, 1000);
    }

    // Add Message to UI
    function addMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const now = new Date();
        const timeStr = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

        const avatarSrc = type === 'consultant' ? 'assets/images/ai-consultant.png' : 'https://ui-avatars.com/api/?name=User&background=195de6&color=fff';

        messageDiv.innerHTML = `
            <div class="avatar-mini">
                <img src="${avatarSrc}" alt="${type}">
            </div>
            <div class="message-content">
                <p class="author">${type === 'consultant' ? 'Uniserve AI Advisor' : 'You'}</p>
                <div class="bubble">${text}</div>
                <span class="time">${timeStr}</span>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Event Listeners
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});
