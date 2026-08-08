export default function Table({ columns, data }) {
  return (
    <table className="min-w-full text-sm text-left text-gray-300">
      <thead className="bg-gray-800 text-gray-400">
        <tr>
          {columns.map((col) => (
            <th key={col.accessor} className="px-4 py-2">{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row._id || i} className="border-t border-gray-800">
            {columns.map((col) => (
              <td key={col.accessor} className="px-4 py-2">{row[col.accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}