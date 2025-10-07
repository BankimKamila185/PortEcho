# PortEcho
# PortEcho IoT Container Tracker - Complete Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Pages & Modules](#pages--modules)
5. [Data Structures](#data-structures)
6. [Algorithms & Optimization](#algorithms--optimization)
7. [Firebase Integration](#firebase-integration)
8. [User Guide](#user-guide)
9. [Admin Guide](#admin-guide)
10. [Security & Authentication](#security--authentication)
11. [API Reference](#api-reference)
12. [Deployment](#deployment)

---

## System Overview

**PortEcho** is a real-time IoT container tracking system designed for logistics and shipping companies. It provides comprehensive tracking, analytics, and management capabilities for shipping containers across multiple transport modes (Ship, Air, Train, Truck).

### Key Capabilities
- Real-time container tracking with live status updates
- Multi-modal transport support
- Sensor data monitoring (temperature, humidity, weather)
- QR code generation for container identification
- Journey history and event logging
- Advanced analytics and reporting
- Alert management system
- PDF invoice generation
- CSV data export

### Technology Stack
- **Frontend**: HTML5, CSS3, Tailwind CSS, Vanilla JavaScript
- **Backend**: Firebase (Firestore, Authentication)
- **Maps**: Leaflet.js
- **Charts**: Chart.js
- **QR Codes**: QRious, Html5-QRCode
- **PDF**: jsPDF

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                  Client Layer                    │
│  (Web Browsers - Desktop, Mobile, Tablet)       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              Presentation Layer                  │
│  ┌─────────┬──────────┬───────────┬──────────┐ │
│  │ Login   │Dashboard │ Tracking  │Analytics │ │
│  └─────────┴──────────┴───────────┴──────────┘ │
│  ┌─────────┬──────────────────────────────────┐ │
│  │ Admin   │ Settings │ Container Forms      │ │
│  └─────────┴──────────┴──────────────────────┘ │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              Business Logic Layer                │
│  • Authentication & Authorization                │
│  • Data Validation & Processing                  │
│  • Real-time Updates (Listeners)                 │
│  • Analytics Computation                         │
│  • QR Code Generation                            │
│  • PDF Generation                                │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                 Data Layer                       │
│  Firebase Firestore Collections:                 │
│  • sensors (container & journey data)            │
│  • carriers (carrier performance data)           │
│  Firebase Authentication                          │
└─────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → UI Event → Validation → Firebase Operation → Real-time Listener → UI Update
```

---

## Features

### 1. **User Authentication**
- Email/Password login
- Google OAuth integration
- Session management
- Admin role-based access
- Demo mode (no network required)

### 2. **Dashboard**
- Real-time container statistics by transport mode
- Live container status overview
- Active alerts display
- Recent activity log
- Searchable container table
- Quick-add new shipment

### 3. **Shipment Tracking**
- Detailed container list with search
- Interactive map with real-time markers
- Journey history timeline
- Sensor data (temperature, humidity, weather)
- Event log with timestamps
- Dynamic alerts system

### 4. **Reports & Analytics**
- Total shipment metrics
- Success rate calculation
- Transport mode distribution (pie charts)
- Status distribution (online, pending, failed)
- Carrier performance table
- Sortable and filterable data
- Live data updates

### 5. **Admin Panel**
- Sensor registration with QR generation
- Journey creation and updates
- QR code scanning
- PDF invoice generation
- CSV data export
- Bulk sensor management

### 6. **Settings**
- Personal information management
- Password change
- Notification preferences
- Third-party integrations
- Display customization (theme, font size)
- Compact mode toggle

---

## Pages & Modules

### 1. Login Page (`login.html`)

**Purpose**: User authentication gateway

**Features**:
- Email/password authentication
- Google Sign-In
- Remember me option
- Forgot password link
- Auto-redirect on successful login
- Error handling

**Key Code Structure**:
```javascript
// Firebase Auth
auth.signInWithEmailAndPassword(email, password)
auth.signInWithPopup(provider)
```

**Navigation**: On success → `dashboard.html?ownerEmail={email}`

---

### 2. Dashboard (`dashboard.html`)

**Purpose**: Main overview and statistics

**Key Components**:
- **Stats Grid**: Ship, Air, Truck, Train, Total counts
- **Container Status**: Live status with pulse animation
- **Alert Log**: Critical and warning alerts
- **All Shipments Table**: Comprehensive list

**Data Structures**:
```javascript
allSensors = [
  {
    sensorId: "SEN-XXX",
    containerNumber: "CONT-XXX",
    company: "Company Name",
    ownerName: "Owner",
    ownerEmail: "email@example.com",
    routeFrom: "Mumbai",
    routeTo: "Dubai",
    transportMode: "Ship",
    status: "online" | "offline",
    journeyHistory: [...]
  }
]
```

**Key Functions**:
- `loadData(userEmail)`: Fetches sensors from Firestore
- `updateDashboard(sensors)`: Updates UI with sensor data
- `updateTable(sensors)`: Renders sensor table
- Search filtering by sensorId, container, company

**Algorithms**:
- **Counting**: `filter().length` for mode-based counts (O(n))
- **Searching**: Linear search on multiple fields (O(n))
- **Sorting**: Implicit by Firestore `createdAt` order

---

### 3. Tracking Page (`tracking.html`)

**Purpose**: Detailed container tracking with map visualization

**Key Components**:
- **Container List Table**: All sensors with selection
- **Interactive Map**: Leaflet.js with markers
- **Shipment Information**: Origin, destination, status, ETA
- **Sensor Data**: Humidity, temperature, weather
- **Event Log**: Timeline of journey events
- **Alerts Panel**: Real-time alerts

**Map Integration**:
```javascript
// Initialize Leaflet map
const map = L.map('map').setView([20.5937, 78.9629], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add markers
const marker = L.marker([lat, lng]).addTo(map);
marker.bindPopup(`<strong>${containerNumber}</strong>`);
```

**Data Structures**:
- **City Coordinates Hash Map**: O(1) lookup
```javascript
const cityCoords = {
  mumbai: [19.076, 72.8777],
  dubai: [25.2048, 55.2708],
  ...
};
```

**Key Functions**:
- `loadData(userEmail)`: Fetches and processes sensors
- `renderTable(sensors)`: Displays table with click handlers
- `displayDetails(sensor)`: Shows selected sensor info
- `updateMap(sensors)`: Adds markers to map
- `updateEventLog(sensor)`: Displays journey events
- `updateAlerts(sensor)`: Shows sensor-specific alerts

**Algorithms**:
- **Array Access**: Latest journey via `array[length-1]` (O(1))
- **Filtering**: Offline sensors via `filter()` (O(n))
- **Mapping**: Coordinate lookup via hash map (O(1))
- **Search**: Multi-field linear search (O(n))

---

### 4. Analytics Page (`analytics.html`)

**Purpose**: Reports and performance metrics

**Key Components**:
- **Stats Cards**: Total shipments, success rate, pending, failed
- **Mode Distribution Chart**: Doughnut chart (Truck, Ship, Air, Train)
- **Status Distribution Chart**: Success, Pending, Failed
- **Carrier Performance Table**: Sortable and filterable

**Chart Implementation**:
```javascript
// Doughnut chart with Chart.js
new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Truck", "Ship", "Air", "Train"],
    datasets: [{
      data: [modes.Truck, modes.Ship, modes.Air, modes.Train],
      backgroundColor: ["#00a9ff", "#38bdf8", "#67e8f9", "#2dd4bf"]
    }]
  }
});
```

**Calculations**:
- **Success Rate**: `(online / total) * 100`
- **Mode Percentage**: `(modeCount / totalModes) * 100`
- **Status Distribution**: Counts by status

**Data Structures**:
- **Mode Mapping Object**: 
```javascript
const modeMap = { 
  truck: 'Truck', 
  train: 'Train', 
  air: 'Air', 
  ship: 'Ship' 
};
```

**Key Functions**:
- `updateAnalytics(sensors)`: Processes and displays metrics
- `drawCharts(modes, online, pending, failed)`: Renders charts
- `renderCarrierTable(carriers)`: Displays carrier performance

**Algorithms**:
- **Aggregation**: `reduce()` for totals (O(n))
- **Grouping**: Mode counting via object accumulation (O(n))
- **Sorting**: Carrier table by success rate or containers (O(n log n))
- **Filtering**: By transport mode (O(n))

---

### 5. Admin Panel (`admin.html`)

**Purpose**: Sensor registration and management

**Key Components**:

#### A. Registration Section
- Owner information form
- Container details
- QR code generation (fixed sensor ID)
- Duplicate detection

**Sensor Registration Flow**:
```javascript
1. Generate unique sensor ID: generateSensorId()
2. Check for duplicates: Firestore query
3. Create sensor document
4. Generate QR code: QRious library
```

**Unique ID Generation**:
```javascript
function generateSensorId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "SEN-";
  for(let i=0; i<6; i++) 
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}
```

#### B. Update/Start Journey Section
- Sensor fetch by ID or QR scan
- Pre-filled journey information
- Journey history display
- Dynamic QR generation
- PDF invoice generation

**Journey Data Structure**:
```javascript
{
  from: "Mumbai",
  to: "Dubai",
  mode: "Ship",
  expectedDelivery: "2025-11-15",
  carrierName: "Global Shipping Co.",
  carrierContact: "+1234567890",
  items: {
    description: "Electronics",
    quantity: 100,
    weight: 500
  },
  startTime: "2025-10-07T10:00:00Z"
}
```

**Update Operations**:
1. **Update Latest Journey**: Modifies last array element
2. **Start New Journey**: Appends new journey to array

```javascript
// Firebase array operations
firebase.firestore.FieldValue.arrayRemove(oldJourney)
firebase.firestore.FieldValue.arrayUnion(newJourney)
```

#### C. Sensor List & Export
- All sensors table
- CSV export functionality

**CSV Generation**:
```javascript
exportCsvBtn.addEventListener('click', async()=>{
  const snapshot = await db.collection('sensors').get();
  let csv = 'SensorId,Container,Owner,Company,Email,Phone\n';
  snapshot.docs.forEach(doc => {
    const s = doc.data();
    csv += `${s.sensorId},${s.containerNumber},...\n`;
  });
  // Create blob and download
});
```

---

### 6. Settings Page (`settings.html`)

**Purpose**: User preferences and account management

**Sections**:
1. **Personal Information**: Name, email, profile picture
2. **Change Password**: Security management
3. **Notifications**: Email/push preferences
4. **Integrations**: Third-party service connections
5. **Display**: Theme, font size, compact mode

**Compact Mode Implementation**:
```javascript
// Toggle compact CSS class
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('compact-mode');
  const isCompact = localStorage.getItem('compactMode') === 'true';
  
  if (isCompact) {
    document.documentElement.classList.add('compact');
  }
  
  toggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.documentElement.classList.add('compact');
      localStorage.setItem('compactMode', 'true');
    } else {
      document.documentElement.classList.remove('compact');
      localStorage.setItem('compactMode', 'false');
    }
  });
});
```

---

## Data Structures

### 1. Sensor Document (Firestore)

```javascript
{
  sensorId: String,              // Unique: "SEN-XXXXXX"
  ownerName: String,
  ownerEmail: String,            // Indexed for queries
  ownerPhone: String,
  company: String,
  containerNumber: String,       // Unique identifier
  size: String,                  // "20ft" | "40ft"
  type: String,                  // "Dry" | "Reefer"
  createdAt: Timestamp,
  journeyHistory: Array<Journey> // Ordered chronologically
}
```

### 2. Journey Object

```javascript
{
  from: String,
  to: String,
  mode: String,                  // "Ship" | "Air" | "Train" | "Truck"
  expectedDelivery: String,      // ISO date
  carrierName: String,
  carrierContact: String,
  items: {
    description: String,
    quantity: Number,
    weight: Number
  },
  startTime: String              // ISO timestamp
}
```

### 3. Carrier Document (Firestore)

```javascript
{
  name: String,
  containers: Number,            // Total handled
  successRate: Number,           // Percentage
  onTime: String,                // Percentage as string
  mode: String                   // Transport mode
}
```

### 4. In-Memory Processed Sensor

```javascript
{
  ...originalSensorData,
  routeFrom: String,             // Extracted from latest journey
  routeTo: String,
  transportMode: String,
  eta: String,
  status: "online" | "offline",  // Computed
  humidity: Number,              // Simulated sensor data
  temperature: Number,
  weather: String
}
```

---

## Algorithms & Optimization

### 1. Searching Algorithms

#### Linear Search (O(n))
Used for filtering containers by multiple fields:

```javascript
// Search implementation
const filtered = allSensors.filter(s => 
  s.sensorId?.toLowerCase().includes(query) ||
  s.containerNumber?.toLowerCase().includes(query) ||
  s.company?.toLowerCase().includes(query)
);
```

**Optimization**: For large datasets, implement:
- **Hash Map Index**: Pre-index by sensorId for O(1) lookup
- **Trie Structure**: For prefix searching on container numbers

#### Hash Map Lookup (O(1))
City coordinates for map markers:

```javascript
const cityCoords = {
  mumbai: [19.076, 72.8777],
  dubai: [25.2048, 55.2708]
};

