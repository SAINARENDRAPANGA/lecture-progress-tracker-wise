
export type Interval = [number, number]; // [startTime, endTime]

/**
 * Utility class to track and manage watched intervals
 */
export class IntervalTracker {
  private intervals: Interval[] = [];
  private totalDuration: number;
  
  constructor(totalDuration: number) {
    this.totalDuration = totalDuration;
  }

  /**
   * Add a new watched interval
   * @param start Start time in seconds
   * @param end End time in seconds
   */
  addInterval(start: number, end: number): void {
    if (start >= end || end > this.totalDuration) return;
    
    const newInterval: Interval = [
      Math.max(0, Math.floor(start)), 
      Math.min(Math.ceil(end), this.totalDuration)
    ];
    
    // Add the interval and merge overlapping ones
    this.intervals.push(newInterval);
    this.mergeIntervals();
  }

  /**
   * Merge overlapping intervals to maintain a set of unique watched segments
   */
  private mergeIntervals(): void {
    if (this.intervals.length <= 1) return;
    
    // Sort intervals by start time
    this.intervals.sort((a, b) => a[0] - b[0]);
    
    const merged: Interval[] = [];
    let current = this.intervals[0];
    
    for (let i = 1; i < this.intervals.length; i++) {
      const [currentStart, currentEnd] = current;
      const [nextStart, nextEnd] = this.intervals[i];
      
      // Check if intervals overlap
      if (currentEnd >= nextStart) {
        // Merge intervals
        current = [currentStart, Math.max(currentEnd, nextEnd)];
      } else {
        // No overlap, add the current interval and move to the next
        merged.push(current);
        current = this.intervals[i];
      }
    }
    
    // Add the last interval
    merged.push(current);
    this.intervals = merged;
  }

  /**
   * Calculate total unique seconds watched
   */
  getTotalWatchedSeconds(): number {
    return this.intervals.reduce((total, [start, end]) => {
      return total + (end - start);
    }, 0);
  }

  /**
   * Calculate progress percentage
   */
  getProgressPercentage(): number {
    if (this.totalDuration === 0) return 0;
    return Math.min(100, (this.getTotalWatchedSeconds() / this.totalDuration) * 100);
  }

  /**
   * Get all watched intervals
   */
  getIntervals(): Interval[] {
    return [...this.intervals];
  }

  /**
   * Set intervals directly (used when loading saved progress)
   */
  setIntervals(intervals: Interval[]): void {
    this.intervals = [...intervals];
    this.mergeIntervals();
  }

  /**
   * Find the furthest watched position
   */
  getFurthestWatchedPosition(): number {
    if (this.intervals.length === 0) return 0;
    
    // Get the end time of the last interval
    return this.intervals[this.intervals.length - 1][1];
  }

  /**
   * Clear all watched intervals
   */
  clear(): void {
    this.intervals = [];
  }

  /**
   * Check if a specific time has been watched
   */
  isWatched(time: number): boolean {
    return this.intervals.some(([start, end]) => time >= start && time < end);
  }
}
