
import { useEffect, useRef, useState } from 'react';
import { IntervalTracker, Interval } from '../utils/intervalTracker';

// Local storage key for saving progress
const STORAGE_PREFIX = 'video-progress-';

interface UseVideoProgressProps {
  videoId: string;
  duration: number;
}

interface VideoProgressState {
  watchedIntervals: Interval[];
  progressPercent: number;
  currentPosition: number;
}

export default function useVideoProgress({ videoId, duration }: UseVideoProgressProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);
  const [progress, setProgress] = useState<VideoProgressState>({
    watchedIntervals: [],
    progressPercent: 0,
    currentPosition: 0
  });
  
  const trackerRef = useRef<IntervalTracker>(new IntervalTracker(duration));

  // Handle tracking start
  const startTracking = (currentTime: number) => {
    setIsTracking(true);
    setLastUpdateTime(currentTime);
  };

  // Handle tracking end
  const stopTracking = (currentTime: number) => {
    if (isTracking && lastUpdateTime !== null) {
      trackerRef.current.addInterval(lastUpdateTime, currentTime);
      updateProgressState();
      saveProgress();
    }
    setIsTracking(false);
    setLastUpdateTime(null);
  };

  // Update time position (called during playback)
  const updateTimePosition = (currentTime: number) => {
    if (isTracking) {
      // Only save interval when the difference is significant to avoid too many small intervals
      if (lastUpdateTime !== null && currentTime - lastUpdateTime > 1) {
        trackerRef.current.addInterval(lastUpdateTime, currentTime);
        setLastUpdateTime(currentTime);
        updateProgressState();
        saveProgress();
      }
    }
  };

  // Update the progress state from the tracker
  const updateProgressState = () => {
    setProgress({
      watchedIntervals: trackerRef.current.getIntervals(),
      progressPercent: trackerRef.current.getProgressPercentage(),
      currentPosition: trackerRef.current.getFurthestWatchedPosition()
    });
  };

  // Save progress to local storage
  const saveProgress = () => {
    const storageKey = `${STORAGE_PREFIX}${videoId}`;
    const dataToSave = {
      intervals: trackerRef.current.getIntervals(),
      timestamp: new Date().getTime()
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  };

  // Load progress from local storage
  const loadProgress = () => {
    try {
      const storageKey = `${STORAGE_PREFIX}${videoId}`;
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        const { intervals } = JSON.parse(savedData);
        trackerRef.current.setIntervals(intervals);
        updateProgressState();
        return true;
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
    return false;
  };

  // Reset progress
  const resetProgress = () => {
    trackerRef.current.clear();
    updateProgressState();
    const storageKey = `${STORAGE_PREFIX}${videoId}`;
    localStorage.removeItem(storageKey);
  };

  // Initialize with saved progress if available
  useEffect(() => {
    if (duration > 0) {
      trackerRef.current = new IntervalTracker(duration);
      loadProgress();
    }
  }, [duration]);

  return {
    progress,
    startTracking,
    stopTracking,
    updateTimePosition,
    resetProgress
  };
}
