
const contactForm = document.getElementById('contactForm');

// Modal notification: hiển thị ở giữa, có overlay và nút OK.
// Trả về Promise để giữ hành vi giống `alert()` (chờ người dùng đóng).
function showModalNotification(message, type = 'info') {
  return new Promise((resolve) => {
    // Remove existing if any
    const existing = document.querySelector('.modal-notification-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-notification-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0,0,0,0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
    });

    const box = document.createElement('div');
    box.className = 'modal-notification-box';
    Object.assign(box.style, {
      width: '100%',
      maxWidth: '420px',
      background: '#fff',
      borderRadius: '10px',
      padding: '28px 22px',
      boxSizing: 'border-box',
      boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
      textAlign: 'center',
      fontFamily: 'Arial, Helvetica, sans-serif',
    });

    // Icon
    const iconWrap = document.createElement('div');
    Object.assign(iconWrap.style, {
      width: '72px',
      height: '72px',
      borderRadius: '50%',
      margin: '0 auto 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '4px solid rgba(0,0,0,0.06)',
    });
    if (type === 'success') {
      iconWrap.style.background = 'linear-gradient(180deg, #eafaf0, #e6fff2)';
      const check = document.createElement('div');
      check.innerHTML = '\u2713';
      Object.assign(check.style, { color: '#2ca86a', fontSize: '34px', fontWeight: '700' });
      iconWrap.appendChild(check);
    } else if (type === 'error') {
      iconWrap.style.background = 'linear-gradient(180deg, #fff5f5, #fff0f0)';
      const cross = document.createElement('div');
      cross.innerHTML = '\u00d7';
      Object.assign(cross.style, { color: '#e04848', fontSize: '34px', fontWeight: '700' });
      iconWrap.appendChild(cross);
    } else {
      iconWrap.style.background = 'transparent';
    }

    const msg = document.createElement('div');
    msg.className = 'modal-notification-message';
    Object.assign(msg.style, {
      color: '#333',
      fontSize: '16px',
      lineHeight: '1.45',
      marginBottom: '18px',
      whiteSpace: 'pre-wrap',
    });
    msg.textContent = message;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'OK';
    Object.assign(btn.style, {
      background: type === 'success' ? '#2ca86a' : (type === 'error' ? '#e04848' : '#2b7cff'),
      color: '#fff',
      border: 'none',
      padding: '10px 18px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
    });

    // Close helper to ensure resolve() is called once and timer cleared
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      clearTimeout(autoCloseTimer);
      overlay.remove();
      resolve();
    };

    btn.addEventListener('click', close);

    // Allow clicking overlay to close as well
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        close();
      }
    });

    // Auto-close after 6 seconds
    const autoCloseTimer = setTimeout(() => {
      close();
    }, 6000);

    box.appendChild(iconWrap);
    box.appendChild(msg);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  });
}

contactForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Hiển thị trạng thái đang gửi (UX)
  const btn = this.querySelector('button');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Gửi email đầu tiên
  emailjs.sendForm('service_ixzwrua', 'template_37ajvu9', this) // email service, template emailjs
    .then(function() {
      // Gửi email phản hồi thứ hai cho người dùng
      return emailjs.sendForm('service_ixzwrua', 'template_0k0wxik', this);
    }.bind(this))
    .then(function() {
      return showModalNotification('Thank you! Your message has been sent successfully.\nPlease check your Email, including your Spam folder.', 'success')
        .then(() => { contactForm.reset(); });
    })
    .catch(function(error) {
      // Show error modal but do not reset form
      showModalNotification('An error occurred, please try again later.', 'error');
      console.error('FAILED...', error);
    })
    .finally(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    });
});