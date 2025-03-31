// Configuração dos módulos
const modulesConfig = {
    "Termodinâmica": {
        "Destilação Binária": "termodinamica/destilacao.js",
        "Equilíbrio de Fases": "termodinamica/equilibrio-fases.js"
    },
    "Fenômenos de Transporte": {
        "Perda de Carga": "fenomenos-transporte/perda-carga.js",
        "Reator CSTR": "fenomenos-transporte/cstr.js"
    },
    "Operações Unitárias": {
        "Reator PFR": "operacoes-unitarias/pfr.js",
        "Trocador de Calor": "operacoes-unitarias/trocador-calor.js"
    }
};

// Gera o menu dinamicamente
function generateMenu() {
    const menuContainer = document.getElementById('main-menu');
    
    for (const [category, calculators] of Object.entries(modulesConfig)) {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<i class="fas fa-folder"></i> ${category}`;
        categoryItem.classList.add('category');
        
        const submenu = document.createElement('ul');
        submenu.classList.add('submenu');
        
        for (const [name, path] of Object.entries(calculators)) {
            const calculatorItem = document.createElement('li');
            calculatorItem.textContent = name;
            calculatorItem.dataset.path = path;
            calculatorItem.classList.add('calculator-item');
            submenu.appendChild(calculatorItem);
        }
        
        categoryItem.appendChild(submenu);
        menuContainer.appendChild(categoryItem);
        
        // Adiciona evento de clique para expandir/recolher
        categoryItem.addEventListener('click', (e) => {
            if (e.target === categoryItem) {
                submenu.classList.toggle('expanded');
                categoryItem.querySelector('i').classList.toggle('fa-folder-open');
                categoryItem.querySelector('i').classList.toggle('fa-folder');
            }
        });
    }
    
    // Adiciona eventos aos itens de calculadora
    document.querySelectorAll('.calculator-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.stopPropagation();
            await loadCalculator(e.target.dataset.path);
        });
    });
}

// Carrega dinamicamente o módulo da calculadora
async function loadCalculator(modulePath) {
    try {
        // Remove o módulo anterior se existir
        if (window.currentModule) {
            delete window.currentModule;
        }
        
        // Carrega o novo módulo
        const module = await import(`./${modulePath}`);
        window.currentModule = module;
        
        // Renderiza a interface
        document.getElementById('calculator-container').innerHTML = module.getInterface();
        
        // Inicializa a calculadora
        if (module.init) {
            module.init();
        }
    } catch (error) {
        console.error(`Erro ao carregar o módulo: ${error}`);
        document.getElementById('calculator-container').innerHTML = `
            <div class="error">
                <h3>Erro ao carregar a calculadora</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    generateMenu();
});