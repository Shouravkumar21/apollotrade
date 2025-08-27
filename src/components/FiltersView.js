import React from "react";

export default function FiltersView({ filters }) {
  if (!filters) return <div className="text-gray-400">Parsed filters will show here after query.</div>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Parsed filters</h3>
      <pre className="text-xs bg-slate-900 p-3 rounded">{JSON.stringify(filters, null, 2)}</pre>
    </div>
  );
}
