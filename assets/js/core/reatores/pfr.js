export function getInterface() {
    return `
        <div class="calculator">
            <h2><i class="fas fa-long-arrow-alt-right"></i> Reator PFR</h2>
            <div class="input-group">
                <label for="pfr-CA0">Concentração Inicial (CA₀, mol/L):</label>
                <input type="number" id="pfr-CA0" value="1.0" step="0.1" min="0.1">
            </div>
            <div class="input-group">
                <label for="pfr-k">Constante Cinética (k, min⁻¹):</label>
                <input type="number" id="pfr-k" value="0.3" step="0.01" min="0.01">
            </div>
            <div class="input-group">
                <label for="pfr-length">Comprimento do Reator (L, m):</label>
                <input type="number" id="pfr-length" value="5.0" step="0.1" min="0.5">
            </div>
            <div class="input-group">
                <label for="pfr-diam">Diâmetro do Reator (m):</label>
                <input type="number" id="pfr-diam" value="0.2" step="0.01" min="0.05">
            </div>
            <div class="input-group">
                <label for="pfr-flow">Vazão Volumétrica (L/min):</label>
                <input type="number" id="pfr-flow" value="2.0" step="0.1" min="0.1">
            </div>
            <button id="calculate-pfr">Calcular</button>
            <div id="pfr-graph"></div>
            <div id="pfr-results" class="results"></div>
        </div>
    `;
}

export function init() {
    document.getElementById('calculate-pfr').addEventListener('click', calculatePFR);
    calculatePFR();
}

function calculatePFR() {
    // Obter valores de entrada
    const CA0 = parseFloat(document.getElementById('pfr-CA0').value);
    const k = parseFloat(document.getElementById('pfr-k').value);
    const length = parseFloat(document.getElementById('pfr-length').value);
    const diameter = parseFloat(document.getElementById('pfr-diam').value);
    const flowRate = parseFloat(document.getElementById('pfr-flow').value);
    
    // Cálculos auxiliares
    const area = Math.PI * Math.pow(diameter/2, 2);
    const velocity = (flowRate/1000) / area; // m/s
    const tau = length / velocity / 60; // min
    
    // Discretização do reator (método de Euler)
    const nSteps = 50;
    const deltaZ = length / nSteps;
    const positions = [];
    const concentrations = [];
    
    let CA = CA0;
    for (let i = 0; i <= nSteps; i++) {
        const z = i * deltaZ;
        positions.push(z);
        concentrations.push(CA);
        
        // dCA/dz = -k*CA/u (para reação de 1ª ordem)
        CA -= (k * CA / velocity) * deltaZ;
    }
    
    // Cálculos finais
    const X = ((CA0 - concentrations[nSteps]) / CA0 * 100).toFixed(1);
    const finalCA = concentrations[nSteps].toFixed(4);
    
    // Plotar gráfico
    Plotly.newPlot('pfr-graph', [{
        x: positions,
        y: concentrations,
        name: 'Perfil Axial',
        mode: 'lines+markers',
        line: {color: '#9b59b6', width: 3},
        marker: {size: 6}
    }], {
        title: 'Perfil de Concentração no PFR',
        xaxis: {title: 'Comprimento do Reator (m)'},
        yaxis: {title: 'Concentração (mol/L)', range: [0, CA0 * 1.1]},
        showlegend: true
    });
    
    // Exibir resultados
    document.getElementById('pfr-results').innerHTML = `
        <h3>Resultados</h3>
        <table>
            <tr><td>Conversão Final:</td><td><b>${X}%</b></td></tr>
            <tr><td>Concentração Final:</td><td><b>${finalCA} mol/L</b></td></tr>
            <tr><td>Tempo Espacial (τ):</td><td><b>${tau.toFixed(2)} min</b></td></tr>
            <tr><td>Velocidade Linear:</td><td><b>${velocity.toFixed(4)} m/s</b></td></tr>
        </table>
    `;
}