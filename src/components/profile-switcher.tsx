'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const profiles = [
  { id: '1', name: 'Luc', seed: 'Luc' },
  { id: '2', name: 'Alex', seed: 'Alex' },
  { id: '3', name: 'Max', seed: 'Max' },
];

export function ProfileSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(profiles[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface transition-colors"
      >
        <div className="w-8 h-8 rounded-full border-2 border-brand p-0.5">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${active.seed}`}
            className="w-full h-full rounded-full bg-surface"
            alt={active.name}
          />
        </div>
        <span className="font-medium text-sm">{active.name}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-56 bg-surface border border-border rounded-2xl p-2 shadow-xl z-50">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setActive(p);
                setOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-border/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-border">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}`}
                  className="w-full h-full rounded-full"
                  alt={p.name}
                />
              </div>
              <span className="text-sm font-medium">{p.name}</span>
              {active.id === p.id && (
                <Check size={16} className="ml-auto text-brand" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