const coords = cityCoords[city.toLowerCase()]; // O(1)
```

### 2. Sorting Algorithms

#### Built-in Sort (O(n log n))
Carrier performance sorting:

```javascript
const sorted = carriers.sort((a, b) => {
  const aVal = parseFloat(a[sortBy]) || 0;
  const bVal = parseFloat(b[sortBy]) || 0;
  return bVal - aVal; // Descending
});
```

**Algorithm**: JavaScript uses Timsort (hybrid of merge sort and insertion sort)

### 3. Aggregation Algorithms

#### Mode Counting (O(n))
```javascript
const modes = { Truck: 0, Ship: 0, Air: 0, Train: 0 };

sensors.forEach(s => {
  const key = modeMap[s.transportMode.toLowerCase()] || 'Ship';
  if (modes[key] !== undefined) modes[key]++;
});
```

#### Success Rate Calculation (O(n))
```javascript
const online = sensors.filter(s => s.status === 'online').length;
const successRate = ((online / total) * 100).toFixed(1);
```

### 4. Array Operations

#### Latest Element Access (O(1))
```javascript
const latestJourney = journeyHistory[journeyHistory.length - 1];
```

#### Array Mapping for UI (O(n))
```javascript
const html = sensors.map((s, i) => `
  <tr data-index="${i}">
    <td>${s.sensorId}</td>
    <td>${s.containerNumber}</td>
  </tr>
`).join('');
```

### 5. Optimization Strategies

#### Real-time Listeners
```javascript
// Efficient: Only listen to user's sensors
db.collection("sensors")
  .where("ownerEmail", "==", userEmail)
  .onSnapshot(snapshot => {
    // Process only changed documents
  });
