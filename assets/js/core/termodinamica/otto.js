export function getInterface() {
    return `
        <div class="calculator">
            <h2><i class="fas fa-gas-pump"></i> Ciclo Otto</h2>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="otto-compression">Taxa de Compressão:</label>
                    <input type="number" id="otto-compression" value="8" step="0.5">
                </div>
                <div class="input-group">
                    <label for="otto-pressure">Pressão de Admissão (kPa):</label>
                    <input type="number" id="otto-pressure" value="100" step="5">
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="otto-temp">Temperatura de Admissão (°C):</label>
                    <input type="number" id="otto-temp" value="25" step="1">
                </div>
                <div class="input-group">
                    <label for="otto-gamma">Razão γ (cp/cv):</label>
                    <input type="number" id="otto-gamma" value="1.4" step="0.05">
                </div>
            </div>
            
            <button id="calculate-otto">Simular Ciclo</button>
            
            <div class="results-grid">
                <div id="otto-efficiency" class="result-card">
                    <h3>Eficiência Térmica</h3>
                    <p class="result-value">0%</p>
                </div>
                <div id="otto-work" class="result-card">
                    <h3>Trabalho Líquido</h3>
                    <p class="result-value">0 kJ/kg</p>
                </div>
            </div>
            
            <div id="otto-pv-diagram"></div>
        </div>
    `;
}

export function init() {
    document.getElementById('calculate-otto').addEventListener('click', simulateOtto);
    simulateOtto();
}

function simulateOtto() {
    // Parâmetros de entrada
    const r = parseFloat(document.getElementById('otto-compression').value);
    const P1 = parseFloat(document.getElementById('otto-pressure').value);
    const T1 = parseFloat(document.getElementById('otto-temp').value);
    const γ = parseFloat(document.getElementById('otto-gamma').value);
    
    // Cálculos do ciclo
    const efficiency = (1 - Math.pow(r, 1-γ)) * 100;
    const P2 = P1 * Math.pow(r, γ);
    const P3 = P2 * 2; // Aproximação para combustão
    const P4 = P3 / Math.pow(r, γ);
    
    // Diagrama P-V
    const V = [1, 1/r, 1/r, 1, 1];
    const P = [P1, P2, P3, P4, P1];
    
    Plotly.newPlot('otto-pv-diagram', [{
        x: V,
        y: P,
        name: 'Ciclo Otto',
        mode: 'lines',
        line: {color: '#3498db', width: 3},
        fill: 'toself'
    }], {
        title: 'Diagrama Pressão-Volume',
        xaxis: {title: 'Volume (relativo)'},
        yaxis: {title: 'Pressão (kPa)', type: 'log'},
        margin: {t: 40}
    });
    
    // Atualizar resultados
    document.getElementById('otto-efficiency').querySelector('.result-value').textContent = 
        `${efficiency.toFixed(1)}%`;
    document.getElementById('otto-work').querySelector('.result-value').textContent = 
        `${(P3*V[2]*(1-1/Math.pow(r,γ-1))).toFixed(1)} kJ/kg`;
}