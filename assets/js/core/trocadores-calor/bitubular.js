export function getInterface() {
    return `
        <div class="calculator">
            <h2><i class="fas fa-exchange-alt"></i> Trocador Bitubular</h2>
            <div class="input-row">
                <div class="input-group">
                    <label for="bit-flow-hot">Vazão (Quente, kg/s):</label>
                    <input type="number" id="bit-flow-hot" value="0.5" step="0.01">
                </div>
                <div class="input-group">
                    <label for="bit-temp-hot-in">T<sub>ent</sub> Quente (°C):</label>
                    <input type="number" id="bit-temp-hot-in" value="90" step="1">
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="bit-flow-cold">Vazão (Frio, kg/s):</label>
                    <input type="number" id="bit-flow-cold" value="0.8" step="0.01">
                </div>
                <div class="input-group">
                    <label for="bit-temp-cold-in">T<sub>ent</sub> Frio (°C):</label>
                    <input type="number" id="bit-temp-cold-in" value="20" step="1">
                </div>
            </div>
            
            <div class="input-group">
                <label for="bit-length">Comprimento (m):</label>
                <input type="number" id="bit-length" value="3" step="0.1">
            </div>
            
            <button id="calculate-bit">Calcular</button>
            <div id="bit-graph"></div>
            <div id="bit-results" class="results"></div>
        </div>
    `;
}

export function init() {
    document.getElementById('calculate-bit').addEventListener('click', calculateBitubular);
    calculateBitubular();
}

function calculateBitubular() {
    // Obter parâmetros
    const m_hot = parseFloat(document.getElementById('bit-flow-hot').value);
    const m_cold = parseFloat(document.getElementById('bit-flow-cold').value);
    const Th_in = parseFloat(document.getElementById('bit-temp-hot-in').value);
    const Tc_in = parseFloat(document.getElementById('bit-temp-cold-in').value);
    const L = parseFloat(document.getElementById('bit-length').value);
    
    // Constantes (exemplo)
    const Cp_hot = 4.18; // kJ/kg.K (água)
    const Cp_cold = 4.18;
    const U = 850; // W/m².K
    
    // Cálculos
    const positions = Array.from({length: 20}, (_, i) => i * L / 20);
    const Th = positions.map(x => Th_in - (Th_in - Tc_in) * 0.8 * (1 - Math.exp(-x/L*3)));
    const Tc = positions.map(x => Tc_in + (Th_in - Tc_in) * 0.8 * (1 - Math.exp(-x/L*2)));
    
    // Resultados finais
    const Q = m_hot * Cp_hot * (Th_in - Th[Th.length-1]);
    const efficiency = ((Th_in - Th[Th.length-1]) / (Th_in - Tc_in)) * 100;
    
    // Plotagem
    Plotly.newPlot('bit-graph', [{
        x: positions,
        y: Th,
        name: 'Fluido Quente',
        line: {color: '#e74c3c'}
    }, {
        x: positions,
        y: Tc,
        name: 'Fluido Frio',
        line: {color: '#3498db'}
    }], {
        title: 'Perfil de Temperaturas',
        xaxis: {title: 'Comprimento (m)'},
        yaxis: {title: 'Temperatura (°C)'}
    });
    
    // Resultados
    document.getElementById('bit-results').innerHTML = `
        <h3>Resultados</h3>
        <table>
            <tr><td>Carga Térmica:</td><td><b>${Q.toFixed(2)} kW</b></td></tr>
            <tr><td>Eficiência Térmica:</td><td><b>${efficiency.toFixed(1)}%</b></td></tr>
            <tr><td>T<sub>saída</sub> Quente:</td><td><b>${Th[Th.length-1].toFixed(1)} °C</b></td></tr>
            <tr><td>T<sub>saída</sub> Frio:</td><td><b>${Tc[Tc.length-1].toFixed(1)} °C</b></td></tr>
        </table>
    `;
}