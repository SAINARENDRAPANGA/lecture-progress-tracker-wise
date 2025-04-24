
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Play, Pause } from 'lucide-react';
import ProgressBar from './ProgressBar';
import useVideoProgress from '../hooks/useVideoProgress';
import { toast } from '@/components/ui/sonner';

interface VideoPlayerProps {
  src: string;
  title: string;
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, videoId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    progress,
    startTracking,
    stopTracking,
    updateTimePosition,
    resetProgress
  } = useVideoProgress({ videoId, duration });

  // Handle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      stopTracking(videoRef.current.currentTime);
    } else {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
        toast.error("Could not play the video. Please try again.");
      });
      startTracking(videoRef.current.currentTime);
    }
    
    setIsPlaying(!isPlaying);
  };

  // Set video current time
  const seekTo = (time: number) => {
    if (videoRef.current) {
      // If currently tracking, stop tracking the old segment
      if (isPlaying) {
        stopTracking(videoRef.current.currentTime);
      }
      
      // Set the new position
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      
      // If playing, start tracking from the new position
      if (isPlaying) {
        startTracking(time);
      }
    }
  };

  // Event handlers for the video element
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      
      // Resume from last position if available
      if (progress.currentPosition > 0) {
        videoRef.current.currentTime = progress.currentPosition;
        setCurrentTime(progress.currentPosition);
        toast.info(`Resuming from ${Math.round(progress.currentPosition)} seconds`);
      }
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      updateTimePosition(videoRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    stopTracking(duration);
    setIsPlaying(false);
    toast.success("You've reached the end of the video!");
  };

  const handleReset = () => {
    resetProgress();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
    toast.info("Progress has been reset");
  };

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // For demonstrating progress persistence
  const handleContinueWatching = () => {
    if (progress.currentPosition > 0) {
      seekTo(progress.currentPosition);
      toast.info("Continuing from where you left off");
    } else {
      toast.info("No previous progress found");
    }
  };

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <div className="text-sm text-muted-foreground flex items-center justify-between">
            <span>Current Time: {formatTime(currentTime)}</span>
            <span>Duration: {formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="video-container">
          <video
            ref={videoRef}
            className="video-player"
            src={src}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={togglePlay} className="flex-1">
            {isPlaying ? (
              <><Pause className="mr-2 h-4 w-4" /> Pause</>
            ) : (
              <><Play className="mr-2 h-4 w-4" /> Play</>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleContinueWatching}
            className="flex-1"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Resume
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex-1"
          >
            Reset Progress
          </Button>
        </div>
        
        <ProgressBar 
          intervals={progress.watchedIntervals}
          duration={duration}
          progressPercent={progress.progressPercent}
        />
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