```

#### Lazy Loading
- Dashboard loads only necessary data initially
- Map markers created on-demand
- Event logs generated when sensor selected

#### Caching
```javascript
// Cache carrier data to avoid repeated queries
let carriersCache = null;
if (!carriersCache) {
  carriersCache = await db.collection('carriers').get();
}
```

#### Duplicate Prevention
```javascript
// Check before registration (O(1) with index)
const existing = await db.collection('sensors')
  .where('containerNumber', '==', containerNumber)
  .where('ownerEmail', '==', ownerEmail)
  .get();
```

---

## Firebase Integration

### Collection Structure

```
portecho-5d71e (Project)
├── sensors (Collection)
│   ├── {autoId} (Document)
│   │   ├── sensorId: "SEN-ABC123"
│   │   ├── ownerEmail: "user@example.com"
│   │   ├── journeyHistory: [...]
│   │   └── createdAt: Timestamp
│   └── ...
└── carriers (Collection)
    ├── {autoId} (Document)
    │   ├── name: "Global Shipping Co."
    │   ├── containers: 4520
    │   └── successRate: 99.2
    └── ...
```

### Query Patterns

#### 1. User-Specific Queries (Filtered)
```javascript
db.collection("sensors")
  .where("ownerEmail", "==", userEmail)
  .onSnapshot(callback);
