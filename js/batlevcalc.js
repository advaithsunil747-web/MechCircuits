/* =========================
   BATTERY CALCULATION
========================= */

function calculateBattery(){

    let type = document.getElementById("batteryType").value;

    let cells = parseInt(
        document.getElementById("cells").value
    );

    let voltage = parseFloat(
        document.getElementById("voltage").value
    );

    if(cells <= 0 || voltage < 0 || isNaN(cells) || isNaN(voltage)){
        alert("Please enter valid values");
        return;
    }

    let minCellVoltage, maxCellVoltage;

    if(type === "liion" || type === "lipo"){
        minCellVoltage = 3.0;
        maxCellVoltage = 4.2;
    }
    else if(type === "lifepo4"){
        minCellVoltage = 2.5;
        maxCellVoltage = 3.6;
    }
    else if(type === "leadacid"){
    minCellVoltage = 1.75;
    maxCellVoltage = 2.15;
}

else if(type === "alkaline"){
    minCellVoltage = 0.9;
    maxCellVoltage = 1.65;
}

else if(type === "nimh"){
    minCellVoltage = 1.0;
    maxCellVoltage = 1.45;
}

else if(type === "coin"){
    minCellVoltage = 2.2;
    maxCellVoltage = 3.2;
}

    let minVoltage = minCellVoltage * cells;
    let maxVoltage = maxCellVoltage * cells;


    /* =========================
       SOC CALCULATION
    ========================= */

    let socLevels = [0, 20, 40, 60, 80, 100];
    let curve = graphData[type].values;

    let cellVoltage = voltage / cells;
    let percentage = 0;

    for(let i = 0; i < curve.length - 1; i++){

        let lowerV = curve[i];
        let upperV = curve[i + 1];

        if(cellVoltage >= lowerV && cellVoltage <= upperV){

            let ratio =
                (cellVoltage - lowerV) /
                (upperV - lowerV);

            percentage =
                socLevels[i] +
                ratio * (socLevels[i + 1] - socLevels[i]);

            break;
        }
    }

    percentage = Math.max(0, Math.min(100, percentage));


    /* =========================
       UI UPDATE
    ========================= */

    document.getElementById("batteryLevel").style.width = percentage + "%";

    document.getElementById("resultText").innerText =
        percentage.toFixed(1) + "%";

    document.getElementById("detailsText").innerText =
        "Min: " + minVoltage.toFixed(2) +
        "V | Max: " + maxVoltage.toFixed(2) + "V";

    let battery = document.getElementById("batteryLevel");

    if(percentage > 50){
        battery.style.background = "limegreen";
    }
    else if(percentage > 20){
        battery.style.background = "orange";
    }
    else{
        battery.style.background = "red";
    }


    /* =========================
       UPDATE CHART INDICATOR
    ========================= */

    let cellV = voltage / cells;

    chart.options.plugins.batteryIndicator.voltage = cellV;
    chart.options.plugins.batteryIndicator.soc = percentage;

    chart.update();
}


/* =========================
   GRAPH DATA
========================= */

const graphData = {

    liion: {
        label: 'Li-ion Voltage',
        values: [3.0, 3.6, 3.72, 3.83, 4.0, 4.2]
    },

    lipo: {
        label: 'Li-Po Voltage',
        values: [3.0, 3.7, 3.8, 3.87, 4.02, 4.2]
    },

    lifepo4: {
        label: 'LiFePO4 Voltage',
        values: [2.5, 3.22, 3.26, 3.3, 3.34, 3.6]
    },

    leadacid: {
        label: 'Lead Acid Voltage',
        values: [1.75, 1.95, 2.0, 2.08, 2.12, 2.15]
    },

    alkaline: {
        label: 'Alkaline Voltage',
        values: [0.9, 1.22, 1.29, 1.35, 1.41, 1.65]
    },

    nimh: {
        label: 'NiMH Voltage',
        values: [1.0, 1.2, 1.24, 1.28, 1.32, 1.45]
    },

    coin: {
        label: 'Coin Cell Voltage',
        values: [2.2, 2.7, 2.8, 2.9, 3.0, 3.2]
    }
};


