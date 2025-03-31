export function getInterface() {
    return `
        <div class="calculator">
            <h2><i class="fas fa-random"></i> Reator CSTR</h2>
            <div class="input-group">
                <label for="cstr-CA0">Concentração Inicial (CA₀, mol/L):</label>
                <input type="number" id="cstr-CA0" value="1.0" step="0.1" min="0.1">
            </div>
            <div class="input-group">
                <label for="cstr-k">Constante Cinética (k, min⁻¹):</label>
                <input type="number" id="cstr-k" value="0.5" step="0.01" min="0.01">
            </div>
            <div class="input-group">
                <label for="cstr-tau">Tempo Espacial (τ, min):</label>
                <input type="number" id="cstr-tau" value="2.0" step="0.1" min="0.1">
            </div>
            <div class="input-group">
                <label for="cstr-vol">Volume do Reator (L):</label>
                <input type="number" id="cstr-vol" value="10" step="1" min="1">
            </div>
            <button id="calculate-cstr">Calcular</button>
            <div id="cstr-graph"></div>
            <div id="cstr-results" class="results"></div>
        </div>
    `;
}

export function init() {
    document.getElementById('calculate-cstr').addEventListener('click', calculateCSTR);
    
    // Calcula automaticamente ao carregar
    calculateCSTR();
}

function calculateCSTR() {
    // Obter valores de entrada
    const CA0 = parseFloat(document.getElementById('cstr-CA0').value);
    const k = parseFloat(document.getElementById('cstr-k').value);
    const tau = parseFloat(document.getElementById('cstr-tau').value);
    const volume = parseFloat(document.getElementById('cstr-vol').value);
    
    // Cálculos fundamentais
    const CA = CA0 / (1 + k * tau);
    const X = ((CA0 - CA) / CA0 * 100).toFixed(1);
    const v0 = volume / tau;  // vazão volumétrica
    
    // Simulação do perfil temporal
    const time = Array.from({length: 100}, (_, i) => i * tau * 3 / 100);
    const concentration = time.map(t => {
        if (t < tau) return CA0 * Math.exp(-k * t);
        return CA;
    });
    
    // Plotar gráfico
    Plotly.newPlot('cstr-graph', [{
        x: time,
        y: concentration,
        name: 'Concentração',
        mode: 'lines',
        line: {color: '#e74c3c', width: 3}
    }, {
        x: [tau, tau],
        y: [0, CA0],
        name: 'τ (tempo espacial)',
        line: {dash: 'dot', color: '#3498db'}
    }], {
        title: 'Perfil de Concentração no CSTR',
        xaxis: {title: 'Tempo (min)'},
        yaxis: {title: 'Concentração (mol/L)', range: [0, CA0 * 1.1]},
        showlegend: true
    });
    
    // Exibir resultados
    document.getElementById('cstr-results').innerHTML = `
        <h3>Resultados</h3>
        <table>
            <tr><td>Conversão:</td><td><b>${X}%</b></td></tr>
            <tr><td>Concentração de Saída:</td><td><b>${CA.toFixed(4)} mol/L</b></td></tr>
            <tr><td>Vazão Volumétrica:</td><td><b>${v0.toFixed(2)} L/min</b></td></tr>
            <tr><td>Tempo de Residência:</td><td><b>${tau} min</b></td></tr>
        </table>
    `;
}