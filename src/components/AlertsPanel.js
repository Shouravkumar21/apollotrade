import React from "react";

export default function AlertsPanel({ alerts = [], onRemove }) {
  if (!alerts.length) return <div className="text-gray-400">No alerts yet. Save alerts from tokens.</div>;
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Alerts ({alerts.length})</h3>
      <ul className="space-y-3">
        {alerts.map(a => (
          <li key={a.id} className="p-3 bg-slate-900 rounded">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</div>
                <pre className="text-xs mt-2 text-gray-300">{JSON.stringify(a.filters, null, 2)}</pre>
              </div>
              <div className="ml-4">
                <button className="btn bg-red-600 text-white" onClick={() => onRemove(a.id)}>Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