```

**Index Required**: `ownerEmail` (ascending)

#### 2. All Sensors (Admin)
```javascript
db.collection("sensors")
  .orderBy("createdAt", "desc")
  .get();
```

**Index Required**: `createdAt` (descending)

#### 3. Duplicate Check
```javascript
db.collection("sensors")
  .where("containerNumber", "==", container)
  .where("ownerEmail", "==", email)
  .get();
```

**Composite Index Required**: `containerNumber, ownerEmail`

### Real-time Updates

```javascript
let unsubscribe = db.collection("sensors")
  .where("ownerEmail", "==", userEmail)
  .onSnapshot(
    snapshot => {
      snapshot.docs.forEach(doc => {
        console.log("Updated:", doc.id);
      });
    },
    error => console.error(error)
  );

// Cleanup
unsubscribe();
```

### Array Operations

```javascript
// Add journey
await db.collection("sensors").doc(docId).update({
  journeyHistory: firebase.firestore.FieldValue.arrayUnion(newJourney)
});

// Remove journey
await db.collection("sensors").doc(docId).update({
  journeyHistory: firebase.firestore.FieldValue.arrayRemove(oldJourney)
});
```

### Authentication

```javascript
// Email/Password
await auth.signInWithEmailAndPassword(email, password);

// Google OAuth
const provider = new firebase.auth.GoogleAuthProvider();
await auth.signInWithPopup(provider);

// Auth State Listener
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("Logged in:", user.email);
  } else {
    console.log("Logged out");
  }
});
```

---

## User Guide

### Getting Started

#### 1. Login
1. Navigate to `login.html`
2. Enter email and password OR click "Sign in with Google"
3. On success, redirected to dashboard

#### 2. Dashboard Overview
- View container counts by transport mode
- See live container status
- Check active alerts
- Search containers using search box
- Click "New Shipment" to add container

#### 3. Tracking Containers
1. Go to "Shipment Tracking" from sidebar
2. Select container from table
3. View details: route, status, ETA, sensor data
4. Check map for location
5. Review event log and alerts

#### 4. View Analytics
1. Navigate to "Reports & Analytics"
2. View metrics: total shipments, success rate
3. Analyze transport mode distribution
4. Review carrier performance
5. Sort/filter carriers by criteria

#### 5. Settings
1. Go to "Settings" from sidebar
2. Update personal information
3. Change password
4. Configure notifications
5. Customize display (theme, compact mode)

---

## Admin Guide

### Sensor Registration

#### Step 1: Register Sensor
1. Login with admin credentials
2. Navigate to "Register Sensor" section
3. Fill in:
   - Owner details (name, email, phone)
   - Company name
   - Container number (unique)
   - Size (20ft/40ft)
   - Type (Dry/Reefer)
4. Click "Register Sensor"
5. QR code generated automatically
6. Download QR code for physical attachment

#### Step 2: Update/Start Journey
1. Go to "Update / Start Journey" section
2. Enter sensor ID OR scan QR code
3. Click "Fetch" to load sensor details
4. Fill journey information:
   - From/To locations
   - Transport mode
   - Expected delivery date
   - Carrier details
   - Item details
5. Choose action:
   - **Update Latest Journey**: Modifies current journey
   - **Start New Journey**: Creates new journey entry

#### Step 3: Generate Invoice
1. After updating journey, scroll to PDF section
2. Review journey QR code
3. Click "Download PDF Invoice"
4. PDF includes:
   - Sensor information
   - Owner details
   - Journey details
   - Carrier information
   - Cargo details
   - QR code

### Bulk Operations

#### Export All Sensors
1. Navigate to "All Sensors" section
2. Review sensor list
3. Click "Export CSV"
4. CSV includes: SensorId, Container, Owner, Company, Email, Phone

---

## Security & Authentication

### Authentication Flow

```
User → Login Page → Firebase Auth → Token → Protected Pages
```

### Role-Based Access

#### Admin Users
```javascript
const ADMINS = [
  "admin@portecho.com",
  "admin1@example.com",
  "admin2@example.com"
];

auth.onAuthStateChanged(user => {
  if (user && ADMINS.includes(user.email)) {
    // Grant admin access
  }
});
```

#### Regular Users
- Can only view/manage their own sensors
- Filtered queries by `ownerEmail`

### Data Security

#### Firestore Rules (Recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Sensors: Users can only read their own
    match /sensors/{sensorId} {
      allow read: if request.auth != null && 
                     resource.data.ownerEmail == request.auth.token.email;
      allow write: if request.auth != null && 
                      request.auth.token.email in ['admin@portecho.com'];
    }
    
    // Carriers: Read-only for all authenticated users
    match /carriers/{carrierId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.email in ['admin@portecho.com'];
    }
  }
}
```

### Session Management
```javascript
// Logout
auth.signOut().then(() => {
  window.location.href = "login.html";
});

// Auto-redirect if not authenticated
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  }
});
```

---

## API Reference

### Firebase Methods

#### Authentication
```javascript
// Sign In
auth.signInWithEmailAndPassword(email, password)
  .then(userCredential => { /* Success */ })
  .catch(error => { /* Handle error */ });

// Sign Out
auth.signOut()
  .then(() => { /* Success */ });

// Auth State
auth.onAuthStateChanged(user => { /* Handle state */ });
```

#### Firestore Queries