/* =========================
   INDICATOR PLUGIN (NEW)
========================= */

const batteryIndicatorPlugin = {
    id: 'batteryIndicator',

    afterDatasetsDraw(chart, args, options) {

        const { ctx, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;

        const voltage = options.voltage;
        const soc = options.soc;

        if (voltage == null || soc == null) return;

       const floatIndex = (soc / 100) * (chart.data.labels.length - 1);
const xPos = x.getPixelForValue(floatIndex);
const data = chart.data.datasets[0].data;

const i = Math.floor(floatIndex);
const t = floatIndex - i;

const v1 = data[i];
const v2 = data[i + 1] ?? v1;

const yValue = v1 + (v2 - v1) * t;

const yPos = y.getPixelForValue(yValue);

        ctx.save();

        // 🔴 vertical line
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.moveTo(xPos, top);
        ctx.lineTo(xPos, bottom);
        ctx.stroke();

        // 📍 dot
        ctx.setLineDash([]);
        ctx.fillStyle = 'red';

        ctx.beginPath();
        ctx.arc(xPos, yPos, 5, 0, Math.PI * 2);
        ctx.fill();

        // 🔵 horizontal line (SOC)
        const ySoc = y.getPixelForValue(yValue);

        ctx.strokeStyle = 'red';
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.moveTo(left, ySoc);
        ctx.lineTo(right, ySoc);
        ctx.stroke();

        // ⚡ label
        ctx.setLineDash([]);
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';

        ctx.fillText(
            `⚡ ${soc.toFixed(1)}% | ${voltage.toFixed(2)}V`,
            xPos + 10,
            yPos - 10
        );

        ctx.restore();
    }
};


/* =========================
   CHART SETUP
========================= */

const ctx = document.getElementById('batteryChart');
let chart;

Chart.register(batteryIndicatorPlugin);


/* =========================
   CREATE CHART
========================= */

function createChart(type){

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: 'line',

        data: {

            labels: ['0%', '20%', '40%', '60%', '80%', '100%'],

            datasets: [{

                label: graphData[type].label,
                data: graphData[type].values,

                borderWidth: 3,
                tension: 0,
                fill: false,

                borderColor: '#0077ff',
                backgroundColor: '#0077ff',

                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#0077ff'
            }]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 1200
            },

            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 14,
                            family: 'Arial'
                        }
                    }
                },

                batteryIndicator: {
                    voltage: 0,
                    soc: 0
                }
            },

            scales: {
                y: {
                    grid: {
                        color: 'rgba(0,0,0,0.08)'
                    },
                    ticks: {
                        font: { size: 12 }
                    },
                    title: {
                        display: true,
                        text: 'Voltage (V)',
                        font: { size: 14 }
                    }
                },

                x: {
                    grid: {
                        color: 'rgba(0,0,0,0.08)'
                    },
                    ticks: {
                        font: { size: 12 }
                    },
                    title: {
                        display: true,
                        text: 'State of Charge',
                        font: { size: 14 }
                    }
                }
            }
        },

        plugins: [batteryIndicatorPlugin]
    });
}


/* =========================
   INIT
========================= */

createChart("liion");

document.getElementById("batteryType")
.addEventListener("change", function(){
    createChart(this.value);
});

function toggleContact() {
    event.preventDefault();

    let box = document.getElementById("contactBox");

    if (box.style.display === "block") {
        box.style.display = "none";
    } else {
        box.style.display = "block";
    }
}

function toggleFeedback() {

    event.preventDefault();

    let box = document.getElementById("feedbackBox");

    if(box.style.display === "block"){
        box.style.display = "none";
    } else {
        box.style.display = "block";
    }
}