// Navegação entre calculadoras
function showCalculator(calcId) {
    document.querySelectorAll('.calculator').forEach(calc => {
        calc.classList.remove('active');
    });
    document.getElementById(calcId).classList.add('active');
    
    // Atualiza menu ativo
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Termodinâmica: Destilação binária (exemplo anterior)
function calculateThermo() {
    const alpha = parseFloat(document.getElementById('thermo-alpha').value);
    const xF = parseFloat(document.getElementById('thermo-xF').value);
    
    // Gerar curva de equilíbrio
    const x_A = Array.from({length: 100}, (_, i) => i/100);
    const y_A = x_A.map(x => (alpha * x) / (1 + (alpha - 1) * x));
    
    // Plotar gráfico
    Plotly.newPlot('thermo-graph', [{
        x: x_A,
        y: y_A,
        name: 'Curva de Equilíbrio',
        mode: 'lines'
    }, {
        x: [0, 1],
        y: [0, 1],
        name: 'Linha 45°',
        line: { dash: 'dash' }
    }], {
        title: 'Diagrama de Equilíbrio Líquido-Vapor',
        xaxis: { title: 'Fração molar no líquido (x_A)' },
        yaxis: { title: 'Fração molar no vapor (y_A)' }
    });
}

// Fenômenos de Transporte: Perda de carga (exemplo)
function calculateTransport() {
    const diameter = parseFloat(document.getElementById('pipe-diameter').value);
    // Cálculos fictícios para exemplo
    const velocity = 1.5 / diameter;
    const pressureDrop = 100 * (1 - diameter);
    
    Plotly.newPlot('transport-graph', [{
        y: [pressureDrop],
        type: 'bar',
        name: 'Perda de carga (kPa)'
    }], {
        title: `Resultados para tubulação de ${diameter}m`
    });
}

// Operações Unitárias: Eficiência de pratos (exemplo)
function calculateOperations() {
    const stages = parseInt(document.getElementById('op-stages').value);
    const efficiency = Array.from({length: stages}, (_, i) => 80 + Math.random() * 20);
    
    Plotly.newPlot('operations-graph', [{
        y: efficiency,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Eficiência por prato (%)'
    }], {
        title: `Eficiência em ${stages} pratos teóricos`
    });
}

// Atualiza valores de sliders
document.getElementById('thermo-xF').addEventListener('input', function() {
    document.getElementById('thermo-xF-value').textContent = this.value;
});

// Inicializa a calculadora padrão
window.onload = function() {
    calculateThermo();
};
