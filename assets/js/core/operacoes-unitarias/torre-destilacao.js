export function getInterface() {
    return `
        <div class="calculator">
            <h2><i class="fas fa-industry"></i> Torre de Destilação</h2>
            <div class="input-row">
                <div class="input-group">
                    <label for="distil-feed">Alimentação (mol/h):</label>
                    <input type="number" id="distil-feed" value="100" step="1">
                </div>
                <div class="input-group">
                    <label for="distil-xf">x<sub>F</sub> (fração molar):</label>
                    <input type="number" id="distil-xf" value="0.4" step="0.01" min="0" max="1">
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="distil-xd">x<sub>D</sub> (destilado):</label>
                    <input type="number" id="distil-xd" value="0.9" step="0.01" min="0" max="1">
                </div>
                <div class="input-group">
                    <label for="distil-xb">x<sub>B</sub> (fundo):</label>
                    <input type="number" id="distil-xb" value="0.1" step="0.01" min="0" max="1">
                </div>
            </div>
            
            <div class="input-group">
                <label for="distil-rr">Razão de Refluxo (R):</label>
                <input type="number" id="distil-rr" value="2.5" step="0.1">
            </div>
            
            <button id="calculate-distil">Dimensionar Torre</button>
            <div id="distil-graph"></div>
            <div id="distil-results" class="results"></div>
        </div>
    `;
}

export function init() {
    document.getElementById('calculate-distil').addEventListener('click', calculateDistillation);
    calculateDistillation();
}

function calculateDistillation() {
    const F = parseFloat(document.getElementById('distil-feed').value);
    const xF = parseFloat(document.getElementById('distil-xf').value);
    const xD = parseFloat(document.getElementById('distil-xd').value);
    const xB = parseFloat(document.getElementById('distil-xb').value);
    const R = parseFloat(document.getElementById('distil-rr').value);
    
    // Balanços materiais
    const D = F * (xF - xB) / (xD - xB);
    const B = F - D;
    
    // Número mínimo de pratos (Fenske)
    const alpha = 2.5; // Volatilidade relativa assumida
    const Nmin = Math.log((xD/(1-xD)) * ((1-xB)/xB)) / Math.log(alpha) - 1;
    
    // Número real de pratos (Gilliland)
    const Y = (R - 1.5) / (R + 1);
    const X = (Nmin - Nmin/Y) / (Nmin + 1);
    const N = Math.ceil(Nmin + (1 - Math.exp((1 + 54.4*X)/(11 + 117.2*X))));
    
    // Linhas de operação
    const xPoints = Array.from({length: 100}, (_, i) => i/100);
    const rectifyingLine = xPoints.map(x => R/(R+1)*x + xD/(R+1));
    const strippingLine = xPoints.map(x => (F*xF - B*xB)/(F - B) + (F - D)/(F - B)*x);
    
    // Plotagem
    Plotly.newPlot('distil-graph', [{
        x: xPoints,
        y: xPoints.map(x => (alpha*x)/(1 + (alpha-1)*x)),
        name: 'Curva de Equilíbrio',
        line: {color: '#3498db'}
    }, {
        x: xPoints,
        y: rectifyingLine,
        name: 'Seção de Retificação',
        line: {color: '#e74c3c'}
    }, {
        x: xPoints,
        y: strippingLine,
        name: 'Seção de Esgotamento',
        line: {color: '#2ecc71'}
    }], {
        title: 'Diagrama de McCabe-Thiele',
        xaxis: {title: 'x (líquido)'},
        yaxis: {title: 'y (vapor)'},
        shapes: [{
            type: 'line',
            x0: xF,
            y0: 0,
            x1: xF,
            y1: 1,
            line: {color: '#9b59b6', dash: 'dot'}
        }]
    });
    
    // Resultados
    document.getElementById('distil-results').innerHTML = `
        <h3>Resultados do Dimensionamento</h3>
        <table>
            <tr><td>Destilado (D):</td><td><b>${D.toFixed(1)} mol/h</b></td></tr>
            <tr><td>Produto de Fundo (B):</td><td><b>${B.toFixed(1)} mol/h</b></td></tr>
            <tr><td>Pratos Teóricos:</td><td><b>${N}</b></td></tr>
            <tr><td>Pratos Mínimos:</td><td><b>${Nmin.toFixed(1)}</b></td></tr>
            <tr><td>Posição da Alimentação:</td><td><b>Prato ${Math.floor(N/2)}</b></td></tr>
        </table>
    `;
}