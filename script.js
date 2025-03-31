// Navegação entre calculadoras (mantida igual)
function showCalculator(calcId) {
    document.querySelectorAll('.calculator').forEach(calc => {
        calc.classList.remove('active');
    });
    document.getElementById(calcId).classList.add('active');
    
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// 1. Termodinâmica: Curva de equilíbrio (melhorada)
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
    }, {
        x: [xF, xF],
        y: [0, (alpha * xF) / (1 + (alpha - 1) * xF)],
        name: 'Linha de Alimentação',
        line: {color: '#e74c3c', width: 2}
    }], {
        title: 'Diagrama de Equilíbrio L-V com Linhas de Operação',
        xaxis: {title: 'x<sub>A</sub> (líquido)'},
        yaxis: {title: 'y<sub>A</sub> (vapor)'},
        showlegend: true
    });
}

// 2. Reator CSTR - Perfil de Concentração
function calculateTransport() {
    const CA0 = parseFloat(document.getElementById('cstr-CA0').value);  // mol/L
    const k = parseFloat(document.getElementById('cstr-k').value);      // constante cinética
    const tau = parseFloat(document.getElementById('cstr-tau').value);  // tempo espacial
    
    // Equação de projeto para CSTR (1ª ordem)
    const CA = CA0 / (1 + k * tau);
    const X = (CA0 - CA) / CA0;
    
    // Simulação do perfil temporal
    const time = Array.from({length: 100}, (_, i) => i * tau * 2 / 100);
    const concentration = time.map(t => CA0 * Math.exp(-k * t));
    
    Plotly.newPlot('transport-graph', [{
        x: time,
        y: concentration,
        name: 'Perfil de Concentração',
        mode: 'lines',
        line: {color: '#2ecc71', width: 3}
    }, {
        x: [tau, tau],
        y: [0, CA0],
        name: 'Tempo Espacial (τ)',
        line: {dash: 'dot', color: '#e74c3c'}
    }], {
        title: `CSTR: Conversão Final X = ${(X*100).toFixed(1)}%`,
        xaxis: {title: 'Tempo (min)'},
        yaxis: {title: 'Concentração (mol/L)'}
    });
}

// 3. Reator PFR - Perfil Axial
function calculateOperations() {
    const CA0_pfr = parseFloat(document.getElementById('pfr-CA0').value);
    const k_pfr = parseFloat(document.getElementById('pfr-k').value);
    const L = parseFloat(document.getElementById('pfr-length').value);
    
    // Discretização do reator
    const positions = Array.from({length: 50}, (_, i) => i * L / 50);
    const concentration = positions.map(z => CA0_pfr * Math.exp(-k_pfr * z));
    
    Plotly.newPlot('operations-graph', [{
        x: positions,
        y: concentration,
        name: 'Perfil Axial',
        mode: 'lines+markers',
        line: {color: '#9b59b6', width: 3}
    }], {
        title: 'Perfil de Concentração no PFR',
        xaxis: {title: 'Comprimento do Reator (m)'},
        yaxis: {title: 'Concentração (mol/L)'}
    });
}

// 4. Trocador de Calor Bitubular
function calculateHeatExchange() {
    const m_dot = parseFloat(document.getElementById('he-mass-flow').value);  // kg/s
    const Cp = parseFloat(document.getElementById('he-Cp').value);            // kJ/kg.K
    const T_in = parseFloat(document.getElementById('he-Tin').value);         // °C
    const T_out = parseFloat(document.getElementById('he-Tout').value);       // °C
    const U = parseFloat(document.getElementById('he-U').value);              // W/m².K
    const ΔT_lm = parseFloat(document.getElementById('he-DTlm').value);       // K
    
    // Cálculo da área de troca
    const Q = m_dot * Cp * (T_out - T_in);  // kW
    const A = (Q * 1000) / (U * ΔT_lm);     // m²
    
    // Perfil de temperatura
    const positions = Array.from({length: 20}, (_, i) => i);
    const hotTemp = positions.map(p => T_in - (T_in - T_out) * p/20);
    const coldTemp = positions.map(p => 20 + (T_out - 20) * p/20);
    
    Plotly.newPlot('heat-graph', [{
        x: positions,
        y: hotTemp,
        name: 'Fluido Quente',
        mode: 'lines+markers',
        line: {color: '#e74c3c', width: 2}
    }, {
        x: positions,
        y: coldTemp,
        name: 'Fluido Frio',
        mode: 'lines+markers',
        line: {color: '#3498db', width: 2}
    }], {
        title: `Área Necessária: ${A.toFixed(2)} m² | Carga Térmica: ${Q.toFixed(2)} kW`,
        xaxis: {title: 'Posição ao Longo do Trocador'},
        yaxis: {title: 'Temperatura (°C)'}
    });
}

// Atualiza valores de sliders
document.getElementById('thermo-xF').addEventListener('input', function() {
    document.getElementById('thermo-xF-value').textContent = this.value;
});

// Inicialização
window.onload = function() {
    calculateThermo();
};