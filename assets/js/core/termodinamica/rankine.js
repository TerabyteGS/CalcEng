export function getInterface() {
    return `
        <div class="calculator">
            <h2><i class="fas fa-fire"></i> Ciclo Rankine</h2>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="rankine-pmax">Pressão da Caldeira (MPa):</label>
                    <input type="number" id="rankine-pmax" value="8" step="0.5">
                </div>
                <div class="input-group">
                    <label for="rankine-tmax">Temperatura Máxima (°C):</label>
                    <input type="number" id="rankine-tmax" value="500" step="10">
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="rankine-pmin">Pressão do Condensador (kPa):</label>
                    <input type="number" id="rankine-pmin" value="10" step="1">
                </div>
                <div class="input-group">
                    <label for="rankine-flow">Vazão Mássica (kg/s):</label>
                    <input type="number" id="rankine-flow" value="50" step="1">
                </div>
            </div>
            
            <button id="calculate-rankine">Simular Ciclo</button>
            
            <div class="results-grid">
                <div id="rankine-power" class="result-card">
                    <h3>Potência Líquida</h3>
                    <p class="result-value">0 MW</p>
                </div>
                <div id="rankine-efficiency" class="result-card">
                    <h3>Eficiência Térmica</h3>
                    <p class="result-value">0%</p>
                </div>
            </div>
            
            <div id="rankine-graph"></div>
            <div id="rankine-ts-diagram"></div>
        </div>
    `;
}

export function init() {
    document.getElementById('calculate-rankine').addEventListener('click', simulateRankine);
    simulateRankine();
}

function simulateRankine() {
    // Parâmetros de entrada
    const Pmax = parseFloat(document.getElementById('rankine-pmax').value);
    const Tmax = parseFloat(document.getElementById('rankine-tmax').value);
    const Pmin = parseFloat(document.getElementById('rankine-pmin').value);
    const mdot = parseFloat(document.getElementById('rankine-flow').value);
    
    // Simulação simplificada
    const h1 = 191.8 + (Pmin/10)*0.5;   // Entalpia líquido saturado
    const h2 = h1 + 3;                   // Bombeamento (aproximação)
    const h3 = 3400 - (800-Tmax)*2.5;    // Entalpia vapor superaquecido
    const h4 = 2200 + (Pmax-5)*100;      // Entalpia após turbina
    
    // Cálculos de desempenho
    const Wturb = mdot * (h3 - h4) / 1000;  // MW
    const Wpump = mdot * (h2 - h1) / 1000;  // MW
    const Qboiler = mdot * (h3 - h2) / 1000;
    const efficiency = ((Wturb - Wpump) / Qboiler) * 100;
    
    // Atualizar resultados
    document.getElementById('rankine-power').querySelector('.result-value').textContent = 
        `${(Wturb - Wpump).toFixed(2)} MW`;
    document.getElementById('rankine-efficiency').querySelector('.result-value').textContent = 
        `${efficiency.toFixed(1)}%`;
    
    // Diagrama T-s
    const s = [1.5, 2.0, 6.0, 6.5, 1.5];
    const T = [50, 100, 500, 50, 50];
    
    Plotly.newPlot('rankine-ts-diagram', [{
        x: s,
        y: T,
        name: 'Ciclo Rankine',
        mode: 'lines',
        line: {color: '#e74c3c', width: 3},
        fill: 'toself'
    }], {
        title: 'Diagrama Temperatura-Entropia',
        xaxis: {title: 'Entropia (kJ/kg.K)'},
        yaxis: {title: 'Temperatura (°C)'}
    });
}