
# Technical Documentation

## Architecture Overview

HauteAi follows a component-based architecture built on React with TypeScript, emphasizing modularity and reusability.

### Design Patterns

1. **Container/Presentation Pattern**: Index.tsx acts as container managing state, while child components handle presentation
2. **Unidirectional Data Flow**: Props flow down, callbacks flow up
3. **Single Responsibility**: Each component has one clear purpose
4. **Composition over Inheritance**: Components are composed together rather than extended

### State Management Strategy

The application uses React's built-in state management with `useState` hooks:

```typescript
// Main application state in Index.tsx
const [currentStep, setCurrentStep] = useState<StepType>('capture');
const [capturedImage, setCapturedImage] = useState<string | null>(null);
const [selectedArea, setSelectedArea] = useState<AreaType | null>(null);
const [outfitDescription, setOutfitDescription] = useState<string>('');
```

### Type Definitions

#### Core Types
```typescript
type StepType = 'capture' | 'select' | 'describe' | 'search';

interface AreaType {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface StepInfo {
  id: StepType;
  title: string;
  icon: LucideIcon;
  description: string;
}
```

#### Component Props
```typescript
interface ImageCaptureProps {
  onImageCaptured: (imageUrl: string) => void;
}

interface ImageSelectorProps {
  imageUrl: string;
  onAreaSelected: (area: AreaType) => void;
}

interface OutfitDescriptorProps {
  selectedImage: string | null;
  selectedArea: AreaType | null;
  onDescriptionComplete: (description: string) => void;
}
```

## Browser APIs Used

### MediaDevices API
```typescript
navigator.mediaDevices.getUserMedia({ 
  video: { facingMode: 'environment' } 
})
```
- Access device camera
- Prefer rear-facing camera on mobile
- Handle permission denials gracefully

### Canvas API
```typescript
const context = canvas.getContext('2d');
context.drawImage(video, 0, 0);
const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
```
- Convert video frames to images
- Image compression and format conversion
- Client-side image processing

### File API
```typescript
const reader = new FileReader();
reader.onload = (e) => {
  const imageUrl = e.target?.result as string;
};
reader.readAsDataURL(file);
```
- Handle file uploads
- Convert files to data URLs
- Validate file types

## Performance Optimizations

### Bundle Optimization
- **Tree Shaking**: Only imported Lucide icons are included
- **Code Splitting**: Components are modularly designed for potential lazy loading
- **Asset Optimization**: Images are processed client-side to reduce server load

### Rendering Optimizations
- **useRef for DOM Elements**: Direct DOM access without re-renders
- **Conditional Rendering**: Components only render when needed
- **Event Handler Optimization**: Proper cleanup of event listeners and media streams

### Memory Management
```typescript
const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    setStream(null);
  }
};
```

## Error Handling Strategy

### Camera Access Errors
```typescript
try {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
} catch (error) {
  toast({
    title: "Camera Error",
    description: "Could not access camera. Please check permissions.",
    variant: "destructive",
  });
}
```

### File Upload Validation
```typescript
if (!file.type.startsWith('image/')) {
  toast({
    title: "Invalid File",
    description: "Please select an image file.",
    variant: "destructive",
  });
  return;
}
```

### Selection Validation
```typescript
if (width > 20 && height > 20) {
  // Valid selection
} else {
  // Too small - ignore
}
```

## Responsive Design Implementation

### Breakpoint Strategy
- Mobile-first approach using Tailwind's responsive prefixes
- Grid layouts that adapt: `grid md:grid-cols-2 gap-8`
- Flexible image sizing: `max-h-96 object-contain`

### Touch-Friendly Interactions
- Large touch targets (minimum 44px)
- Clear visual feedback for interactions
- Gesture-friendly selection areas

## Animation System

### CSS Custom Properties
```css
:root {
  --animation-duration: 0.3s;
  --animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Tailwind Animation Configuration
```typescript
keyframes: {
  'fade-in': {
    from: { opacity: '0', transform: 'translateY(20px)' },
    to: { opacity: '1', transform: 'translateY(0)' }
  }
}
```

### Performance Considerations
- Hardware acceleration: `transform` and `opacity` properties
- Will-change hints for smoother animations
- Reduced motion preferences support

## Security Considerations

### File Upload Security
- Client-side file type validation
- File size limitations through browser constraints
- No server-side file storage (client-side processing only)

### Camera Privacy
- Explicit user permission required
- Camera stream properly terminated
- No automatic recording or storage

## Browser Compatibility

### Feature Detection
```typescript
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Camera functionality available
} else {
  // Fallback to file upload only
}
```

### Polyfills and Fallbacks
- FileReader API support check
- Canvas API fallbacks
- Graceful degradation for older browsers

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for consistent formatting
- Functional components with hooks preferred
- Props destructuring for cleaner code

### Component Structure
```typescript
interface ComponentProps {
  // Props definition
}

export const Component = ({ prop1, prop2 }: ComponentProps) => {
  // Hooks
  // Event handlers
  // Render logic
  
  return (
    // JSX
  );
};
```

### Testing Considerations
- Components designed for easy unit testing
- Clear separation of concerns
- Mockable external dependencies (camera, file system)
