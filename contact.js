const contactForm = document.getElementById('contactForm');
const sendButton = document.getElementById('sendButton');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (sendButton.disabled) return;
    const name = document.getElementById('nameText').value.trim();
    const email = document.getElementById('emailText').value.trim();
    const subject = document.getElementById('subjectText').value.trim();
    const message = document.getElementById('messageText').value.trim();
    formStatus.dataset.state = 'error';
    if (!name || !message) {
        formStatus.textContent = 'Please enter your name and a message.';
        document.getElementById(!name ? 'nameText' : 'messageText').focus();
        return;
    }
    const now = Date.now();
    let history = [];
    try {
        const saved = JSON.parse(localStorage.getItem('submissionHistory') || '[]');
        if (Array.isArray(saved)) history = saved.filter(time => Number.isFinite(time) && now - time < 15 * 60 * 1000);
    } catch (_) { /* Sending still works when browser storage is unavailable. */ }
    if (history.length >= 5) {
        formStatus.textContent = 'You’ve sent several messages recently. Please try again in 15 minutes.';
        return;
    }
    if (!window.emailjs) {
        formStatus.textContent = 'The message service couldn’t load. Please refresh and try again.';
        return;
    }
    sendButton.disabled = true;
    sendButton.textContent = 'Sending…';
    contactForm.setAttribute('aria-busy', 'true');
    formStatus.dataset.state = 'pending';
    formStatus.textContent = 'Sending your message…';
    try {
        emailjs.init('yufLtDwDBZjq5j2mF');
        await emailjs.send('service_zutcgda', 'template_nylct2n', {
            email, message, reply_to: email, subject, from_name: name
        });
        try { localStorage.setItem('submissionHistory', JSON.stringify([...history, now])); } catch (_) {}
        contactForm.reset();
        formStatus.dataset.state = 'success';
        formStatus.textContent = 'Your message has been sent. Thanks for reaching out!';
    } catch (_) {
        formStatus.dataset.state = 'error';
        formStatus.textContent = 'Your message couldn’t be sent. Please try again.';
    } finally {
        sendButton.disabled = false;
        sendButton.textContent = 'Send message';
        contactForm.removeAttribute('aria-busy');
    }
});
