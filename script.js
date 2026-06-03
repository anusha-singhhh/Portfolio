// Dynamic year
const currentYear = document.getElementById('current-year');
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Smooth fade-in on scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Responsive mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const navMenu = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
});

navLinks.forEach(link => link.addEventListener('click', () => {
    navMenu?.classList.remove('active');
}));

const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', handleSubmit);

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current ? 'var(--rose-deep)' : '';
    });
});

function setStatus(message, success = false) {
    const statusEl = document.getElementById('contact-status');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.classList.toggle('success', success);
    statusEl.classList.toggle('error', !success);

    const btn = document.querySelector('.btn-send');
    if (btn) {
        btn.classList.toggle('success', success);
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.btn-send');
    const originalText = btn ? btn.textContent : 'Send Message';
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
        setStatus('Please complete all fields before sending.', false);
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
    }
    setStatus('Sending your message...');

    const formData = new FormData(form);
    formData.set('access_key', '579408e4-68c3-42d3-a0ce-db799b07ac62');
    formData.set('subject', 'New message from portfolio website');
    formData.set('name', name);
    formData.set('email', email);
    formData.set('message', message);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        console.log('Web3Forms response:', result);

        if (!response.ok || result.success !== true) {
            throw new Error(result.message || 'Unable to send message');
        }

        setStatus('Message sent successfully! I will reply soon. 💌', true);
        if (btn) btn.textContent = 'Sent!';
        form.reset();
    } catch (error) {
        console.error('Web3Forms error:', error);
        setStatus('Oops, something went wrong. Please try again or email me directly.', false);
        if (btn) btn.textContent = 'Try Again';
    } finally {
        if (btn) {
            btn.disabled = false;
            setTimeout(() => {
                btn.textContent = originalText;
            }, 3000);
        }
    }
}

window.handleSubmit = handleSubmit;
