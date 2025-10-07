# PortEcho Frontend (HTML/CSS/JavaScript)

This is the HTML/CSS/JavaScript version of the PortEcho frontend application.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Interactive Components**: Dynamic forms, accordions, and data tables
- **Real-time Updates**: Simulated real-time data updates
- **Accessibility**: Screen reader friendly with proper ARIA labels

## Pages

- **Dashboard** (`index.html`) - Main overview with statistics and shipments table
- **Login** (`login.html`) - User authentication page
- **Tracking** (`tracking.html`) - Shipment tracking with timeline and sensor data
- **Alerts** (`alerts.html`) - Alert management with filtering and search
- **Analytics** (`analytics.html`) - Data visualization and performance metrics
- **Settings** (`settings.html`) - User preferences and account management

## File Structure

```
frontend-html/
├── index.html              # Dashboard page
├── login.html              # Login page
├── tracking.html           # Tracking page
├── alerts.html             # Alerts page
├── analytics.html          # Analytics page
├── settings.html           # Settings page
├── styles/
│   ├── main.css            # Main styles and layout
│   ├── login.css           # Login page styles
│   ├── alerts.css          # Alerts page styles
│   ├── analytics.css       # Analytics page styles
│   ├── tracking.css        # Tracking page styles
│   └── settings.css        # Settings page styles
└── js/
    ├── main.js             # Core functionality and utilities
    ├── login.js            # Login page functionality
    ├── alerts.js           # Alerts page functionality
    ├── analytics.js        # Analytics page functionality
    ├── tracking.js         # Tracking page functionality
    └── settings.js         # Settings page functionality
```

## Getting Started

1. **Open the application**: Simply open `index.html` in a web browser
2. **Navigate between pages**: Use the navigation menu to switch between different sections
3. **Interactive features**: 
   - Search and filter functionality
   - Form submissions with validation
   - Real-time data updates
   - Responsive navigation

## Key Features

### Dashboard
- Transport statistics with visual indicators
- Shipments table with status tracking
- Responsive grid layout

### Login
- Form validation
- Remember me functionality
- Error handling with user feedback

### Tracking
- Shipment timeline with progress indicators
- Real-time sensor data display
- Route details with expandable sections
- Active alerts monitoring

### Alerts
- Search and filter alerts by severity and status
- Interactive alert management
- Real-time alert updates

### Analytics
- Interactive charts and graphs
- Performance metrics
- Data export functionality
- Filterable data tables

### Settings
- Tabbed interface for different setting categories
- Form persistence with localStorage
- Theme and language selection
- Notification preferences

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- **Font Awesome 6.0.0**: Icons
- **No other external dependencies**

## Customization

### Colors
The color scheme can be customized by modifying CSS custom properties in `main.css`:

```css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #64748b;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
}
```

### Layout
The responsive breakpoints can be adjusted in the CSS files:

```css
@media (max-width: 768px) {
    /* Mobile styles */
}
```

## Performance

- Optimized CSS with minimal redundancy
- Efficient JavaScript with debounced functions
- Lazy loading for better performance
- Minimal external dependencies

## Accessibility

- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast color schemes
- Focus indicators for interactive elements
