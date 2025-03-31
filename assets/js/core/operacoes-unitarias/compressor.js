export function getInterface() {
    return `
        <div class="calculator">
            <h2><i class="fas fa-fan"></i> Dimensionamento de Compressor</h2>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="compressor-flow">Vazão (m³/min):</label>
                    <input type="number" id="compressor-flow" value="10" step="0.5">
                </div>
                <div class="input-group">
                    <label for="compressor-ratio">Razão de Pressão (P₂/P₁):</label>
                    <input type="number" id="compressor-ratio" value="3" step="0.1">
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="compressor-efficiency">Eficiência (%):</label>
                    <input type="number" id="compressor-efficiency" value="75" step="1">
                </div>
                <div class="input-group">
                    <label for="compressor-gamma">Razão γ (cp/cv):</label>
                    <input type="number" id="compressor-gamma" value="1.4" step="0.05">
                </div>
            </div>
            
            <button id="calculate-compressor">Calcular</button>
            
            <div class="results-grid">
                <div id="compressor-power" class="result-card">
                    <h3>Potência Requerida</h3>
                    <p class="result-value">0 kW</p>
                </div>
                <div id="compressor-temp" class="result-card">
                    <h3>Temperatura de Saída</h3>
                    <p class="result-value">0 °C</p>
                </div>
            </div>
            
            <div id="compressor-graph"></div>
        </div>
    `;
}

export function init() {
    document.getElementById('calculate-compressor').addEventListener('click', calculateCompressor);
    calculateCompressor();
}

function calculateCompressor() {
    // Parâmetros de entrada
    const Q = parseFloat(document.getElementById('compressor-flow').value);
    const rp = parseFloat(document.getElementById('compressor-ratio').value);
    const η = parseFloat(document.getElementById('compressor-efficiency').value) / 100;
    const γ = parseFloat(document.getElementById('compressor-gamma').value);
    
    // Cálculos termodinâmicos
    const T1 = 25 + 273.15; // Temperatura de entrada (K)
    const T2s = T1 * Math.pow(rp, (γ-1)/γ);
    const T2 = T1 + (T2s - T1)/η;
    
    const W = (Q/60) * 1.2 * (γ/(γ-1)) * 8.314 * (T2 - T1) / 1000;
    
    // Atualizar resultados
    document.getElementById('compressor-power').querySelector('.result-value').textContent = 
        `${W.toFixed(2)} kW`;
    document.getElementById('compressor-temp').querySelector('.result-value').textContent = 
        `${(T2 - 273.15).toFixed(1)} °C`;
    
    // Gráfico de desempenho
    const ratios = Array.from({length: 10}, (_, i) => 1 + i*0.5);
    const powers = ratios.map(r => 
        (Q/60) * 1.2 * (γ/(γ-1)) * 8.314 * (T1 * (Math.pow(r, (γ-1)/γ) - T1) / η / 1000));
    
    Plotly.newPlot('compressor-graph', [{
        x: ratios,
        y: powers,
        name: 'Potência vs Razão de Pressão',
        mode: 'lines+markers',
        line: {color: '#f39c12', width: 3}
    }], {
        title: 'Curva de Desempenho do Compressor',
        xaxis: {title: 'Razão de Pressão (P₂/P₁)'},
        yaxis: {title: 'Potência (kW)'}
    });
}