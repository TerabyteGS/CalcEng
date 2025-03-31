class ContentRenderer {
    static renderLatex(content) {
        // Substitui comandos LaTeX por HTML/Markdown
        return content
            .replace(/\\section\*\{([^}]+)\}/g, '<h2>$1</h2>')
            .replace(/\\subsection\*\{([^}]+)\}/g, '<h3>$1</h3>')
            .replace(/\\begin\{itemize\}(.*?)\\end\{itemize\}/gs, (_, items) => {
                const listItems = items.replace(/\\item\s+(.*?)(?=\\item|$)/gs, '<li>$1</li>');
                return `<ul>${listItems}</ul>`;
            })
            .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
            .replace(/\\[(\w+)\]\{([^}]+)\}/g, '<span class="equation">$2</span>')
            .replace(/\\begin\{figure\}(.*?)\\end\{figure\}/gs, (_, content) => {
                const imgMatch = content.match(/\\includegraphics\[.*?\]\{([^}]+)\}/);
                const captionMatch = content.match(/\\caption\{([^}]*)\}/);
                return `
                    <div class="figure">
                        <img src="${imgMatch ? imgMatch[1] : ''}" alt="${captionMatch ? captionMatch[1] : ''}">
                        ${captionMatch ? `<p class="caption">${captionMatch[1]}</p>` : ''}
                    </div>
                `;
            });
    }

    static async loadNote(path) {
        try {
            const response = await fetch(path);
            const content = await response.text();
            return this.renderLatex(content);
        } catch (error) {
            return `<div class="error">Erro ao carregar anotação: ${error.message}</div>`;
        }
    }
}