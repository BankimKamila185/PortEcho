 // Firebase Config
    const firebaseConfig = {
      apiKey: "AIzaSyDTG9CdIT84AREt3d8o0iqc6PA3QrCfnuU",
      authDomain: "portecho-5d71e.firebaseapp.com",
      projectId: "portecho-5d71e",
      storageBucket: "portecho-5d71e.appspot.com",
      messagingSenderId: "915999347379",
      appId: "1:915999347379:web:a903839c9ddae3f0f056c6"
    };
    
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    const map = L.map('map').setView([20.5937, 78.9629], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    let allSensors = [];
    let selectedSensor = null;
    
    async function loadData(userEmail = null) {
      const tableBody = document.getElementById('containerTable');
      try {
        let query = db.collection("sensors");
        if (userEmail) query = query.where("ownerEmail", "==", userEmail);
        
        const snapshot = await query.get();
        console.log('Found', snapshot.size, 'sensors');
        
        if (snapshot.empty) {
          tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#ff4444;">No sensors found</td></tr>';
          return;
        }
        
        allSensors = snapshot.docs.map(doc => {
          const data = doc.data();
          const latestJourney = data.journeyHistory?.[data.journeyHistory.length - 1];
          return {
            ...data,
            routeFrom: latestJourney?.from || 'N/A',
            routeTo: latestJourney?.to || 'N/A',
            transportMode: latestJourney?.mode || 'Ship',
            eta: latestJourney?.expectedDelivery || null,
            status: latestJourney ? 'online' : 'offline',
            humidity: Math.floor(Math.random() * 30) + 60,
            temperature: Math.floor(Math.random() * 15) + 20,
            weather: 'Clear'
          };
        });
        
        selectedSensor = allSensors[0];
        renderTable(allSensors);
        displayDetails(selectedSensor);
        updateMap(allSensors);
        updateSidebar(allSensors);
      } catch (error) {
        console.error('Error:', error);
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#ff4444;">Error: ' + error.message + '</td></tr>';
      }
    }
    
    function renderTable(sensors) {
      const tableBody = document.getElementById('containerTable');
      tableBody.innerHTML = sensors.map((s, i) => {
        const statusClass = s.status === 'online' ? 'status-online' : 'status-offline';
        const selected = selectedSensor?.sensorId === s.sensorId ? 'selected' : '';
        return `<tr class="${selected}" data-index="${i}" style="cursor:pointer;">
          <td>${s.sensorId}</td><td>${s.containerNumber}</td><td>${s.company}</td>
          <td>${s.ownerName}</td><td>${s.routeFrom} → ${s.routeTo}</td>
          <td>${s.transportMode}</td><td class="${statusClass}">${s.status.toUpperCase()}</td>
        </tr>`;
      }).join('');
      tableBody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => {
          selectedSensor = sensors[parseInt(row.dataset.index)];
          displayDetails(selectedSensor);
          renderTable(sensors);
        });
      });
    }
    
    function displayDetails(s) {
      document.getElementById('containerId').textContent = s.containerNumber;
      document.getElementById('origin').textContent = s.routeFrom;
      document.getElementById('destination').textContent = s.routeTo;
      document.getElementById('currentStatus').textContent = s.status;
      document.getElementById('estimatedArrival').textContent = s.eta || 'N/A';
      document.getElementById('carrier').textContent = s.company;
      document.getElementById('humidity').textContent = s.humidity + '%';
      document.getElementById('temperature').textContent = s.temperature + '°C';
      document.getElementById('weather').textContent = s.weather;
      updateEventLog(s);
      updateAlerts(s);
    }
    
    function updateEventLog(s) {
      const events = [];
      if (s.createdAt) events.push({ icon: '📋', title: 'Sensor Registered', time: formatTime(s.createdAt) });
      if (s.journeyHistory?.length) {
        s.journeyHistory.forEach((j, i) => {
          if (j.startTime) events.push({ icon: '🚀', title: `Journey ${i+1}: ${j.from} → ${j.to}`, time: formatTime(j.startTime) });
        });
      }
      if (s.status === 'online') events.push({ icon: '📡', title: 'In Transit', time: 'Current' });
      if (s.eta) events.push({ icon: '📍', title: 'Estimated Arrival', time: s.eta });
      
      document.getElementById('eventLog').innerHTML = events.length ?
        events.map(e => `<div class="event-item"><div class="event-icon">${e.icon}</div><div class="event-content"><div class="event-title">${e.title}</div><div class="event-time">${e.time}</div></div></div>`).join('') :
        '<div style="text-align:center;color:#666;padding:20px;">No events</div>';
    }
    
    function updateAlerts(s) {
      const alerts = [];
      if (s.humidity > 80) alerts.push({ type: 'warning', title: 'High Humidity', desc: `${s.humidity}%`, severity: 'High' });
      if (s.temperature > 30) alerts.push({ type: 'warning', title: 'High Temperature', desc: `${s.temperature}°C`, severity: 'High' });
      if (s.status !== 'online') alerts.push({ type: 'critical', title: 'Connection Lost', desc: `Sensor ${s.sensorId} is ${s.status}`, severity: 'Critical' });
      
      document.getElementById('alertsContainer').innerHTML = alerts.length ?
        alerts.map(a => `<div class="alert-box ${a.type === 'critical' ? 'critical' : ''}"><div class="alert-box-header"><div class="alert-box-icon">⚠</div><div class="alert-box-title">${a.title}</div></div><div class="alert-box-desc">${a.desc}</div><div class="alert-severity">Severity: ${a.severity}</div></div>`).join('') :
        '<div style="text-align:center;color:#666;padding:20px;">No alerts</div>';
    }
    
    function updateMap(sensors) {
      map.eachLayer(layer => { if (layer instanceof L.Marker) map.removeLayer(layer); });
      const cityCoords = {
        mumbai: [19.076, 72.8777], dubai: [25.2048, 55.2708], singapore: [1.3521, 103.8198],
        shanghai: [31.2304, 121.4737], london: [51.5074, -0.1278], newyork: [40.7128, -74.0060]
      };
      sensors.forEach(s => {
        let [lat, lng] = [20.5937, 78.9629];
        if (s.routeFrom) {
          const city = s.routeFrom.toLowerCase().replace(/\s+/g, '');
          if (cityCoords[city]) [lat, lng] = cityCoords[city];
        }
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`<strong>${s.containerNumber}</strong><br>${s.routeFrom} → ${s.routeTo}<br>${s.transportMode} • ${s.status}`);
      });
    }
    
    function updateSidebar(sensors) {
      const offline = sensors.filter(s => s.status !== 'online');
      document.getElementById('sidebarAlerts').innerHTML = offline.length ?
        offline.slice(0, 3).map(s => `<div class="alert-item-small"><div class="alert-icon">⚠</div><div class="alert-text"><div>${s.sensorId}</div><div>${s.status} - ${s.routeFrom}</div></div></div>`).join('') :
        '<div style="color:#666;padding:12px;font-size:12px;">No alerts</div>';
    }
    
    function formatTime(t) {
      if (!t) return 'N/A';
      if (t.toDate) return t.toDate().toLocaleString();
      if (typeof t === 'string') try { return new Date(t).toLocaleString(); } catch { return t; }
      if (t instanceof Date) return t.toLocaleString();
      return 'N/A';
    }
    
    document.getElementById('searchInput').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      if (!q) { renderTable(allSensors); return; }
      const filtered = allSensors.filter(s => 
        s.sensorId?.toLowerCase().includes(q) ||
        s.containerNumber?.toLowerCase().includes(q) ||
        s.company?.toLowerCase().includes(q) ||
        s.routeFrom?.toLowerCase().includes(q) ||
        s.routeTo?.toLowerCase().includes(q)
      );
      renderTable(filtered);
    });
    
    document.getElementById('logoutButton').addEventListener('click', () => {
      auth.signOut().then(() => window.location.href = 'container-form.html');
    });
    
    auth.onAuthStateChanged(user => {
      console.log('Auth state:', user ? user.email : 'Not logged in');
      if (user) {
        loadData(user.email.toLowerCase());
      } else {
        loadData(null);
      }
    });
    
    setTimeout(() => {
      if (allSensors.length === 0) {
        console.log('Timeout - forcing load');
        loadData(null);
      }
    }, 2000);
    
    console.log('Tracking page initialized');