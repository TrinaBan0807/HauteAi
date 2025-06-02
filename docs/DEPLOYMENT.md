
# Deployment Guide

## Development Environment

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser with camera support

### Local Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Currently, the application runs entirely client-side with no environment variables required.

## Production Deployment

### Build Process
The application uses Vite for building:
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Static Hosting Options

#### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### 2. Netlify
```bash
# Build command: npm run build
# Publish directory: dist
```

#### 3. GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Performance Optimization

#### Bundle Analysis
```bash
npm run build -- --analyze
```

#### Image Optimization
- Client-side image compression using Canvas API
- Automatic format conversion to JPEG
- Quality settings for optimal file size

### Browser Compatibility

#### Required Features
- MediaDevices API (camera access)
- Canvas API (image processing)
- FileReader API (file uploads)
- ES6+ JavaScript features

#### Fallback Strategy
- Progressive enhancement approach
- File upload fallback when camera unavailable
- Clear error messages for unsupported browsers

### Security Headers

#### Recommended Headers
```
Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Monitoring and Analytics

#### Performance Monitoring
- Core Web Vitals tracking
- Bundle size monitoring
- Error tracking setup

#### User Analytics
- Camera usage metrics
- Upload vs capture preferences
- Step completion rates

### Mobile Considerations

#### PWA Features (Future Enhancement)
- Service worker for offline functionality
- App manifest for installability
- Icon sets for different platforms

#### Mobile Optimization
- Responsive design for all screen sizes
- Touch-optimized interactions
- Camera orientation handling

### CDN and Caching

#### Static Asset Caching
```
# Cache static assets
Cache-Control: public, max-age=31536000, immutable

# Cache HTML with revalidation
Cache-Control: public, max-age=0, must-revalidate
```

#### Image Caching Strategy
- Client-side image caching using browser storage
- Efficient data URL handling
- Memory management for large images

### Troubleshooting

#### Common Issues
1. **Camera not working**: Check HTTPS requirement for camera access
2. **File upload fails**: Verify file size and type restrictions
3. **Images not displaying**: Check data URL handling and CORS policies

#### Debug Mode
Enable browser developer tools for debugging:
- Console logs for error tracking
- Network tab for performance analysis
- Application tab for storage inspection

### Future Backend Integration

#### API Endpoints (When Implemented)
```
POST /api/upload-image
POST /api/search-items
GET /api/search-results/:id
```

#### Database Schema (Planned)
- User sessions
- Search history
- Image metadata
- Search results caching

### Compliance and Privacy

#### GDPR Considerations
- No personal data storage currently
- Camera access requires explicit consent
- Clear privacy policy needed for production

#### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management for step navigation
