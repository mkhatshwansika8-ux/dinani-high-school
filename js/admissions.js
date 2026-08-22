/* ==========================================================================
   DINANI HIGH SCHOOL — ADMISSIONS APPLICATION
   ==========================================================================
   FRONT-END PROTOTYPE NOTICE
   This form is a fully working client-side prototype. Nothing typed here
   is sent to a server or saved in a database yet — everything lives in
   the in-memory `applicationData` object below for the duration of the
   page visit only.

   TO CONNECT A REAL BACKEND:
   1. Replace the `simulateSubmission()` function with a real network
      request, e.g.:
        const res = await fetch('/api/admissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(applicationData)
        });
      (File uploads would need `FormData` instead of JSON — see the
      "Documents" section below for where the File objects are held.)
   2. Replace `generateReferenceNumber()` with the reference number
      returned by the server, instead of the client-side placeholder.
   3. Everything else (stepper, validation, review screen) can stay as-is.
   ========================================================================== */

(function () {
  'use strict';

  const form = document.getElementById('admissions-form');
  if (!form) return; // Only run this script on admissions.html

  const steps = Array.from(document.querySelectorAll('.form-step'));
  const stepperItems = Array.from(document.querySelectorAll('.stepper li'));
  let currentStep = 0;

  // Single source of truth for everything the applicant has entered.
  // Step 4 (Review) is rendered directly from this object.
  const applicationData = {
    student: {},
    guardian: {},
    documents: {}
  };

  /* ------------------------------------------------------------------
     Step navigation
     ------------------------------------------------------------------ */
  function showStep(index) {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    stepperItems.forEach((item, i) => {
      item.classList.toggle('is-active', i === index);
      item.classList.toggle('is-done', i < index);
    });
    currentStep = index;
    // Move focus to the new step's heading for keyboard/screen-reader users
    const heading = steps[index].querySelector('h2, h3');
    if (heading) heading.setAttribute('tabindex', '-1'), heading.focus({ preventScroll: true });
    form.closest('.form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (index === 3) renderReview();
  }

  function validateStep(index) {
    const step = steps[index];
    const requiredFields = step.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach((field) => {
      const group = field.closest('.form-group') || field.closest('.upload-box');
      let fieldValid = true;

      if (field.type === 'radio') {
        const name = field.name;
        const checked = step.querySelector(`input[name="${name}"]:checked`);
        fieldValid = !!checked;
      } else if (field.type === 'checkbox') {
        fieldValid = field.checked;
      } else if (field.type === 'file') {
        fieldValid = field.files && field.files.length > 0;
      } else if (field.type === 'email') {
        fieldValid = field.value.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      } else {
        fieldValid = field.value.trim() !== '';
      }

      if (group) group.classList.toggle('has-error', !fieldValid);
      if (!fieldValid) valid = false;
    });

    return valid;
  }

  function collectStepData(index) {
    if (index === 0) {
      applicationData.student = {
        fullName: form.studentFullName.value.trim(),
        dob: form.studentDob.value,
        gender: form.querySelector('input[name="studentGender"]:checked')?.value || '',
        currentSchool: form.studentCurrentSchool.value.trim(),
        previousForm: form.studentPreviousForm.value,
        applyingForm: form.studentApplyingForm.value
      };
    } else if (index === 1) {
      applicationData.guardian = {
        fullName: form.guardianFullName.value.trim(),
        relationship: form.guardianRelationship.value,
        phone: form.guardianPhone.value.trim(),
        email: form.guardianEmail.value.trim(),
        address: form.guardianAddress.value.trim()
      };
    } else if (index === 2) {
      const docFields = ['birthCertificate', 'schoolReport', 'idDocument', 'otherDocuments'];
      docFields.forEach((name) => {
        const input = form.querySelector(`input[name="${name}"]`);
        applicationData.documents[name] = input && input.files.length ? input.files[0].name : null;
      });
    }
  }

  document.querySelectorAll('.js-next-step').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!validateStep(currentStep)) {
        const firstError = steps[currentStep].querySelector('.has-error .form-input, .has-error .form-select, .has-error input');
        if (firstError) firstError.focus();
        return;
      }
      collectStepData(currentStep);
      if (currentStep < steps.length - 1) showStep(currentStep + 1);
    });
  });

  document.querySelectorAll('.js-prev-step').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  // Allow clicking a completed stepper circle to jump back
  stepperItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (item.classList.contains('is-done')) showStep(i);
    });
    item.style.cursor = 'pointer';
  });

  /* ------------------------------------------------------------------
     Live-clear validation state as the applicant fixes a field
     ------------------------------------------------------------------ */
  form.addEventListener('input', (e) => {
    const group = e.target.closest('.form-group');
    if (group) group.classList.remove('has-error');
  });
  form.addEventListener('change', (e) => {
    const group = e.target.closest('.form-group') || e.target.closest('.upload-box');
    if (group) group.classList.remove('has-error');
  });

  /* ------------------------------------------------------------------
     Document upload boxes — show the chosen filename (front-end only)
     ------------------------------------------------------------------ */
  document.querySelectorAll('.upload-box').forEach((box) => {
    const input = box.querySelector('input[type="file"]');
    const nameEl = box.querySelector('.upload-filename');
    if (!input) return;
    input.addEventListener('change', () => {
      if (input.files.length) {
        box.classList.add('has-file');
        nameEl.textContent = input.files[0].name;
      } else {
        box.classList.remove('has-file');
        nameEl.textContent = 'No file selected yet';
      }
    });
  });

  /* ------------------------------------------------------------------
     Step 4 — Review screen, generated straight from applicationData
     ------------------------------------------------------------------ */
  function renderReview() {
    const map = {
      'review-student': {
        'Full Name': applicationData.student.fullName,
        'Date of Birth': applicationData.student.dob,
        'Gender': applicationData.student.gender,
        'Current School': applicationData.student.currentSchool,
        'Previous Grade/Form': applicationData.student.previousForm,
        'Form Applying For': applicationData.student.applyingForm
      },
      'review-guardian': {
        'Full Name': applicationData.guardian.fullName,
        'Relationship': applicationData.guardian.relationship,
        'Phone Number': applicationData.guardian.phone,
        'Email Address': applicationData.guardian.email,
        'Residential Address': applicationData.guardian.address
      },
      'review-documents': {
        'Birth Certificate': applicationData.documents.birthCertificate || 'Not attached',
        'Previous School Report': applicationData.documents.schoolReport || 'Not attached',
        'Identity Document': applicationData.documents.idDocument || 'Not attached',
        'Other Supporting Documents': applicationData.documents.otherDocuments || 'Not attached'
      }
    };

    Object.entries(map).forEach(([containerId, fields]) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = Object.entries(fields)
        .map(
          ([label, value]) => `
            <div class="review-item">
              <dt>${label}</dt>
              <dd>${value ? escapeHtml(String(value)) : '<span style="color:var(--color-ink-soft);font-weight:400;">Not provided</span>'}</dd>
            </div>`
        )
        .join('');
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ------------------------------------------------------------------
     Step 5 — Submission (simulated) + reference number
     ------------------------------------------------------------------ */
  let referenceCounter = 1; // Placeholder sequence; a backend would issue the real one

  function generateReferenceNumber() {
    const year = new Date().getFullYear();
    const padded = String(referenceCounter).padStart(4, '0');
    referenceCounter += 1;
    return `DINANI-${year}-${padded}`;
  }

  function simulateSubmission() {
    // --- BACKEND INTEGRATION POINT ---
    // Swap this block for a real fetch()/axios POST to your admissions API.
    // The full applicationData object (plus File objects from the upload
    // inputs) is already assembled and ready to send.
    return new Promise((resolve) => {
      setTimeout(() => resolve({ referenceNumber: generateReferenceNumber() }), 600);
    });
  }

  const submitBtn = document.getElementById('submit-application');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';

      const result = await simulateSubmission();

      document.getElementById('reference-number').textContent = result.referenceNumber;
      showStep(4);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    });
  }

  const restartBtn = document.getElementById('start-new-application');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      form.reset();
      document.querySelectorAll('.upload-box').forEach((box) => {
        box.classList.remove('has-file');
        const nameEl = box.querySelector('.upload-filename');
        if (nameEl) nameEl.textContent = 'No file selected yet';
      });
      applicationData.student = {};
      applicationData.guardian = {};
      applicationData.documents = {};
      showStep(0);
    });
  }

  // Initialise on load
  showStep(0);
})();
