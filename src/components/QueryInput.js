import React from "react";

export default function QueryInput({ value, onChange, onSubmit, loading }) {
  const examples = [
    'show SOL tokens under $5M mcap with 1h vol +30% and honeypot score above 70',
    'ETH tokens between $10M and $50M mcap with 24h vol +100%',
    'show tokens price under $1 and 24h vol +200%'
  ];
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">Natural language query</label>
      <div className="flex gap-2">
        <input className="input" value={value} onChange={e => onChange(e.target.value)} placeholder="Type your query..." onKeyDown={(e)=> e.key === 'Enter' && onSubmit()} />
        <button className="btn bg-blue-600 text-white" onClick={onSubmit} disabled={loading}>{loading ? 'Parsing...' : 'Search'}</button>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        {examples.map((ex, i) => <button key={i} className="tag" onClick={() => { onChange(ex); }}>{ex}</button>)}
      </div>
    </div>
  );
}
