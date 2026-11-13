/**
 * wa-form — any <form action="https://wa.me/<number>"> sends its filled fields as a WhatsApp message.
 * The browser's own required-field check runs first (submit only fires on a valid form).
 * Message = data-wa-intro (or a default line) + "Label: value" for every filled field, labels read from <label for>.
 */
document.querySelectorAll<HTMLFormElement>('form[action^="https://wa.me/"]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const lines = [form.dataset.waIntro || 'Hi Fursat! I have an enquiry from your website.'];
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach((el) => {
      if (!el.value || ['hidden', 'submit', 'button'].includes(el.type)) return;
      const label = (el.id && form.querySelector(`label[for="${el.id}"]`)?.textContent) || el.getAttribute('aria-label') || el.name || '';
      lines.push(`${label.replace('*', '').trim()}: ${el.value}`);
    });
    window.open(`${form.action.split('?')[0]}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
});
