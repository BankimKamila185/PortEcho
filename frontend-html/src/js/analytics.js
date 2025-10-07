console.log("=== Analytics Page Loading ===");

    const firebaseConfig = {
      apiKey: "AIzaSyDTG9CdIT84AREt3d8o0iqc6PA3QrCfnuU",
      authDomain: "portecho-5d71e.firebaseapp.com",
      projectId: "portecho-5d71e",
      storageBucket: "portecho-5d71e.appspot.com",
      messagingSenderId: "915999347379",
      appId: "1:915999347379:web:a903839c9ddae3f0f056c6"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      console.log("✓ Firebase initialized");
    }

    const auth = firebase.auth();
    const db = firebase.firestore();

    let modeChart = null;
    let statusChart = null;
    let unsubscribeContainers = null;
    let currentContainers = [];

    const carriersDefault = [
      { name: "Global Shipping Co.", containers: 4520, successRate: 99.2, onTime: "98.5%", mode: "Ship" },
      { name: "Oceanic Freight", containers: 3105, successRate: 98.8, onTime: "97.2%", mode: "Ship" },
      { name: "Express Logistics", containers: 2890, successRate: 98.5, onTime: "96.8%", mode: "Truck" },
      { name: "Rapid Transport", containers: 1570, successRate: 97.1, onTime: "95.5%", mode: "Truck" },
      { name: "Aero Cargo Inc.", containers: 1215, successRate: 96.4, onTime: "94.2%", mode: "Air" }
    ];

    const carrierTableBody = document.getElementById("carrierTable");
    const sortSelect = document.getElementById("sort");
    const filterModeSelect = document.getElementById("filterMode");

    // Logout handler
    document.getElementById("logoutBtn").addEventListener("click", () => {
      auth.signOut().then(() => {
        window.location.href = "login.html";
      });
    });

    // ---------- AUTH ----------
    auth.onAuthStateChanged(user => {
      if (!user) {
        console.log("❌ No user logged in — redirecting");
        window.location.href = "login.html";
        return;
      }

      console.log("✓ User logged in:", user.email);
      setupRealtimeListener(user.email);
    });

    // ---------- REAL-TIME LISTENER ----------
    function setupRealtimeListener(userEmail) {
      console.log("Setting up real-time listener for:", userEmail);

      if (unsubscribeContainers) {
        unsubscribeContainers();
      }

      unsubscribeContainers = db.collection("containers")
        .where("ownerEmail", "==", userEmail)
        .onSnapshot(
          snapshot => {
            currentContainers = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            console.log("📦 Containers loaded:", currentContainers.length);
            console.log("Container sample:", currentContainers[0]);
            
            if (currentContainers.length === 0) {
              console.warn("⚠️ No containers found for this user");
              updateAnalytics([]);
              renderCarrierTable(carriersDefault);
            } else {
              updateAnalytics(currentContainers);
              renderCarrierTableFromContainers(currentContainers);
            }
          },
          error => {
            console.error("❌ Firestore error:", error);
            updateAnalytics([]);
            renderCarrierTable(carriersDefault);
          }
        );
    }

    // ---------- ANALYTICS ----------
    function updateAnalytics(containers) {
      console.log("Updating analytics with", containers.length, "containers");

      const total = containers.length;
      
      const success = containers.filter(c => {
        const status = (c.status || "").toLowerCase();
        return status.includes("success") || status.includes("delivered") || status.includes("completed");
      }).length;
      
      const failed = containers.filter(c => {
        const status = (c.status || "").toLowerCase();
        return status.includes("fail") || status.includes("error") || status.includes("cancelled");
      }).length;
      
      const pending = total - success - failed;
      const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : 0;

      document.getElementById("totalShipments").textContent = total.toLocaleString();
      document.getElementById("successRate").textContent = successRate + "%";
      document.getElementById("pendingCount").textContent = pending.toLocaleString();
      document.getElementById("failedCount").textContent = failed.toLocaleString();

      const modeMap = {
        'truck': 'Truck',
        'train': 'Train',
        'air': 'Air',
        'ship': 'Ship',
        'ocean': 'Ship',
        'sea': 'Ship'
      };

      const modes = { Truck: 0, Ship: 0, Air: 0, Train: 0 };
      
      containers.forEach(c => {
        const mode = c.mode || c.transportMode || "Ship";
        const modeLower = mode.toLowerCase();
        const modeKey = modeMap[modeLower] || mode;
        
        if (modes[modeKey] !== undefined) {
          modes[modeKey]++;
        } else {
          modes.Ship++;
        }
      });

      const totalModes = Object.values(modes).reduce((a,b)=>a+b,0) || 1;
      const perc = v => ((v / totalModes) * 100).toFixed(1);

      document.getElementById("truckPerc").textContent = `${modes.Truck} (${perc(modes.Truck)}%)`;
      document.getElementById("shipPerc").textContent  = `${modes.Ship} (${perc(modes.Ship)}%)`;
      document.getElementById("airPerc").textContent   = `${modes.Air} (${perc(modes.Air)}%)`;
      document.getElementById("trainPerc").textContent = `${modes.Train} (${perc(modes.Train)}%)`;

      console.log("📊 Stats:", { total, success, pending, failed, modes });
      drawCharts({ modes, success, pending, failed });
    }

    // ---------- CARRIER PERFORMANCE ----------
    function renderCarrierTableFromContainers(containers) {
      const carriers = {};

      containers.forEach(c => {
        const carrierName = c.carrier?.name || c.carrierName || c.carrier || "Unknown Carrier";
        const mode = c.mode || c.transportMode || "Ship";
        const status = (c.status || "pending").toLowerCase();

        if (!carriers[carrierName]) {
          carriers[carrierName] = { 
            name: carrierName, 
            containers: 0, 
            success: 0, 
            failed: 0, 
            mode 
          };
        }

        carriers[carrierName].containers++;
        
        if (status.includes("success") || status.includes("delivered") || status.includes("completed")) {
          carriers[carrierName].success++;
        } else if (status.includes("fail") || status.includes("error") || status.includes("cancelled")) {
          carriers[carrierName].failed++;
        }
      });

      const list = Object.values(carriers).map(c => {
        const successRate = c.containers > 0 ? parseFloat(((c.success / c.containers) * 100).toFixed(1)) : 0;
        return {
          ...c,
          successRate: successRate,
          onTime: successRate > 95 ? "98%" : successRate > 90 ? "92%" : "85%"
        };
      });

      console.log("🚚 Carriers:", list);
      renderCarrierTable(list.length > 0 ? list : carriersDefault);
    }

    function renderCarrierTable(carriers) {
      const filtered = filterModeSelect.value === "All"
        ? carriers
        : carriers.filter(c => c.mode === filterModeSelect.value);

      const sortBy = sortSelect.value;
      const sorted = filtered.sort((a, b) => {
        const aVal = parseFloat(a[sortBy]) || 0;
        const bVal = parseFloat(b[sortBy]) || 0;
        return bVal - aVal;
      });

      carrierTableBody.innerHTML = "";
      
      if (sorted.length === 0) {
        carrierTableBody.innerHTML = `
          <tr>
            <td colspan="4" class="px-6 py-8 text-center text-text-secondary">
              No carriers found for selected filter
            </td>
          </tr>
        `;
        return;
      }

      sorted.forEach(c => {
        const row = document.createElement("tr");
        row.className = "hover:bg-background-light transition";
        const rate = parseFloat(c.successRate) || 0;
        row.innerHTML = `
          <td class="px-6 py-4 font-medium">${c.name}</td>
          <td class="px-6 py-4 text-right">${c.containers.toLocaleString()}</td>
          <td class="px-6 py-4 text-right ${rate >= 98 ? 'text-accent-green font-semibold' : rate >= 95 ? 'text-accent-orange' : 'text-accent-red'}">${rate}%</td>
          <td class="px-6 py-4 text-right">${c.onTime || '--'}</td>
        `;
        carrierTableBody.appendChild(row);
      });
    }

    // Filter handlers
    sortSelect.addEventListener("change", () => {
      if (currentContainers.length > 0) {
        renderCarrierTableFromContainers(currentContainers);
      }
    });

    filterModeSelect.addEventListener("change", () => {
      if (currentContainers.length > 0) {
        renderCarrierTableFromContainers(currentContainers);
      }
    });

    // ---------- CHARTS ----------
    function drawCharts({ modes, success, pending, failed }) {
      const modeCtx = document.getElementById("modeChart");
      const statusCtx = document.getElementById("statusChart");

      if (!modeCtx || !statusCtx) {
        console.error("❌ Chart canvases not found");
        return;
      }

      if (modeChart) modeChart.destroy();
      if (statusChart) statusChart.destroy();

      const totalModes = Object.values(modes).reduce((a,b) => a+b, 0);
      const totalStatus = success + pending + failed;

      modeChart = new Chart(modeCtx, {
        type: "doughnut",
        data: {
          labels: ["Truck", "Ship", "Air", "Train"],
          datasets: [{
            data: [modes.Truck, modes.Ship, modes.Air, modes.Train],
            backgroundColor: ["#00a9ff", "#38bdf8", "#67e8f9", "#2dd4bf"],
            borderColor: "#141414",
            borderWidth: 2
          }]
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.parsed || 0;
                  const percentage = totalModes > 0 ? ((value / totalModes) * 100).toFixed(1) : 0;
                  return `${context.label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          responsive: true,
          maintainAspectRatio: true
        }
      });

      statusChart = new Chart(statusCtx, {
        type: "doughnut",
        data: {
          labels: ["Success", "Pending", "Failed"],
          datasets: [{
            data: [success, pending, failed],
            backgroundColor: ["#28a745", "#ffc107", "#ff4d4d"],
            borderColor: "#141414",
            borderWidth: 2
          }]
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.parsed || 0;
                  const percentage = totalStatus > 0 ? ((value / totalStatus) * 100).toFixed(1) : 0;
                  return `${context.label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          responsive: true,
          maintainAspectRatio: true
        }
      });

      console.log("✓ Charts drawn");
    }

    console.log("✓ Analytics page ready");
