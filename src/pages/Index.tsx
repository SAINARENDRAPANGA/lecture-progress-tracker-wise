
import { useState, useEffect } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { Card, CardContent } from '@/components/ui/card';

// Demo video list
const demoVideos = [
  {
    id: 'intro-to-react',
    title: 'Introduction to React',
    src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
  },
  {
    id: 'advanced-hooks',
    title: 'Advanced React Hooks',
    src: 'https://media.w3.org/2010/05/bunny/movie.mp4'
  }
];

const Index = () => {
  const [selectedVideo, setSelectedVideo] = useState(demoVideos[0]);
  const [activeTab, setActiveTab] = useState('player');

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white shadow-sm">
        <div className="container py-4">
          <h1 className="text-3xl font-bold text-primary">Lecture Progress Tracker</h1>
          <p className="text-muted-foreground">Track your real viewing progress with intelligent interval tracking</p>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Available Lectures</h2>
                <div className="space-y-2">
                  {demoVideos.map(video => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`w-full text-left p-2 rounded-md hover:bg-muted transition-colors ${
                        selectedVideo.id === video.id ? 'bg-primary/10 font-medium text-primary' : ''
                      }`}
                    >
                      {video.title}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">How It Works</h2>
                <ul className="space-y-2 text-sm list-disc pl-4">
                  <li>Only unique video segments count towards progress</li>
                  <li>Your progress is saved automatically</li>
                  <li>Resume from where you left off</li>
                  <li>No credit for skipping or re-watching sections</li>
                  <li>Reset your progress to start over</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex space-x-1 border-b">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'player' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('player')}
              >
                Video Player
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'about' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('about')}
              >
                About This Project
              </button>
            </div>

            {activeTab === 'player' ? (
              <VideoPlayer
                src={selectedVideo.src}
                title={selectedVideo.title}
                videoId={selectedVideo.id}
              />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About This Project</h2>
                  <div className="prose">
                    <p className="mb-4">
                      This project demonstrates an advanced video progress tracking system that addresses 
                      the common issues with traditional video completion tracking.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-2">Key Features</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      <li><strong>Unique Time Tracking:</strong> Only counts sections you haven't seen before</li>
                      <li><strong>Skip Detection:</strong> No credit for skipping parts of the video</li>
                      <li><strong>Interval Merging:</strong> Efficiently combines overlapping watched segments</li>
                      <li><strong>Progress Persistence:</strong> Automatically saves your progress</li>
                      <li><strong>Resume Capability:</strong> Continues from where you left off</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-2">Technical Implementation</h3>
                    <p className="mb-4">
                      The core of this system is the IntervalTracker utility that records and merges 
                      time intervals that have been watched. This approach ensures accurate progress
                      tracking while preventing any attempt to game the system by skipping content.
                    </p>
                    
                    <p>
                      Try it out by watching some parts, skipping around, and then refreshing the page
                      to see how your progress is maintained!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-foreground text-white mt-auto">
        <div className="container py-4">
          <p className="text-center text-sm">
            Lecture Progress Tracker - SDE Intern Assignment © 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