```javascript
// Get all sensors
db.collection("sensors").get()
  .then(snapshot => {
    snapshot.forEach(doc => console.log(doc.data()));
  });

// Get with filter
db.collection("sensors")
  .where("ownerEmail", "==", email)
  .get();

// Real-time listener
db.collection("sensors")
  .onSnapshot(snapshot => {
    // Handle updates
  });

// Add document
db.collection("sensors").add(data)
  .then(docRef => console.log("ID:", docRef.id));

// Update document
db.collection("sensors").doc(docId).update({ field: value });

// Delete document
db.collection("sensors").doc(docId).delete();
```

### QR Code Generation

```javascript
// Generate QR with QRious
new QRious({
  element: canvasElement,
  value: "SEN-ABC123",
  size: 200
});

// Download QR
const link = document.createElement('a');
link.download = 'sensor_qr.png';
link.href = canvas.toDataURL();
link.click();
```

### PDF Generation

```javascript
const { jsPDF } = window.jspdf;
const doc = new jsPDF();

doc.setFontSize(20);
doc.text('Invoice', 105, 20, { align: 'center' });
doc.setFontSize(10);
doc.text('Sensor ID: SEN-123', 20, 40);
doc.addImage(qrDataURL, 'PNG', 160, 30, 40, 40);
doc.save('invoice.pdf');
```

### Map Integration

```javascript
// Initialize map
const map = L.map('map').setView([lat, lng], zoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add marker
const marker = L.marker([lat, lng]).addTo(map);
marker.bindPopup('<b>Container Info</b>');
```

### Charts

```javascript
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Label1', 'Label2'],
    datasets: [{
      data: [value1, value2],
      backgroundColor: ['#color1', '#color2']
    }]
  },
  options: { /* options */ }
});
```

---

## Deployment

### Prerequisites
- Firebase project setup
- Firebase Authentication enabled (Email/Password, Google)
- Firestore database created
- Web hosting (Firebase Hosting, Netlify, Vercel, etc.)

### Setup Steps

#### 1. Firebase Configuration
Update Firebase config in all HTML files:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

#### 2. Firestore Indexes
Create required indexes in Firebase Console:
- Collection: `sensors`, Fields: `ownerEmail` (Ascending), `createdAt` (Descending)
- Collection: `sensors`, Fields: `containerNumber` (Ascending), `ownerEmail` (Ascending)

#### 3. Security Rules
Deploy Firestore security rules (see Security section)

#### 4. Deploy Files
```bash
# Firebase Hosting
firebase init hosting
firebase deploy

# Or upload to any static hosting:
# - Netlify (drag & drop)
# - Vercel (Git integration)
# - AWS S3 + CloudFront
```

#### 5. Environment Setup
- Set admin emails in `admin.html`
- Configure default carrier data in `analytics.html`

### File Structure
```
portecho/
├── login.html
├── dashboard.html
├── tracking.html
├── analytics.html
├── admin.html
├── settings.html
├── container-form.html (if exists)
└── assets/ (images, if any)
```

### Performance Optimization
1. **Enable CDN caching** for libraries (Tailwind, Firebase, etc.)
2. **Compress images** and assets
3. **Minify JavaScript** code in production
4. **Use Firebase indexes** for all queries
5. **Implement pagination** for large datasets
6. **Lazy load** images and heavy components

---

## Troubleshooting

### Common Issues

#### 1. "No sensors found"
- **Cause**: User email mismatch or no data
- **Solution**: Check `ownerEmail` in Firestore matches logged-in email

#### 2. Charts not displaying
- **Cause**: No data or Chart.js not loaded
- **Solution**: Verify sensor data exists and CDN loaded

#### 3. Map not showing
- **Cause**: Leaflet.js not loaded or invalid coordinates
- **Solution**: Check console for errors, verify CDN

#### 4. Authentication errors
- **Cause**: Incorrect Firebase config or disabled auth methods
- **Solution**: Verify Firebase config and enable auth in console

#### 5. Permission denied (Firestore)
- **Cause**: Security rules too restrictive
- **Solution**: Review and update Firestore rules

---

## Future Enhancements

### Planned Features
1. **Mobile App**: React Native/Flutter version
2. **Push Notifications**: Real-time alerts
3. **Advanced Analytics**: Predictive ETA, route optimization
4. **Multi-language Support**: i18n integration
5. **Geofencing**: Automatic status updates based on location
6. **IoT Integration**: Real sensor hardware integration
7. **Blockchain**: Immutable journey records
8. **AI/ML**: Anomaly detection, demand forecasting

---

## Support & Contact

For issues, questions, or contributions:
- **Email**: support@portecho.com
- **Documentation**: https://docs.portecho.com
- **GitHub**: https://github.com/portecho/container-tracker

---

## Advanced Topics

### Real-time Data Synchronization

#### Firestore Snapshots
PortEcho uses Firestore's real-time listeners for instant updates:

```javascript
// Real-time listener pattern
let unsubscribe = db.collection("sensors")
  .where("ownerEmail", "==", userEmail)
  .onSnapshot(
    snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          console.log("New sensor:", change.doc.data());
        }
        if (change.type === "modified") {
          console.log("Modified sensor:", change.doc.data());
        }
        if (change.type === "removed") {
          console.log("Removed sensor:", change.doc.data());
        }
      });
    },
    error => {
      console.error("Snapshot error:", error);
    }
  );

// Always cleanup when leaving page
window.addEventListener('beforeunload', () => {
  if (unsubscribe) unsubscribe();
});
```

