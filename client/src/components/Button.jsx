export default function Button({ children, onClick, variant = "primary", disabled = false }) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    success: "bg-green-600 hover:bg-green-500 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded text-sm font-medium disabled:opacity-50 ${styles[variant] || styles.primary}`}
    >
      {children}
    </button>
  );
}