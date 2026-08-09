
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Hiển thị trạng thái đang gửi (UX)
  const btn = this.querySelector('button');
  btn.textContent = 'Đang gửi...';
  btn.disabled = true;

  // Gửi email đầu tiên
  emailjs.sendForm('service_ixzwrua', 'template_37ajvu9', this) // email service, template emailjs
    .then(function() {
      // Gửi email phản hồi thứ hai cho người dùng
      return emailjs.sendForm('service_ixzwrua', 'template_0k0wxik', this);
    }.bind(this))
    .then(function() {
      alert('Cảm ơn bạn! Tin nhắn đã được gửi thành công. Vui lòng kiểm tra email của bạn, bao gồm cả thư mục Spam.');
      contactForm.reset();
    })
    .catch(function(error) {
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
      console.error('FAILED...', error);
    })
    .finally(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    });
});