#### Optimistic UI Updates
For better UX, implement optimistic updates:

```javascript
// Update UI immediately
updateUIWithNewJourney(newJourney);

// Then sync with Firebase
try {
  await db.collection("sensors").doc(docId).update({
    journeyHistory: firebase.firestore.FieldValue.arrayUnion(newJourney)
  });
  // Success feedback
} catch (error) {
  // Rollback UI on error
  revertUIUpdate();
  showError(error.message);
}
```

---

## Data Flow Diagrams

### User Journey Flow

```
┌──────────────────────────────────────────────────────────┐
│                    User Opens Website                     │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │   Login Page  │
                └───────┬───────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │   Firebase Authentication     │
        │   • Email/Password            │
        │   • Google OAuth              │
        └───────┬───────────────────────┘
                │
                ▼
        ┌───────────────┐
        │  Authenticated? │
        └───┬───────┬───┘
            │       │
         YES│       │NO → Redirect to Login
            │       │
            ▼       ▼
    ┌────────────┐  ┌─────────────┐
    │ Dashboard  │  │ Show Error  │
    └─────┬──────┘  └─────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│      Real-time Data Listeners       │
│  • Load user's sensors              │
│  • Subscribe to updates             │
│  • Calculate statistics             │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│     User Interactions Available     │
│  • View Dashboard                   │
│  • Track Shipments                  │
│  • View Analytics                   │
│  • Update Settings                  │
└─────────────────────────────────────┘
```

### Admin Sensor Registration Flow

```
┌─────────────────────────────────────────────┐
│        Admin Enters Sensor Details          │
│  • Owner Info                               │
│  • Container Number                         │
│  • Company                                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Generate Sensor ID  │
        │   (SEN-XXXXXX)       │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Check for Duplicate │
        │  (Container + Owner) │
        └──────┬───────┬───────┘
               │       │
          Found│       │Not Found
               │       │
               ▼       ▼
        ┌──────────┐  ┌─────────────────┐
        │  Error   │  │ Create Document │
        │ Message  │  │  in Firestore   │
        └──────────┘  └────────┬────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │ Generate QR Code │
                    │  (Fixed Sensor)  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Display Success  │
                    │ + Download QR    │
                    └──────────────────┘
```

### Journey Update Flow

```
┌──────────────────────────────────────┐
│   Admin Fetches Sensor by ID/QR     │
└───────────────┬──────────────────────┘
                │
                ▼
     ┌──────────────────────┐
     │  Load Sensor from    │
     │     Firestore        │
     └──────┬──────┬────────┘
            │      │
       Found│      │Not Found
            │      │
            ▼      ▼
    ┌──────────┐  ┌────────┐
    │ Display  │  │ Error  │
    │ Details  │  │Message │
    └────┬─────┘  └────────┘
         │
         ▼
┌────────────────────────┐
│ Admin Chooses Action:  │
│ 1. Update Latest       │
│ 2. Start New Journey   │
└────┬───────────┬───────┘
     │           │
     ▼           ▼
┌─────────┐  ┌────────────┐
│ Modify  │  │   Append   │
│ Last    │  │    New     │
│ Element │  │   Object   │
└────┬────┘  └─────┬──────┘
     │             │
     └──────┬──────┘
            │
            ▼
  ┌─────────────────────┐
  │  Firebase Update    │
  │  (arrayRemove +     │
  │   arrayUnion OR     │
  │   arrayUnion only)  │
  └─────────┬───────────┘
            │
            ▼
  ┌─────────────────────┐
  │  Generate Dynamic   │
  │  Journey QR Code    │
  └─────────┬───────────┘
            │
            ▼
  ┌─────────────────────┐
  │  Update UI +        │
  │  PDF Invoice Ready  │
  └─────────────────────┘
```

---

## Performance Metrics

### Key Performance Indicators (KPIs)

#### Page Load Times (Target)
- **Login**: < 1.5s
- **Dashboard**: < 2.5s (with data)
- **Tracking**: < 2s + map load (< 3s total)
- **Analytics**: < 2s + chart render (< 3s total)
- **Admin**: < 2s

#### Database Query Performance
- **Single sensor fetch**: < 200ms
- **User sensors query**: < 500ms (< 50 sensors)
- **All sensors (admin)**: < 1s (< 500 sensors)

#### Real-time Update Latency
- **Sensor status change**: < 2s propagation
- **New journey added**: < 3s UI update

### Optimization Techniques Applied

#### 1. Query Optimization
```javascript
// ❌ Bad: Fetch all then filter in memory
const all = await db.collection("sensors").get();
const filtered = all.docs.filter(d => d.data().ownerEmail === email);

// ✅ Good: Filter at database level
const filtered = await db.collection("sensors")
  .where("ownerEmail", "==", email)
  .get();
```

#### 2. Pagination (for large datasets)
```javascript
// Implement cursor-based pagination
let lastVisible = null;

async function loadMore() {
  let query = db.collection("sensors")
    .orderBy("createdAt", "desc")
    .limit(20);
  
  if (lastVisible) {
    query = query.startAfter(lastVisible);
  }
  
  const snapshot = await query.get();
  lastVisible = snapshot.docs[snapshot.docs.length - 1];
  
  return snapshot.docs.map(doc => doc.data());
}
```

#### 3. Debounced Search
```javascript
// Prevent excessive queries on search
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch(e.target.value);
  }, 300); // Wait 300ms after user stops typing
});
```

