import React from 'react';

function clsx(...arr) {
  return arr.filter(Boolean).join(' ');
}

const StatusIndicator = ({
  status = 'idle',
  label = 'Status',
  error = null,
  progress = null,
  className = '',
}) => {
  // Map status to modern status classes
  const getStatusClass = (status) => {
    switch (status) {
      case 'idle':
      case 'stopped':
        return 'modern-status-idle';
      case 'generating':
      case 'receiving':
      case 'listening':
      case 'playing':
      case 'encoding':
      case 'started':
        return 'modern-status-active';
      case 'generated':
      case 'received':
      case 'finished':
      case 'success':
      case 'decoded':
      case 'matched':
        return 'modern-status-success';
      case 'error':
      case 'permission-denied':
        return 'modern-status-error';
      case 'retry':
      case 'timeout':
      case 'mismatch':
      case 'request-permission':
        return 'modern-status-warning';
      default:
        return 'modern-status-idle';
    }
  };

  // Derive progress value
  let progressValue = null;
  if (typeof progress === 'number') {
    progressValue = progress;
  } else if (progress && typeof progress?.rms === 'number') {
    progressValue = Math.min(100, Math.round(progress.rms * 100));
  }

  const isActive = ['generating', 'receiving', 'listening', 'playing', 'encoding', 'started'].includes(status);

  return (
    <div className={clsx('modern-card p-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'modern-status-dot',
            isActive && 'modern-status-dot-pulse'
          )} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className={clsx('modern-status', getStatusClass(status))}>
          {status}
        </div>
      </div>

      {progressValue != null && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progressValue}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.max(0, Math.min(100, progressValue))}%` }}
            />
          </div>
        </div>
      )}

      {progress && typeof progress === 'object' && progressValue == null && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {Object.entries(progress).map(([key, value]) => (
            <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-500 uppercase tracking-wide">{key}</span>
              <span className="font-mono text-gray-700">{String(value)}</span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;