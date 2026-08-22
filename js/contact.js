/* ==========================================================================
   DINANI HIGH SCHOOL — CONTACT FORM
   Front-end validation + a simulated send. Replace `simulateSend()` with
   a real request (e.g. to a mail-relay endpoint or backend route) once
   one exists — the validation and status-message UI can stay as-is.
   ========================================================================== */

(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusBox = document.getElementById('contact-form-status');

  function setError(field, message) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    const msg = group.querySelector('.form-error-msg');
    if (msg && message) msg.textContent = message;
  }

  function clearError(field) {
    const group = field.closest('.form-group');
    if (group) group.classList.remove('has-error');
  }

  function validate() {
    let valid = true;
    const name = form.querySelector('#contact-name');
    const email = form.querySelector('#contact-email');
    const phone = form.querySelector('#contact-phone');
    const subject = form.querySelector('#contact-subject');
    const message = form.querySelector('#contact-message');

    [name, email, subject, message].forEach(clearError);

    if (!name.value.trim()) { setError(name, 'Please enter your name.'); valid = false; }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError(email, 'Please enter a valid email address.');
      valid = false;
    }
    if (!subject.value) { setError(subject, 'Please choose a subject.'); valid = false; }
    if (!message.value.trim() || message.value.trim().length < 10) {
      setError(message, 'Please enter a message of at least 10 characters.');
      valid = false;
    }
    if (phone.value.trim() && !/^[0-9+\s()-]{6,}$/.test(phone.value.trim())) {
      setError(phone, 'Please enter a valid phone number.');
      valid = false;
    }

    return valid;
  }

  function simulateSend() {
    // --- BACKEND INTEGRATION POINT ---
    // Replace with a real request, e.g.:
    // return fetch('/api/contact', { method: 'POST', body: new FormData(form) });
    return new Promise((resolve) => setTimeout(resolve, 500));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusBox.className = 'form-status';

    if (!validate()) {
      statusBox.classList.add('is-error');
      statusBox.innerHTML = 'Please correct the highlighted fields and try again.';
      statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    await simulateSend();

    statusBox.classList.add('is-success');
    statusBox.innerHTML = 'Thank you — your message has been received. The school office will get back to you soon.';
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  form.addEventListener('input', (e) => clearError(e.target));
})();