#### 4. Lazy Loading Components
```javascript
// Load map only when needed
let mapLoaded = false;
function showTrackingPage() {
  if (!mapLoaded) {
    initializeMap();
    mapLoaded = true;
  }
  // Show page
}
```

---

## Code Quality Standards

### Naming Conventions

#### Variables & Functions
```javascript
// Use camelCase
let sensorCount = 0;
function calculateSuccessRate() { }

// Constants in UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const ADMIN_EMAILS = ["admin@portecho.com"];

// Boolean prefixes: is, has, should
let isAuthenticated = false;
let hasJourney = true;
let shouldUpdate = false;
```

#### DOM Elements
```javascript
// Prefix with element type or use descriptive names
const loginBtn = document.getElementById('loginBtn');
const searchInput = document.getElementById('searchInput');
const containerTable = document.getElementById('containerTable');
```

### Error Handling

#### Comprehensive Try-Catch
```javascript
async function fetchSensorData(sensorId) {
  try {
    // Validate input
    if (!sensorId) {
      throw new Error('Sensor ID is required');
    }
    
    // Perform operation
    const snapshot = await db.collection('sensors')
      .where('sensorId', '==', sensorId)
      .get();
    
    // Check result
    if (snapshot.empty) {
      throw new Error('Sensor not found');
    }
    
    return snapshot.docs[0].data();
    
  } catch (error) {
    // Log error
    console.error('Error fetching sensor:', error);
    
    // User-friendly message
    showError('Unable to load sensor. Please try again.');
    
    // Optional: Send to error tracking service
    // trackError(error);
    
    return null;
  }
}
```

#### Graceful Degradation
```javascript
// Fallback for offline mode
auth.onAuthStateChanged(user => {
  if (!user) {
    console.log("No user - loading demo data");
    loadDemoData(); // Fallback to cached/demo data
    return;
  }
  loadUserData(user.email);
});
```

### Code Documentation

```javascript
/**
 * Fetches sensor data and processes journey information
 * @param {string} sensorId - Unique sensor identifier (SEN-XXXXXX)
 * @returns {Promise<Object|null>} Processed sensor object or null if not found
 * @throws {Error} If Firebase query fails
 * 
 * @example
 * const sensor = await fetchSensor('SEN-ABC123');
 * if (sensor) {
 *   displaySensorDetails(sensor);
 * }
 */
async function fetchSensor(sensorId) {
  // Implementation
}
```

---

## Testing Guidelines

### Manual Testing Checklist

#### Authentication
- [ ] Login with valid email/password
- [ ] Login with invalid credentials (error shown)
- [ ] Google Sign-In flow
- [ ] Logout functionality
- [ ] Session persistence (refresh page)
- [ ] Unauthorized access redirect

#### Dashboard
- [ ] Container counts display correctly
- [ ] Status indicators update in real-time
- [ ] Search filters containers
- [ ] Table displays all user sensors
- [ ] Alert log shows offline containers
- [ ] New shipment button navigates correctly

#### Tracking
- [ ] Container table loads
- [ ] Clicking container shows details
- [ ] Map displays markers
- [ ] Sensor data displays
- [ ] Event log populates
- [ ] Alerts show for selected container
- [ ] Search filters work

#### Analytics
- [ ] Statistics calculate correctly
- [ ] Charts render with data
- [ ] Carrier table sorts by column
- [ ] Mode filter works
- [ ] Real-time updates reflect changes

#### Admin Panel
- [ ] Sensor registration creates document
- [ ] QR code generates
- [ ] Duplicate check prevents re-registration
- [ ] Sensor fetch by ID works
- [ ] QR scanner functions
- [ ] Journey updates save
- [ ] PDF invoice generates correctly
- [ ] CSV export contains all data

### Automated Testing (Recommended)

```javascript
// Example test with Jest or similar
describe('Sensor Operations', () => {
  test('generateSensorId creates valid format', () => {
    const id = generateSensorId();
    expect(id).toMatch(/^SEN-[A-Z0-9]{6}$/);
  });
  
  test('calculateSuccessRate handles empty array', () => {
    const rate = calculateSuccessRate([]);
    expect(rate).toBe(0);
  });
  
  test('latest journey extraction', () => {
    const sensor = {
      journeyHistory: [
        { from: 'A', to: 'B' },
        { from: 'C', to: 'D' }
      ]
    };
    const latest = sensor.journeyHistory[sensor.journeyHistory.length - 1];
    expect(latest.from).toBe('C');
  });
});
```

---

## Database Schema Design Decisions

### Why Arrays for Journey History?

**Pros:**
- Simple to implement
- Maintains chronological order
- Easy to iterate and display
- Firebase atomic array operations (arrayUnion/arrayRemove)
- No additional collection needed

**Cons:**
- Limited to 1MB document size (Firestore limit)
- Cannot query individual journeys directly
- Update requires fetching entire array

**Alternative Design (for very large datasets):**

```javascript
// Separate journeys collection
sensors/{sensorId}
journeys/{sensorId}/history/{journeyId}

// Query latest journey
db.collection('journeys')
  .doc(sensorId)
  .collection('history')
  .orderBy('startTime', 'desc')
  .limit(1)
  .get();
```

### Indexing Strategy

#### Required Indexes
1. **ownerEmail** (ascending) - User-specific queries
2. **createdAt** (descending) - Chronological ordering
3. **Composite**: containerNumber + ownerEmail - Duplicate checks

