export function getInterface() {
    return `
        <div class="calculator">
            <h2><i class="fas fa-dharmachakra"></i> Trocador Casco-Tubo</h2>
            <div class="input-row">
                <div class="input-group">
                    <label for="shell-npasses">Nº de Passes no Casco:</label>
                    <select id="shell-npasses">
                        <option value="1">1</option>
                        <option value="2" selected>2</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="shell-tubes">Nº de Tubos:</label>
                    <input type="number" id="shell-tubes" value="100" min="1">
                </div>
            </div>
            
            <div class="input-group">
                <label for="shell-diameter">Diâmetro do Casco (m):</label>
                <input type="number" id="shell-diameter" value="0.5" step="0.01">
            </div>
            
            <button id="calculate-shell">Calcular</button>
            <div id="shell-results" class="results"></div>
            <div id="shell-diagram"></div>
        </div>
    `;
}

export function init() {
    document.getElementById('calculate-shell').addEventListener('click', calculateShellTube);
    calculateShellTube();
}

function calculateShellTube() {
    const nPasses = parseInt(document.getElementById('shell-npasses').value);
    const nTubes = parseInt(document.getElementById('shell-tubes').value);
    const D_shell = parseFloat(document.getElementById('shell-diameter').value);
    
    // Cálculos de dimensionamento
    const tubeLayout = nPasses === 1 ? 'Triangular' : 'Quadrada';
    const pitch = 1.25 * 0.0254; // Espaçamento entre tubos (exemplo)
    const area = (Math.PI * D_shell**2 / 4) * 0.8; // Área útil
    
    // Resultados
    document.getElementById('shell-results').innerHTML = `
        <h3>Especificações Técnicas</h3>
        <table>
            <tr><td>Arranjo dos Tubos:</td><td><b>${tubeLayout}</b></td></tr>
            <tr><td>Área de Troca:</td><td><b>${area.toFixed(3)} m²</b></td></tr>
            <tr><td>Diâmetro do Feixe:</td><td><b>${(D_shell*0.9).toFixed(3)} m</b></td></tr>
            <tr><td>Comprimento dos Tubos:</td><td><b>${(D_shell*3).toFixed(1)} m</b></td></tr>
        </table>
    `;
    
    // Diagrama esquemático (simplificado)
    document.getElementById('shell-diagram').innerHTML = `
        <svg width="100%" height="200" viewBox="0 0 300 100" style="margin-top:20px;">
            <rect x="20" y="30" width="260" height="40" fill="#bdc3c7" stroke="#2c3e50"/>
            ${Array.from({length: nTubes/10}).map((_,i) => 
                `<circle cx="${40 + i*220/(nTubes/10)}" cy="50" r="3" fill="#3498db"/>`
            ).join('')}
            <path d="M20,50 H10 M280,50 H290" stroke="#e74c3c" stroke-width="2"/>
            <text x="10" y="20" font-size="10">Fluido Quente</text>
            <text x="250" y="20" font-size="10">Fluido Frio</text>
        </svg>
    `;
}