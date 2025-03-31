// Configuração dos módulos
const modulesConfig = {
    "Calculadoras": {
        "Termodinâmica": {
            "Destilação Binária": { 
                path: "./termodinamica/destilacao.js", 
                type: "calculator" 
            }
        }
    },
    "Anotações": {
        "Termodinâmica": {
            "Ciclos Termodinâmicos": { 
                path: "./anotacoes/termodinamica/ciclos.js", 
                type: "note" 
            }
        },
        "Engenharia de Alimentos": {
            "Fermentação": { 
                path: "./anotacoes/Engenharia de Alimentos/Fermentação Pizza.js", 
                type: "note" 
            }
        },
        "Outras Palvavras": {
            "5 teses do Marxismo": { 
                path: "./anotacoes/filosofia/OutrasPalvras - 5 teses do Marxismo.js", 
                type: "note" 
            }
        }
    }
};

// Carregador de conteúdo robusto
async function loadContent(config) {
    const container = document.getElementById('content-container');
    if (!container) {
        console.error('Container principal não encontrado!');
        return;
    }

    try {
        container.innerHTML = '<div class="loader">Carregando...</div>';
        
        // Debug: Mostra o caminho que está tentando carregar
        console.log(`Tentando carregar: ${config.path}`);
        
        if (config.type === 'calculator') {
            // Adiciona timestamp para evitar cache
            const module = await import(`${config.path}?t=${Date.now()}`);
            
            if (!module.getInterface) {
                throw new Error('Módulo não exporta getInterface()');
            }
            
            container.innerHTML = module.getInterface();
            
            if (module.init) {
                await module.init();
            }
        } 
        else if (config.type === 'note') {
            const module = await import(`${config.path}?t=${Date.now()}`);
            
            if (!module.content) {
                throw new Error('Módulo não exporta content');
            }
            
            container.innerHTML = `
                <div class="note-viewer">
                    ${renderLatexContent(module.content)}
                </div>
            `;
            
            if (window.MathJax && window.MathJax.typesetPromise) {
                await MathJax.typesetPromise();
            }
        }
    } catch (error) {
        console.error('Erro detalhado ao carregar:', error);
        container.innerHTML = `
            <div class="error">
                <h3>Erro ao carregar conteúdo</h3>
                <p>${error.message}</p>
                <p>Caminho tentado: ${config.path}</p>
                <button onclick="location.reload()">Recarregar Página</button>
            </div>
        `;
    }
}
function renderLatexContent(content) {
    // Primeiro processa listas aninhadas (começando pelas mais internas)
    content = processNestedLists(content);
    
    // Depois processa o resto do conteúdo
    content = processSectionsAndFormatting(content);
    
    return content;
}

function processNestedLists(content) {
    // Processa listas de dentro para fora
    let lastContent;
    do {
        lastContent = content;
        content = content.replace(/\\begin\{(itemize|enumerate)\}(.*?)\\end\{\1\}/gs, (match, env, items) => {
            const listItems = items.split('\\item')
                .filter(item => item.trim()) // Remove itens vazios
                .map(item => {
                    // Processa qualquer formatação dentro do item
                    let processedItem = item.trim()
                        .replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>')
                        .replace(/\\textit\{(.*?)\}/g, '<em>$1</em>');
                    return `<li>${processedItem}</li>`;
                })
                .join('');
            return env === 'enumerate' ? `<ol>${listItems}</ol>` : `<ul>${listItems}</ul>`;
        });
    } while (content !== lastContent); // Repete até não haver mais mudanças
    
    return content;
}

