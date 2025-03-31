export function getInterface() {
    return `
        <div class="calculator">
            <h2><i class="fas fa-water"></i> Reator de Lama Ativada</h2>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="sludge-flow">Vazão (m³/dia):</label>
                    <input type="number" id="sludge-flow" value="1000" step="10">
                </div>
                <div class="input-group">
                    <label for="sludge-conc">Concentração (mg/L):</label>
                    <input type="number" id="sludge-conc" value="3000" step="100">
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="sludge-srt">SRT (dias):</label>
                    <input type="number" id="sludge-srt" value="10" step="1">
                </div>
                <div class="input-group">
                    <label for="sludge-fm">F/M (kgDBO/kgSS.dia):</label>
                    <input type="number" id="sludge-fm" value="0.3" step="0.05">
                </div>
            </div>
            
            <button id="calculate-sludge">Dimensionar</button>
            
            <div class="results-grid">
                <div id="sludge-volume" class="result-card">
                    <h3>Volume do Reator</h3>
                    <p class="result-value">0 m³</p>
                </div>
                <div id="sludge-oxygen" class="result-card">
                    <h3>Demanda de O₂</h3>
                    <p class="result-value">0 kg/dia</p>
                </div>
                <div id="sludge-production" class="result-card">
                    <h3>Produção de Lodo</h3>
                    <p class="result-value">0 kgSS/dia</p>
                </div>
            </div>
            
            <div id="sludge-graph"></div>
        </div>
    `;
}

export function init() {
    document.getElementById('calculate-sludge').addEventListener('click', calculateSludge);
    calculateSludge();
}

function calculateSludge() {
    // Obter parâmetros de entrada
    const Q = parseFloat(document.getElementById('sludge-flow').value);
    const X = parseFloat(document.getElementById('sludge-conc').value);
    const SRT = parseFloat(document.getElementById('sludge-srt').value);
    const FM = parseFloat(document.getElementById('sludge-fm').value);
    
    // Cálculos
    const BOD = 300; // mg/L (típico para esgoto doméstico)
    const Y = 0.6;   // Coeficiente de produção
    const Kd = 0.08; // Coeficiente de decaimento
    
    // Volume do reator (m³)
    const V = (Q * SRT * X) / (1000 * FM * BOD);
    
    // Demanda de oxigênio (kg/dia)
    const O2 = Q * BOD * (1 - 1.42*Y) / 1000;
    
    // Produção de lodo (kgSS/dia)
    const Px = (Y * Q * BOD / 1000) / (1 + Kd * SRT);
    
    // Atualizar resultados
    document.getElementById('sludge-volume').querySelector('.result-value').textContent = `${V.toFixed(0)} m³`;
    document.getElementById('sludge-oxygen').querySelector('.result-value').textContent = `${O2.toFixed(0)} kg/dia`;
    document.getElementById('sludge-production').querySelector('.result-value').textContent = `${Px.toFixed(0)} kgSS/dia`;
    
    // Gráfico de simulação
    const days = Array.from({length: 15}, (_, i) => i + 1);
    const efficiency = days.map(d => 100 * (1 - Math.exp(-0.3 * d)));
    
    Plotly.newPlot('sludge-graph', [{
        x: days,
        y: efficiency,
        name: 'Eficiência de Remoção',
        line: {color: '#27ae60', width: 3}
    }], {
        title: 'Eficiência vs Tempo de Retenção',
        xaxis: {title: 'SRT (dias)'},
        yaxis: {title: 'Eficiência (%)', range: [0, 100]}
    });
}