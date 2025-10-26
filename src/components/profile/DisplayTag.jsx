export default function DisplayTag({ tag, onRemove }) {
    return (
      <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
        <span>{tag.name}</span>
        <button
          onClick={onRemove}
          className="ml-2 text-red-500 hover:text-red-700 font-bold"
        >
          ×
        </button>
      </div>
    );
  }
  