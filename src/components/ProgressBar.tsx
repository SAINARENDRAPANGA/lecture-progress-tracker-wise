
import React from 'react';
import { Interval } from '../utils/intervalTracker';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  intervals: Interval[];
  duration: number;
  progressPercent: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  intervals,
  duration,
  progressPercent,
  className
}) => {
  // Convert intervals to percentage positions
  const segments = intervals.map(([start, end]) => ({
    start: (start / duration) * 100,
    width: ((end - start) / duration) * 100
  }));

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Progress</span>
        <span className="font-semibold text-primary">
          {progressPercent.toFixed(1)}%
        </span>
      </div>
      
      <div className="progress-segments">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="segment animate-progress-fill"
            style={{
              left: `${segment.start}%`,
              width: `${segment.width}%`
            }}
          />
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground">
        {Math.round((progressPercent * duration) / 100)} / {Math.round(duration)} seconds watched
      </div>
    </div>
  );
};

export default ProgressBar;
