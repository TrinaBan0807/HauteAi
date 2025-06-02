
# HauteAi - AI-Powered Fashion Search

## Overview

HauteAi is a modern web application that enables users to find fashion items using AI-powered visual search. Users can either take photos with their camera or upload existing images, select specific items within those images, describe them for better accuracy, and get search results for similar fashion items from online stores.

## Features

- **Photo Capture**: Take real-time photos using device camera
- **Image Upload**: Upload existing photos from device storage
- **Interactive Selection**: Click and drag to select specific items in images
- **Smart Description**: Add detailed descriptions to improve search accuracy
- **AI-Powered Search**: Get results for similar fashion items
- **Responsive Design**: Works seamlessly across all device sizes
- **Modern UI**: Beautiful gradient design with smooth animations

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Shadcn/ui component library
- **Icons**: Lucide React
- **State Management**: React hooks (useState)
- **Routing**: React Router DOM

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui base components
│   ├── ImageCapture.tsx    # Camera and upload functionality
│   ├── ImageSelector.tsx   # Image area selection tool
│   ├── OutfitDescriptor.tsx # Item description form
│   └── SearchResults.tsx   # Search results display
├── pages/              # Page components
│   └── Index.tsx       # Main application page
├── lib/                # Utility functions
│   └── utils.ts        # Common utilities
└── hooks/              # Custom React hooks
    └── use-toast.ts    # Toast notification hook
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`

## User Flow

1. **Capture/Upload**: User takes a photo or uploads an image
2. **Select**: User selects the specific fashion item in the image
3. **Describe**: User adds details about the item (type, color, style, etc.)
4. **Search**: System processes the information and returns similar items

## Key Components

### ImageCapture
Handles both camera capture and file upload functionality with a beautiful dual-option interface.

### ImageSelector
Provides an interactive tool for users to select specific areas within uploaded images.

### OutfitDescriptor
Form interface for adding detailed descriptions of selected fashion items.

### SearchResults
Displays the results of the AI-powered fashion search (placeholder implementation).

## Styling and Design

The application uses a modern design system with:
- Purple-to-pink gradient color schemes
- Smooth animations and transitions
- Glass morphism effects
- Responsive grid layouts
- Interactive hover states

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance Considerations

- Tree-shaken icon imports
- Optimized image handling
- Lazy loading where appropriate
- Minimal bundle size with Vite

## Future Enhancements

- Backend integration for actual AI search
- User accounts and search history
- Shopping cart functionality
- Social sharing features
- Advanced filtering options
