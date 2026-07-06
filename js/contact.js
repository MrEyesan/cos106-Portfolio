/* ============================================================
   CONTACT FORM – contact.js
   JS validation: name, email format, phone digits, message
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      showSuccess();
    }
  });

  // Live validation — clear error once user fixes the field
  ['fname', 'email', 'phone', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id));
  });
});

// ── Validate ─────────────────────────────────────────────────
function validateForm() {
  let valid = true;
  clearAllErrors();

  const fname   = document.getElementById('fname').value.trim();
  const email   = document.getElementById('email').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();

  // Name: required, at least 2 characters
  if (!fname) {
    showError('fname', 'Full name is required.');
    valid = false;
  } else if (fname.length < 2) {
    showError('fname', 'Name must be at least 2 characters.');
    valid = false;
  }

  // Email: required + valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError('email', 'Email address is required.');
    valid = false;
  } else if (!emailRegex.test(email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }

  // Phone: required, digits only, 7–15 chars
  const phoneClean = phone.replace(/[\s\-\+\(\)]/g, '');
  if (!phone) {
    showError('phone', 'Phone number is required.');
    valid = false;
  } else if (!/^\d+$/.test(phoneClean)) {
    showError('phone', 'Phone number must contain digits only.');
    valid = false;
  } else if (phoneClean.length < 7 || phoneClean.length > 15) {
    showError('phone', 'Phone number must be between 7 and 15 digits.');
    valid = false;
  }

  // Message: required, at least 10 characters
  if (!message) {
    showError('message', 'Message is required.');
    valid = false;
  } else if (message.length < 10) {
    showError('message', 'Message must be at least 10 characters long.');
    valid = false;
  }

  return valid;
}

// ── Helpers ──────────────────────────────────────────────────
function showError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(fieldId + 'Err');
  if (field) field.classList.add('error');
  if (err)   err.textContent = msg;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(fieldId + 'Err');
  if (field) field.classList.remove('error');
  if (err)   err.textContent = '';
}

function clearAllErrors() {
  ['fname', 'email', 'phone', 'message'].forEach(clearError);
}

function showSuccess() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form)    form.style.display    = 'none';
  if (success) success.classList.add('visible');
  // Scroll to the success message
  if (success) success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
