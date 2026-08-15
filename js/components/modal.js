/**
 * DwelloCrew 2.0 — Universal Modal Dialog Component
 */

export class Modal {
  static open({ title, content, size = 'medium', onClose = null }) {
    this.close(); // Close any existing modal

    const backdrop = document.createElement('div');
    backdrop.id = 'active-modal-backdrop';
    backdrop.className = 'modal-backdrop animate-fade-in';

    backdrop.innerHTML = `
      <div class="modal-card modal-${size} animate-scale-up" role="dialog" aria-labelledby="modal-title">
        <div class="modal-header">
          <h3 id="modal-title" class="modal-title">${title}</h3>
          <button class="modal-close-btn" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';

    const closeHandler = () => {
      this.close();
      if (onClose) onClose();
    };

    backdrop.querySelector('.modal-close-btn').onclick = closeHandler;
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closeHandler();
    };

    // Trap Escape key
    const escListener = (e) => {
      if (e.key === 'Escape') {
        closeHandler();
        document.removeEventListener('keydown', escListener);
      }
    };
    document.addEventListener('keydown', escListener);

    return backdrop;
  }

  static close() {
    const active = document.getElementById('active-modal-backdrop');
    if (active) {
      active.remove();
      document.body.style.overflow = '';
    }
  }
}
