export function getInterface() {
    return `
        <div class="calculator">
            <h2><i class="fas fa-cogs"></i> Controlador PID</h2>
            <div class="input-group">
                <label for="pid-kp">Ganho Proporcional (K<sub>p</sub>):</label>
                <input type="number" id="pid-kp" value="1.0" step="0.1">
            </div>
            <div class="input-group">
                <label for="pid-ki">Ganho Integral (K<sub>i</sub>, min⁻¹):</label>
                <input type="number" id="pid-ki" value="0.1" step="0.01">
            </div>
            <div class="input-group">
                <label for="pid-kd">Ganho Derivativo (K<sub>d</sub>, min):</label>
                <input type="number" id="pid-kd" value="0.5" step="0.1">
            </div>
            <div class="input-group">
                <label for="pid-setpoint">Setpoint:</label>
                <input type="number" id="pid-setpoint" value="100" step="1">
            </div>
            <div class="input-group">
                <label for="pid-time">Tempo de Simulação (min):</label>
                <input type="number" id="pid-time" value="10" step="1" min="1">
            </div>
            <button id="calculate-pid">Simular Resposta</button>
            <div id="pid-graph"></div>
            <div id="pid-params" class="results"></div>
        </div>
    `;
}

export function init() {
    document.getElementById('calculate-pid').addEventListener('click', simulatePID);
    simulatePID();
}

function simulatePID() {
    // Parâmetros do controlador
    const Kp = parseFloat(document.getElementById('pid-kp').value);
    const Ki = parseFloat(document.getElementById('pid-ki').value);
    const Kd = parseFloat(document.getElementById('pid-kd').value);
    const setpoint = parseFloat(document.getElementById('pid-setpoint').value);
    const simTime = parseFloat(document.getElementById('pid-time').value);
    
    // Simulação da resposta
    const time = Array.from({length: 100}, (_, i) => i * simTime / 100);
    let integral = 0, lastError = 0;
    const response = time.map(t => {
        // Modelo do processo (1ª ordem com atraso)
        const processVar = 80 * (1 - Math.exp(-t/3)) + 20;
        const error = setpoint - processVar;
        integral += error * (simTime/100);
        const derivative = (error - lastError) / (simTime/100);
        lastError = error;
        
        return Kp * error + Ki * integral + Kd * derivative;
    });
    
    // Plotagem
    Plotly.newPlot('pid-graph', [{
        x: time,
        y: response,
        name: 'Saída do Controlador',
        line: {color: '#3498db', width: 3}
    }, {
        x: time,
        y: Array(time.length).fill(setpoint),
        name: 'Setpoint',
        line: {dash: 'dash', color: '#e74c3c'}
    }], {
        title: 'Resposta do Controlador PID',
        xaxis: {title: 'Tempo (min)'},
        yaxis: {title: 'Variável Controlada'},
        margin: {t: 40}
    });
    
    // Exibir parâmetros
    document.getElementById('pid-params').innerHTML = `
        <h3>Parâmetros do Controlador</h3>
        <table>
            <tr><td>Tempo Integral (τ<sub>i</sub>):</td><td><b>${(Kp/Ki).toFixed(2)} min</b></td></tr>
            <tr><td>Tempo Derivativo (τ<sub>d</sub>):</td><td><b>${(Kd/Kp).toFixed(2)} min</b></td></tr>
            <tr><td>Ação de Controle:</td><td><b>${Ki === 0 && Kd === 0 ? 'P' : Ki === 0 ? 'PD' : Kd === 0 ? 'PI' : 'PID'}</b></td></tr>
        </table>
    `;
}