// ===================================
// Contact Form Handler
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const statusElement = document.getElementById('formStatus');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Disable button and show loading
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    statusElement.textContent = '';
    
    // Get form data
    const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        message: e.target.message.value
    };
    
    try {
        // Call your EC2 backend API
        const response = await fetch('https://api.yourcompany.com/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            statusElement.textContent = 'Message sent successfully! We\'ll get back to you soon.';
            statusElement.className = 'success';
            e.target.reset(); // Clear form
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);
        statusElement.textContent = 'Failed to send message. Please try again or email us directly.';
        statusElement.className = 'error';
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    }
}