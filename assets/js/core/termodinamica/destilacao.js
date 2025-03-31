// Interface da calculadora
export function getInterface() {
    return `
        <div class="calculator">
            <h2><i class="fas fa-fire"></i> Destilação Binária</h2>
            <div class="input-group">
                <label for="thermo-alpha">Volatilidade relativa (α):</label>
                <input type="number" id="thermo-alpha" value="2.5" step="0.1" min="1.1">
            </div>
            <div class="input-group">
                <label for="thermo-xF">Composição da alimentação (x<sub>F</sub>):</label>
                <input type="range" id="thermo-xF" min="0.01" max="0.99" value="0.20" step="0.01">
                <span id="thermo-xF-value">0.20</span>
            </div>
            <button id="calculate-thermo">Calcular</button>
            <div id="thermo-graph"></div>
        </div>
    `;
}

// Lógica da calculadora
export function init() {
    document.getElementById('thermo-xF').addEventListener('input', function() {
        document.getElementById('thermo-xF-value').textContent = this.value;
    });

    document.getElementById('calculate-thermo').addEventListener('click', calculateThermo);
}

function calculateThermo() {
    const alpha = parseFloat(document.getElementById('thermo-alpha').value);
    const xF = parseFloat(document.getElementById('thermo-xF').value);
    
    const x_A = Array.from({length: 100}, (_, i) => i/100);
    const y_A = x_A.map(x => (alpha * x) / (1 + (alpha - 1) * x));
    
    Plotly.newPlot('thermo-graph', [{
        x: x_A,
        y: y_A,
        name: 'Curva de Equilíbrio',
        mode: 'lines',
        line: {color: '#3498db', width: 3}
    }, {
        x: [0, 1],
        y: [0, 1],
        name: 'Linha 45°',
        line: {dash: 'dash', color: '#7f8c8d'}
    }], {
        title: 'Diagrama de Equilíbrio Líquido-Vapor',
        xaxis: {title: 'x<sub>A</sub> (líquido)'},
        yaxis: {title: 'y<sub>A</sub> (vapor)'}
    });
}