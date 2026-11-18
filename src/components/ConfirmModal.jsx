import { AlertCircleIcon } from "./Icons";

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Volver",
  confirmVariant = "primary", // "primary" | "danger"
  onConfirm,
  onClose,
  isLoading = false,
}) {
  if (!isOpen) return null;

  const confirmBtnStyles =
    confirmVariant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-pacific-blue hover:bg-pacific-blue/90 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-shadow-grey/70 dark:bg-black/80 backdrop-blur-xs">
      <div
        className="retro-card max-w-md w-full p-6 bg-white dark:bg-shadow-grey relative animate-in fade-in zoom-in-95 duration-150 transition-colors duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-3.5 mb-4">
          <div className="p-2.5 bg-mustard border-2 border-shadow-grey shadow-[2px_2px_0px_#272727] text-shadow-grey shrink-0">
            <AlertCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-shadow-grey dark:text-platinum font-retro tracking-tight">
              {title}
            </h3>
            <div className="mt-1 text-sm text-shadow-grey dark:text-platinum leading-relaxed">
              {message}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t-2 border-platinum dark:border-dim-grey/30 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="retro-btn px-4 py-2 bg-platinum dark:bg-[#1a1a1a] hover:bg-platinum/80 dark:hover:bg-[#252525] text-shadow-grey dark:text-platinum text-sm font-bold dark:border-dim-grey/60 cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`retro-btn px-5 py-2 text-sm font-black uppercase tracking-wider ${confirmBtnStyles}`}
          >
            {isLoading ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
