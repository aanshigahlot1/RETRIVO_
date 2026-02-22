export default function ItemCard({
  item,
  type = "lost", // lost | found | history
}) {
  const date =
    type === "lost"
      ? item.lostDate
      : type === "found"
      ? item.foundDate
      : item.resolvedAt;

  const title =
    type === "history"
      ? item?.lost?.itemName
      : item.itemName;

  const location =
    type === "history"
      ? item?.lost?.location
      : item.location;

  const image =
    type === "history"
      ? item?.found?.imageURL
      : item.imageURL;

  const person =
    type === "found"
      ? `Found by: ${item.personName}`
      : type === "lost"
      ? `Owner: ${item.personName}`
      : `Recovered via: ${item?.found?.personName}`;

  return (
    <div className="bg-white rounded-2xl shadow-md border p-4 hover:shadow-lg transition">

      {/* Item Title */}
      <h3 className="text-lg font-semibold text-green-700">
        {title || "Unnamed Item"}
      </h3>

      {/* Location */}
      <p className="text-sm text-gray-600 mt-1">
        📍 {location || "Unknown location"}
      </p>

      {/* Date */}
      {date && (
        <p className="text-sm text-gray-500">
          📅 {new Date(date).toLocaleDateString()}
        </p>
      )}

      {/* Description */}
      {item.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {item.description}
        </p>
      )}

      {/* Image */}
      {image && (
        <img
          src={image}
          alt="item"
          className="w-full h-40 object-cover rounded-lg mt-3"
        />
      )}

      {/* Person info */}
      <p className="text-xs text-gray-400 mt-3">{person}</p>
    </div>
  );
}