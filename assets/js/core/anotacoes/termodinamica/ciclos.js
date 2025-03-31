export const content = `
\\section*{Ciclo de Carnot e Ciclo Rankine}

\\subsection*{Ciclo de Carnot}

\\begin{figure}
    \\includegraphics[width=0.45\\textwidth]{anotacoes/termodinamica/figures/ciclo-carnot.png}
    \\caption{Diagrama T-s do Ciclo de Carnot}
    \\label{fig:carnot}
\\end{figure}

O ciclo de Carnot é o ciclo ideal mais eficiente, operando entre dois limites de temperatura. No entanto, ele apresenta várias impraticabilidades:

\\begin{itemize}
    \\item \\textbf{Transferência isotérmica}: Limita a temperatura máxima do ciclo
    \\item \\textbf{Expansão isentrópica}: Vapor de baixa qualidade causa desgaste
    \\item \\textbf{Compressão isentrópica}: Difícil controle em compressores
\\end{itemize}

\\subsection*{Ciclo Rankine}

O ciclo Rankine supera essas limitações com quatro processos principais:

\\begin{itemize}
    \\item Compressão isentrópica na bomba
    \\item Adição de calor a pressão constante
    \\item Expansão isentrópica na turbina
    \\item Rejeição de calor no condensador
\\end{itemize}

A eficiência térmica é dada por:

\\[ \\eta_{\\text{térmica}} = 1 - \\frac{q_{\\text{out}}}{q_{\\text{in}}}
\\]
`;