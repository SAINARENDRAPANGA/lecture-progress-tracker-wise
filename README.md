
# Lecture Progress Tracking System

A sophisticated video progress tracking system that accurately measures unique video viewing time, preventing common issues like skipping content or counting re-watched segments multiple times.

## Features

### 1. Accurate Progress Tracking
- **Unique Interval Tracking**: Only counts segments that haven't been watched before
- **Skip Prevention**: No credit for skipping or fast-forwarding through content
- **Merged Intervals**: Efficiently combines overlapping watched segments
- **Real-time Updates**: Progress bar updates as user watches new content

### 2. Smart Progress Persistence
- **Local Storage**: Progress is automatically saved to browser storage
- **Resume Capability**: Returns users to their last watched position
- **Persistent Progress**: Maintains accurate viewing history between sessions

### 3. User Interface
- **Video Player**: Clean, intuitive interface with standard video controls
- **Progress Visualization**: Visual progress bar showing watched segments
- **Percentage Display**: Clear numerical progress indicator
- **Multiple Video Support**: Switch between different lecture videos

## Technical Implementation

### Core Components

1. **IntervalTracker Utility** (`src/utils/intervalTracker.ts`)
   - Manages watched time intervals
   - Merges overlapping segments
   - Calculates unique progress percentage
   - Prevents duplicate counting

2. **Video Progress Hook** (`src/hooks/useVideoProgress.ts`)
   - Custom React hook for progress management
   - Handles interval tracking logic
   - Manages local storage persistence
   - Provides progress calculations

3. **Progress Bar Component** (`src/components/ProgressBar.tsx`)
   - Visual representation of watched segments
   - Real-time progress updates
   - Animated progress indicators

4. **Video Player Component** (`src/components/VideoPlayer.tsx`)
   - Main video playback interface
   - Progress tracking integration
   - Resume position functionality
   - Playback controls

### Key Features Explained

#### Interval Tracking Logic
The system tracks video watching progress using time intervals:
```typescript
type Interval = [number, number]; // [startTime, endTime]
```

When a user watches video segments:
1. New intervals are recorded as they watch
2. Overlapping intervals are automatically merged
3. Progress is calculated based on unique time watched

#### Progress Calculation
Progress is determined by:
1. Total unique seconds watched / Total video duration
2. Only counting previously unwatched segments
3. Merging overlapping intervals to prevent double-counting

#### Data Persistence
The system uses local storage to:
- Save watched intervals
- Store last watched position
- Maintain progress between sessions

## Development Decisions

1. **Local Storage**: Chosen for simplicity and immediate persistence without backend requirements
2. **Interval Tracking**: Used for precise progress measurement and overlap prevention
3. **Component Separation**: Clear separation of concerns between tracking logic and UI
4. **React Hooks**: Custom hooks for reusable progress tracking logic

## Built With

- React + TypeScript
- Tailwind CSS for styling
- shadcn/ui for UI components
- Vite for build tool

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Future Improvements

1. Backend Integration: Add server-side progress storage
2. Multi-device Sync: Synchronize progress across devices
3. Analytics: Track viewing patterns and engagement metrics
4. Offline Support: Enable offline progress tracking

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT License - see the [LICENSE](LICENSE) file for details
