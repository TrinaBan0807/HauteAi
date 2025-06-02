
# Component Documentation

## ImageCapture Component

### Purpose
Handles both camera capture and file upload functionality with a dual-option interface.

### Props
```typescript
interface ImageCaptureProps {
  onImageCaptured: (imageUrl: string) => void;
}
```

### Key Features
- **Camera Access**: Uses `navigator.mediaDevices.getUserMedia()` with rear camera preference
- **File Upload**: Supports image file validation and FileReader API
- **Responsive Design**: Grid layout that adapts to different screen sizes
- **Error Handling**: Toast notifications for camera and file errors
- **Canvas Processing**: Converts video stream to image data URL

### State Management
- `isCapturing`: Boolean for camera active state
- `stream`: MediaStream object for camera feed
- `videoRef`: Reference to video element
- `canvasRef`: Reference for image processing
- `fileInputRef`: Reference to hidden file input

### Methods
- `startCamera()`: Initializes camera with error handling
- `stopCamera()`: Cleans up media stream
- `capturePhoto()`: Converts video frame to image
- `handleFileUpload()`: Processes uploaded files

---

## ImageSelector Component

### Purpose
Provides interactive area selection within uploaded images using mouse events.

### Props
```typescript
interface ImageSelectorProps {
  imageUrl: string;
  onAreaSelected: (area: { x: number; y: number; width: number; height: number }) => void;
}
```

### Key Features
- **Click and Drag Selection**: Mouse event handling for area selection
- **Visual Feedback**: Purple overlay showing selected area
- **Coordinate Calculation**: Converts mouse positions to relative coordinates
- **Validation**: Ensures minimum selection size (20x20 pixels)
- **Responsive**: Maintains selection accuracy across different image sizes

### State Management
- `isSelecting`: Boolean for active selection state
- `startPos`: Starting coordinates of selection
- `currentPos`: Current mouse position during selection
- `selectedArea`: Final selected area coordinates

### Selection Logic
```typescript
const area = {
  x: Math.min(startPos.x, currentPos.x),
  y: Math.min(startPos.y, currentPos.y),
  width: Math.abs(currentPos.x - startPos.x),
  height: Math.abs(currentPos.y - startPos.y)
};
```

---

## OutfitDescriptor Component

### Purpose
Form interface for collecting detailed descriptions of selected fashion items.

### Props
```typescript
interface OutfitDescriptorProps {
  selectedImage: string | null;
  selectedArea: any;
  onDescriptionComplete: (description: string) => void;
}
```

### Key Features
- **Structured Input**: Separate fields for different item attributes
- **Quick Selection**: Predefined options for common items/colors/styles
- **Preview Display**: Shows cropped selected area
- **Form Validation**: Ensures meaningful descriptions
- **Flexible Output**: Combines all inputs into searchable description

### Form Fields
- **Item Type**: T-shirt, Dress, Jeans, etc.
- **Color**: Predefined color options
- **Material**: Optional fabric/material input
- **Style**: Casual, Formal, Vintage, etc.
- **Brand**: Optional brand information
- **Additional Details**: Free-form text area

### Quick Options Arrays
```typescript
const quickItems = ['T-shirt', 'Dress', 'Jeans', 'Jacket', ...];
const quickColors = ['Black', 'White', 'Blue', 'Red', ...];
const quickStyles = ['Casual', 'Formal', 'Vintage', ...];
```

---

## Index Page Component

### Purpose
Main application orchestrator that manages the multi-step user flow.

### Key Features
- **Step Management**: Controls progression through capture → select → describe → search
- **Progress Indicator**: Visual representation of current step
- **State Coordination**: Manages data flow between components
- **Responsive Layout**: Adapts to different screen sizes
- **Animation System**: Smooth transitions between steps

### Application State
```typescript
const [currentStep, setCurrentStep] = useState<'capture' | 'select' | 'describe' | 'search'>('capture');
const [capturedImage, setCapturedImage] = useState<string | null>(null);
const [selectedArea, setSelectedArea] = useState<any>(null);
const [outfitDescription, setOutfitDescription] = useState<string>('');
```

### Step Flow Logic
1. **Capture**: User takes/uploads photo → triggers `handleImageCaptured()`
2. **Select**: User selects area → triggers `handleAreaSelected()`
3. **Describe**: User adds description → triggers `handleDescriptionComplete()`
4. **Search**: Display results (placeholder implementation)

### Progress Indicator
Dynamic progress bar that calculates completion percentage based on current step:
```typescript
width: `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%`
```

---

## UI Components

### Button Component (Shadcn/ui)
Extended button component with variants and size options.

### Card Component (Shadcn/ui)
Container component for content sections with consistent styling.

### Input/Textarea Components (Shadcn/ui)
Form input components with consistent styling and focus states.

### Toast System
Notification system for user feedback on errors and success states.

---

## Styling System

### Tailwind Configuration
- Custom animations: fade-in, slide-up, scale-in, float, glow
- Extended color palette with CSS variables
- Responsive breakpoints
- Custom border radius values

### Animation Classes
- `animate-fade-in`: Smooth entry animation
- `animate-slide-up`: Upward slide animation
- `animate-scale-in`: Scale entry animation
- `animate-float`: Floating effect
- `animate-glow`: Glow pulsing effect

### Design Tokens
- Primary gradients: `from-indigo-500 via-purple-500 to-pink-500`
- Hover states: Scale and shadow transformations
- Glass morphism: `backdrop-blur-lg` with opacity overlays
