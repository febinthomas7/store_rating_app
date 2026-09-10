import React, { useState } from "react";

export interface Column {
  header: string;
  accessor: string | ((item: any) => React.ReactNode);
  sortable?: boolean;
  sortKey?: string;
}

interface TableProps {
  title?: string;
  description?: string;
  columns: Column[];
  data: any[];
  addButtonLabel?: string;
  onAdd?: () => void;
  searchPlaceholder?: string;
  onRowClick?: (item: any) => void;
}

export default function Table({
  title = "Directory",
  description,
  columns = [],
  data = [],
  addButtonLabel = "+ Add New",
  onAdd,
  searchPlaceholder = "Search...",
  onRowClick,
}: TableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    ),
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    let valA = a[sortKey];
    let valB = b[sortKey];

    if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key?: string) => {
    if (!key) return;
    if (sortKey === key) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setOrder("asc");
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
      <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {onAdd && (
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition"
            >
              {addButtonLabel}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
            <tr>
              {columns.map((col, index) => {
                const keyToSort =
                  col.sortKey ||
                  (typeof col.accessor === "string" ? col.accessor : undefined);
                return (
                  <th
                    key={index}
                    onClick={() => col.sortable && handleSort(keyToSort)}
                    className={`px-6 py-3 ${col.sortable ? "cursor-pointer hover:bg-gray-200" : ""}`}
                  >
                    {col.header}{" "}
                    {col.sortable && keyToSort
                      ? sortKey === keyToSort
                        ? order === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"
                      : null}
                  </th>
                );
              })}
              {/* Extra header column for row action arrow if handler is provided */}
              {onRowClick && <th className="px-6 py-3 text-right">Action</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {sortedData.length > 0 ? (
              sortedData.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition ${
                    onRowClick
                      ? "hover:bg-indigo-50/50 cursor-pointer group"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : item[col.accessor]}
                    </td>
                  ))}
                  {/* Action arrow cell */}
                  {onRowClick && (
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 inline-block transition-transform font-bold text-base">
                        →
                      </span>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onRowClick ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-400"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
