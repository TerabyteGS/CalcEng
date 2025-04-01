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


async function loadContent(config) {
    const container = document.getElementById('content-container');
    if (!container) return;

    try {
        container.innerHTML = '<div class="loader">Carregando...</div>';
        
        console.log(`Tentando carregar: ${config.path}`);
        
        if (config.type === 'calculator') {
            
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
            // Adicione tratamento especial para nomes de arquivos com espaços
            const modulePath = encodeURI(config.path).replace(/%20/g, ' ');
            const module = await import(/* @vite-ignore */ `${modulePath}?t=${Date.now()}`);
            
            if (!module || !module.content) {
                throw new Error('Módulo não exporta conteúdo válido');
            }

            // Verifica se o conteúdo é uma string
            if (typeof module.content !== 'string') {
                throw new Error('O conteúdo deve ser uma string');
            }

            container.innerHTML = `
                <div class="note-viewer">
                    ${renderLatexContent(module.content)}
                </div>
            `;
            
            if (window.MathJax?.typesetPromise) {
                await MathJax.typesetPromise();
            }
        }
    } catch (error) {
        console.error('Erro ao carregar:', error);
        container.innerHTML = `
            <div class="error">
                <h3>Erro ao carregar conteúdo</h3>
                <p>${error.message}</p>
                <p>Arquivo: ${config.path}</p>
                <button onclick="location.reload()">Recarregar</button>
            </div>
        `;
    }
}



function renderLatexContent(content) {
    if (typeof content !== 'string') {
        console.error('Conteúdo não é uma string:', content);
        return '<div class="error">Formato de conteúdo inválido</div>';
    }

    try {
        // Processa citações primeiro
        content = processQuotes(content);
        
        // Processa listas aninhadas
        content = processNestedLists(content);
        
        // Processa tabelas
        content = processTables(content);
        
        // Processa seções e formatação
        content = processSectionsAndFormatting(content);
        
        return content;
    } catch (e) {
        console.error('Erro ao renderizar:', e);
        return `<div class="error">Erro de renderização: ${e.message}</div>`;
    }
}

function processQuotes(content) {
    return content.replace(/\\begin\{quote\}([\s\S]*?)\\end\{quote\}/g, (match, quoteContent) => {
        const processed = quoteContent
            .trim()
            .replace(/^``|''$/g, '')
            .replace(/\\enquote\{(.*?)\}/g, '"$1"');
        return `<blockquote>${processed}</blockquote>`;
    });
}

function processTables(content) {
    return content.replace(/\\begin\{table\}.*?\[.*?\](.*?)\\end\{table\}/gs, (match, tableContent) => {
        // Extrai caption
        const captionMatch = tableContent.match(/\\caption\{(.*?)\}/);
        const caption = captionMatch ? `<caption>${captionMatch[1]}</caption>` : '';
        
        // Processa o conteúdo tabular
        const tabularMatch = tableContent.match(/\\begin\{tabular\}(.*?)(.*?)\\end\{tabular\}/s);
        if (!tabularMatch) return '';
        
        const alignment = tabularMatch[1];
        const rows = tabularMatch[2].split('\\\\').filter(row => row.trim());
        
        // Processa linhas da tabela
        const processedRows = rows.map(row => {
            const cells = row.split('&').map(cell => {
                let processedCell = cell.trim()
                    .replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>')
                    .replace(/\\textit\{(.*?)\}/g, '<em>$1</em>');
                return `<td>${processedCell}</td>`;
            }).join('');
            
            return `<tr>${cells}</tr>`;
        }).join('');
        
        return `
            <div class="latex-table">
                <table>
                    ${caption}
                    ${processedRows}
                </table>
            </div>
        `;
    });
}



function processNestedLists(content) {
    let lastContent;
    do {
        lastContent = content;
        content = content.replace(/\\begin\{(itemize|enumerate)\}(.*?)\\end\{\1\}/gs, (match, env, items) => {
            const listItems = items.split('\\item')
                .filter(item => item.trim())
                .map(item => {
                    let processedItem = item.trim()
                        .replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>')
                        .replace(/\\textit\{(.*?)\}/g, '<em>$1</em>');
                    return `<li>${processedItem}</li>`;
                })
                .join('');
            return env === 'enumerate' ? `<ol>${listItems}</ol>` : `<ul>${listItems}</ul>`;
        });
    } while (content !== lastContent);
    
    return content;
}

function processSectionsAndFormatting(content) {
    // Processa seções
    content = content.replace(/\\section\*?\{(.*?)\}/g, '<h2>$1</h2>');
    content = content.replace(/\\subsection\*?\{(.*?)\}/g, '<h3>$1</h3>');

    // Processa formatação de texto
    content = content.replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>');
    content = content.replace(/\\textit\{(.*?)\}/g, '<em>$1</em>');

    // Processa equações matemáticas
    content = content.replace(/\\\[(.*?)\\\]/gs, '<div class="math-display">\\[$1\\]</div>');
    content = content.replace(/\\\((.*?)\\\)/gs, '<span class="math-inline">\\($1\\)</span>');

    // Processa figuras
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