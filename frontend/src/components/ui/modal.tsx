import { translate, useLanguage } from "../../i18n";
import { useEffect, useRef, type ReactNode } from "react";
import Icon from "./icon";
export default function Modal({
  children,
  onClose,
  label,
  className = "",
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
  className?: string;
}) {
  useLanguage();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    el?.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
      el?.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={translate(label)}
      className={`modal ${className}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-inner">
        <button
          className="icon-button close"
          onClick={onClose}
          aria-label={translate("Fechar janela")}
        >
          <Icon name="x" />
        </button>
        {translate(children)}
      </div>
    </dialog>
  );
}
