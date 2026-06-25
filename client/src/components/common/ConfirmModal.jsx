import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * Reusable confirmation dialog.
 *
 * Props:
 *  isOpen       — boolean
 *  onClose      — () => void  (cancel)
 *  onConfirm    — () => void  (confirm action)
 *  title        — string
 *  message      — string | ReactNode
 *  confirmLabel — string  (default "Delete")
 *  variant      — 'danger' | 'warning'  (default 'danger')
 */
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  variant = 'danger',
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <div
      className="modal-overlay confirm-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`confirm-icon-wrap confirm-icon-${variant}`}>
          {variant === 'danger' ? (
            <Trash2 size={28} strokeWidth={1.5} />
          ) : (
            <AlertTriangle size={28} strokeWidth={1.5} />
          )}
        </div>

        {/* Text */}
        <h3 id="confirm-title" className="confirm-title">{title}</h3>
        {message && <p className="confirm-message">{message}</p>}

        {/* Actions */}
        <div className="confirm-actions">
          <button className="btn btn-ghost confirm-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`btn btn-${variant} confirm-ok`}
            onClick={handleConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>

        {/* Close X */}
        <button className="confirm-close-x" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default ConfirmModal;