#### Query Performance
- Single field queries: ~100-200ms
- Composite queries: ~150-300ms
- Full collection scan (avoid): 1-5s+

---

## Security Best Practices

### Input Validation

```javascript
// Sanitize user inputs
function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>\"\']/g, '') // Remove potential XSS characters
    .substring(0, 255); // Limit length
}

// Validate email format
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Example usage
const email = sanitizeInput(emailInput.value);
if (!isValidEmail(email)) {
  showError('Invalid email format');
  return;
}
```

### XSS Prevention

```javascript
// ❌ Dangerous: Direct HTML insertion
element.innerHTML = userInput;

// ✅ Safe: Use textContent
element.textContent = userInput;

// ✅ Safe: Sanitize before inserting
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Authentication Token Handling

```javascript
// Never expose tokens in URL or logs
// ❌ Bad
console.log('User token:', user.token);
window.location.href = `/dashboard?token=${user.token}`;

// ✅ Good
// Firebase handles tokens internally
// Use auth state for routing
auth.onAuthStateChanged(user => {
  if (user) {
    window.location.href = '/dashboard';
  }
});
```

---

## Accessibility (A11Y)

### Keyboard Navigation
```html
<!-- All interactive elements should be keyboard accessible -->
<button tabindex="0" onclick="handleClick()">
  Click Me
</button>

<!-- Use semantic HTML -->
<nav>
  <a href="dashboard.html">Dashboard</a>
</nav>
```

### Screen Reader Support
```html
<!-- Descriptive alt text -->
<img src="logo.png" alt="PortEcho Container Tracking Logo">

<!-- ARIA labels for icon buttons -->
<button aria-label="Search containers">
  <svg><!-- search icon --></svg>
</button>

<!-- Status announcements -->
<div role="status" aria-live="polite" id="statusMessage">
  Sensor updated successfully
</div>
```

### Color Contrast
- Background: `#0a0a0a` (dark)
- Primary text: `#f5f5f5` (high contrast)
- Secondary text: `#a3a3a3` (medium contrast)
- All combinations meet WCAG AA standards

---

## Internationalization (i18n)

### Future Implementation

```javascript
// Example i18n structure
const translations = {
  en: {
    dashboard: {
      title: "Advanced Logistics Dashboard",
      newShipment: "New Shipment",
      searchPlaceholder: "Search shipments..."
    }
  },
  es: {
    dashboard: {
      title: "Panel de Logística Avanzado",
      newShipment: "Nuevo Envío",
      searchPlaceholder: "Buscar envíos..."
    }
  }
};

// Translation function
function t(key) {
  const lang = localStorage.getItem('language') || 'en';
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    value = value[k];
  }
  
  return value || key;
}

// Usage
document.getElementById('title').textContent = t('dashboard.title');
```

---

## Monitoring & Analytics

### Error Tracking Integration

```javascript
// Example with Sentry
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production'
});

// Capture errors
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
  showError('An error occurred');
}
```

### Usage Analytics

```javascript
// Example with Google Analytics
gtag('config', 'GA_MEASUREMENT_ID');

// Track page views
gtag('event', 'page_view', {
  page_title: 'Dashboard',
  page_path: '/dashboard'
});

// Track custom events
gtag('event', 'sensor_registered', {
  event_category: 'Admin',
  event_label: sensorId
});
```

---

## Glossary

### Technical Terms

- **Sensor**: IoT device attached to shipping container
- **Journey**: Single shipment route from origin to destination
- **Journey History**: Array of all journeys a sensor has completed
- **Owner Email**: Primary identifier for user access control
- **Transport Mode**: Method of shipment (Ship, Air, Train, Truck)
- **ETA**: Estimated Time of Arrival
- **Success Rate**: Percentage of containers delivered without issues

### Database Terms

- **Collection**: Firestore equivalent of a table
- **Document**: Single record in a collection
- **Snapshot**: Point-in-time view of query results
- **Real-time Listener**: Continuous connection that pushes updates
- **Composite Index**: Index on multiple fields for complex queries

### UI Components

- **Card**: Rounded container with border and shadow
- **Widget**: Interactive dashboard component
- **Modal**: Overlay dialog box
- **Toast**: Temporary notification message
- **Sidebar**: Vertical navigation panel

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- User authentication (Email, Google)
- Dashboard with real-time stats
- Container tracking with map
- Analytics with charts
- Admin panel for sensor management
- QR code generation
- PDF invoice export
- CSV data export

### Planned Version 1.1.0
- Push notifications
- Mobile responsive improvements
- Bulk sensor upload (CSV import)
- Advanced filtering options
- Journey route visualization on map
- Historical data analytics

### Planned Version 2.0.0
- Mobile applications (iOS, Android)
- Offline mode with sync
- Multi-language support
- Role-based permissions (viewer, editor, admin)
- Custom alert thresholds
- API for third-party integrations

---

## License

Copyright © 2025 PortEcho Technologies. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.

---

## Credits & Acknowledgments

### Technologies Used
- **Firebase** - Backend infrastructure
- **Tailwind CSS** - Styling framework
- **Chart.js** - Data visualization
- **Leaflet.js** - Interactive maps
- **QRious** - QR code generation
- **Html5-QRCode** - QR code scanning
- **jsPDF** - PDF generation

### Contributors
- Development Team: PortEcho Engineering
- UI/UX Design: PortEcho Design Team
- Documentation: Technical Writing Team

---

**End of Documentation**

For the latest updates, visit: https://docs.portecho.com