function processSectionsAndFormatting(content) {
    // 2. Processa seções
    content = content.replace(/\\section\*?\{(.*?)\}/g, '<h2>$1</h2>');
    content = content.replace(/\\subsection\*?\{(.*?)\}/g, '<h3>$1</h3>');

    // 3. Processa formatação de texto (para texto fora das listas)
    content = content.replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>');
    content = content.replace(/\\textit\{(.*?)\}/g, '<em>$1</em>');

    // 4. Processa equações matemáticas
    content = content.replace(/\\\[(.*?)\\\]/gs, '<div class="math-display">\\[$1\\]</div>');
    content = content.replace(/\\\((.*?)\\\)/gs, '<span class="math-inline">\\($1\\)</span>');

    // 5. Processa figuras
    content = content.replace(/\\begin\{figure\}(.*?)\\end\{figure\}/gs, (match, figContent) => {
        const imgMatch = figContent.match(/\\includegraphics\[.*?\]\{(.*?)\}/);
        const captionMatch = figContent.match(/\\caption\{(.*?)\}/);
        
        let imgPath = imgMatch ? imgMatch[1] : '';
        imgPath = imgPath.replace('anotacoes/', './assets/js/core/anotacoes/');
        
        return `
            <div class="figure">
                ${imgMatch ? `<img src="${imgPath}" alt="${captionMatch?.[1] || ''}">` : ''}
                ${captionMatch ? `<p class="caption">${captionMatch[1]}</p>` : ''}
            </div>
        `;
    });

    return content;
}

function generateMenu() {
    const menuContainer = document.getElementById('main-menu');
    if (!menuContainer) return;

    // Limpa o menu existente
    menuContainer.innerHTML = '';

    for (const [mainCategory, subCategories] of Object.entries(modulesConfig)) {
        // Cria item da categoria principal
        const categoryItem = document.createElement('li');
        categoryItem.className = 'category';
        categoryItem.innerHTML = `
            <i class="fas fa-folder"></i> ${mainCategory}
            <i class="fas fa-chevron-down arrow"></i>
        `;

        // Cria submenu
        const submenu = document.createElement('ul');
        submenu.className = 'submenu';

        for (const [subCategory, items] of Object.entries(subCategories)) {
            // Cria item da subcategoria
            const subItem = document.createElement('li');
            subItem.className = 'subcategory';
            subItem.innerHTML = `
                <i class="fas fa-folder"></i> ${subCategory}
                <i class="fas fa-chevron-down arrow"></i>
            `;

            // Cria lista de itens
            const itemsList = document.createElement('ul');
            itemsList.className = 'items-list';

            for (const [itemName, config] of Object.entries(items)) {
                const item = document.createElement('li');
                item.innerHTML = `
                    <i class="fas ${config.type === 'note' ? 'fa-file-alt' : 'fa-calculator'}"></i> 
                    ${itemName}
                `;
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    loadContent(config);
                });
                itemsList.appendChild(item);
            }

            // Adiciona evento para expandir/recolher subcategorias
            subItem.addEventListener('click', (e) => {
                e.stopPropagation();
                const arrow = subItem.querySelector('.arrow');
                itemsList.classList.toggle('expanded');
                arrow.classList.toggle('fa-chevron-down');
                arrow.classList.toggle('fa-chevron-up');
            });

            subItem.appendChild(itemsList);
            submenu.appendChild(subItem);
        }

        // Adiciona evento para expandir/recolher categorias principais
        categoryItem.addEventListener('click', (e) => {
            e.stopPropagation();
            const arrow = categoryItem.querySelector('.arrow');
            submenu.classList.toggle('expanded');
            arrow.classList.toggle('fa-chevron-down');
            arrow.classList.toggle('fa-chevron-up');
        });

        categoryItem.appendChild(submenu);
        menuContainer.appendChild(categoryItem);
    }
}

// Inicialização segura
document.addEventListener('DOMContentLoaded', () => {
    generateMenu();
    
    // Carrega conteúdo inicial se houver parâmetro na URL
    const urlParams = new URLSearchParams(window.location.search);
    const initialContent = urlParams.get('content');
    if (initialContent) {
        // Lógica para carregar conteúdo baseado na URL
    }
});