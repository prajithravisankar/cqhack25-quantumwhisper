import React, { useEffect, useRef, useState } from 'react';

function clsx(...arr) {
  return arr.filter(Boolean).join(' ');
}

const AudioVisualizer = ({ 
  isActive = false, 
  audioData = null, 
  type = 'waveform', // 'waveform' | 'frequency' | 'level'
  className = '',
  height = 100,
  color = '#3B82F6'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const canvasHeight = canvas.height;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, canvasHeight);

      if (!isActive && !audioData) {
        // Draw idle state
        drawIdleState(ctx, width, canvasHeight, color);
        return;
      }

      if (audioData && Array.isArray(audioData)) {
        switch (type) {
          case 'waveform':
            drawWaveform(ctx, audioData, width, canvasHeight, color);
            break;
          case 'frequency':
            drawFrequency(ctx, audioData, width, canvasHeight, color);
            break;
          case 'level':
            drawLevel(ctx, audioData, width, canvasHeight, color);
            break;
          default:
            drawWaveform(ctx, audioData, width, canvasHeight, color);
        }
      } else if (isActive) {
        // Draw active but no data (e.g., waiting for audio)
        drawActiveState(ctx, width, canvasHeight, color);
      }
    };

    draw();

    if (isActive) {
      const animate = () => {
        draw();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, audioData, type, color]);

  const drawIdleState = (ctx, width, height, color) => {
    ctx.strokeStyle = color + '40'; // 25% opacity
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Add small dots
    ctx.fillStyle = color + '60';
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.arc(i, height / 2, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawActiveState = (ctx, width, height, color) => {
    const time = Date.now() / 1000;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
      const y = height / 2 + Math.sin((x / width) * Math.PI * 4 + time * 2) * 10;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const drawWaveform = (ctx, data, width, height, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const sliceWidth = width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const sample = data[i] || 0;
      const y = ((sample + 1) / 2) * height; // Normalize from [-1,1] to [0,height]
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      
      x += sliceWidth;
    }
    
    ctx.stroke();
  };

  const drawFrequency = (ctx, data, width, height, color) => {
    const barWidth = width / data.length;
    ctx.fillStyle = color;

    for (let i = 0; i < data.length; i++) {
      const magnitude = Math.abs(data[i] || 0);
      const barHeight = magnitude * height;
      
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
  };

  const drawLevel = (ctx, data, width, height, color) => {
    // Calculate RMS level
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += (data[i] || 0) ** 2;
    }
    const rms = Math.sqrt(sum / data.length);
    const level = Math.min(1, rms * 5); // Scale up and clamp

    // Draw level meter
    const meterWidth = width * 0.8;
    const meterHeight = height * 0.3;
    const meterX = (width - meterWidth) / 2;
    const meterY = (height - meterHeight) / 2;

    // Background
    ctx.fillStyle = '#E5E7EB';
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight);

    // Level bar
    const levelWidth = meterWidth * level;
    const gradient = ctx.createLinearGradient(meterX, 0, meterX + meterWidth, 0);
    gradient.addColorStop(0, '#10B981'); // Green
    gradient.addColorStop(0.7, '#F59E0B'); // Yellow
    gradient.addColorStop(1, '#EF4444'); // Red
    
    ctx.fillStyle = gradient;
    ctx.fillRect(meterX, meterY, levelWidth, meterHeight);

    // Border
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 1;
    ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);
  };

  return (
    <div className={clsx('relative', className)}>
      <canvas
        ref={canvasRef}
        width={300}
        height={height}
        className="w-full border rounded bg-gray-50"
        style={{ height: `${height}px` }}
      />
      
      {/* Status indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <div className={clsx(
          'w-2 h-2 rounded-full',
          isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        )} />
        <span className="text-xs text-gray-600">
          {isActive ? 'Active' : 'Idle'}
        </span>
      </div>
    </div>
  );
};

// Higher-order component for different visualizer types
export const WaveformVisualizer = (props) => (
  <AudioVisualizer {...props} type="waveform" />
);

export const FrequencyVisualizer = (props) => (
  <AudioVisualizer {...props} type="frequency" />
);

export const LevelMeterVisualizer = (props) => (
  <AudioVisualizer {...props} type="level" />
);

export default AudioVisualizer;