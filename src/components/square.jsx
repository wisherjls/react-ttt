export default function Square({ value, onClick }) {
  return (
    <button
      className="text-9xl font-bold size-36 text-center text-white hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
      onClick={onClick}
    >
      {value}
    </button>
  );
}
