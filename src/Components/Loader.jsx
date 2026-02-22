export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">

      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin"></div>

      {/* Text */}
      <p className="mt-3 text-sm text-gray-600">{text}</p>

    </div>
  );
}