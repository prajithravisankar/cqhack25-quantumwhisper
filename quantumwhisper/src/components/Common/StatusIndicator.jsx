import React from 'react';

function clsx(...arr) {
  return arr.filter(Boolean).join(' ');
}

const STATUS_STYLES = {
  idle: { color: 'bg-gray-400', text: 'text-gray-700', ring: 'ring-gray-300' },
  generating: { color: 'bg-blue-500', text: 'text-blue-800', ring: 'ring-blue-300' },
  generated: { color: 'bg-green-500', text: 'text-green-800', ring: 'ring-green-300' },
  receiving: { color: 'bg-blue-500', text: 'text-blue-800', ring: 'ring-blue-300' },
  received: { color: 'bg-green-500', text: 'text-green-800', ring: 'ring-green-300' },
  matched: { color: 'bg-emerald-500', text: 'text-emerald-800', ring: 'ring-emerald-300' },
  mismatch: { color: 'bg-amber-500', text: 'text-amber-800', ring: 'ring-amber-300' },
  playing: { color: 'bg-indigo-500', text: 'text-indigo-800', ring: 'ring-indigo-300' },
  encoding: { color: 'bg-purple-500', text: 'text-purple-800', ring: 'ring-purple-300' },
  started: { color: 'bg-indigo-500', text: 'text-indigo-800', ring: 'ring-indigo-300' },
  finished: { color: 'bg-green-500', text: 'text-green-800', ring: 'ring-green-300' },
  success: { color: 'bg-green-500', text: 'text-green-800', ring: 'ring-green-300' },
  retry: { color: 'bg-yellow-500', text: 'text-yellow-900', ring: 'ring-yellow-300' },
  listening: { color: 'bg-sky-500', text: 'text-sky-900', ring: 'ring-sky-300' },
  'request-permission': { color: 'bg-sky-400', text: 'text-sky-900', ring: 'ring-sky-200' },
  'permission-denied': { color: 'bg-red-500', text: 'text-red-900', ring: 'ring-red-300' },
  timeout: { color: 'bg-orange-500', text: 'text-orange-900', ring: 'ring-orange-300' },
  decoded: { color: 'bg-fuchsia-500', text: 'text-fuchsia-900', ring: 'ring-fuchsia-300' },
  stopped: { color: 'bg-gray-500', text: 'text-gray-800', ring: 'ring-gray-300' },
  error: { color: 'bg-red-600', text: 'text-red-900', ring: 'ring-red-300' },
};

const Dot = ({ status = 'idle' }) => {
  const st = STATUS_STYLES[status] || STATUS_STYLES.idle;
  return <span className={clsx('inline-block h-3 w-3 rounded-full', st.color)} aria-hidden="true" />;
};

const ProgressBar = ({ value = 0 }) => (
  <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
    <div className="h-full bg-blue-600 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

const StatusIndicator = ({
  status = 'idle',
  label = 'Status',
  error = null,
  progress = null,
  className = '',
}) => {
  const st = STATUS_STYLES[status] || STATUS_STYLES.idle;

  // Derive a simple progress number if available
  let progressValue = null;
  if (typeof progress === 'number') progressValue = progress;
  else if (progress && typeof progress?.rms === 'number') progressValue = Math.min(100, Math.round(progress.rms * 100));

  return (
    <div className={clsx('rounded-md border p-3 text-sm', st.ring, 'ring-1', className)}>
      <div className="flex items-center gap-2">
        <Dot status={status} />
        <div className={clsx('font-medium', st.text)}>{label}: {status}</div>
      </div>

      {progressValue != null && (
        <div className="mt-2">
          <ProgressBar value={progressValue} />
        </div>
      )}

      {progress && typeof progress === 'object' && (
        <div className="mt-2 text-xs text-gray-600">
          {Object.entries(progress).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="uppercase tracking-wide">{k}</span>
              <span className="font-mono">{String(v)}</span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-2 rounded bg-red-50 p-2 text-xs text-red-700">{error}</div>
      )}
    </div>
  );
};

export default StatusIndicator;