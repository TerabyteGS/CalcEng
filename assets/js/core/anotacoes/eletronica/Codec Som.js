export const content = `No alto-falante do celular, o áudio toca exatamente na qualidade que o YouTube entrega (AAC 256 kbps no YouTube Premium).

Como o som já está no formato AAC, o celular não precisa converter para outro codec (como faria no Bluetooth). Ele apenas:

\\begin{itemize}
    \\item Decodifica o AAC (transforma em som digital interno).
    \\item Usa seu DAC interno para converter o som digital em analógico.
    \\item Amplifica o sinal e envia para os alto-falantes.
\\end{itemize}

A qualidade final depende do alto-falante! Mesmo que o áudio do YouTube tenha boa qualidade, os alto-falantes do celular são pequenos e têm limitações, como:

\\begin{itemize}
    \\item Poucos graves (baixo fraco).
    \\item Som mais comprimido por causa do tamanho dos drivers.
    \\item Menos separação estéreo (porque os alto-falantes estão muito próximos).
\\end{itemize}

Se você conectar o celular a um fone de ouvido ou caixa de som de qualidade, o áudio do YouTube soará melhor, pois os alto-falantes conseguem reproduzir mais detalhes.

\\section{Modo de reprodução via Bluetooth ou Cabo}

\\textbf{Se o fone estiver no modo Bluetooth:}

\\begin{itemize}
    \\item O celular transmite o áudio digitalmente via Bluetooth.
    \\item O DAC do fone faz a conversão digital para analógico.
    \\item O som que você ouve depende da qualidade do DAC do fone.
\\end{itemize}

\\textbf{Se o fone estiver conectado por cabo (AUX/P2 ou USB-C), há dois cenários possíveis:}

\\textbf{Caso A: O fone aceita sinal analógico (P2/AUX)}
\\begin{itemize}
    \\item O celular faz a conversão digital para analógico usando seu próprio DAC.
    \\item O fone recebe o sinal analógico pronto e só o amplifica.
    \\item O DAC do fone NÃO entra em ação, apenas os drivers reproduzem o som.
\\end{itemize}

\\textbf{Caso B: O fone aceita apenas sinal digital (USB-C ou Lightning)}
\\begin{itemize}
    \\item O áudio continua digital até o fone.
    \\item O DAC dentro do fone faz a conversão digital para analógico.
    \\item O celular apenas envia os dados digitais, sem usar seu DAC interno.
\\end{itemize}

Se for cabo P2 (AUX), geralmente é sinal analógico (DAC do celular ativo). Se for USB-C ou Lightning, o fone pode ter um DAC interno (DAC do fone ativo).

\\section{Quem faz a conversão?}

\\begin{itemize}
    \\item No Bluetooth $\\rightarrow$ O fone usa seu próprio DAC.
    \\item No cabo P2 $\\rightarrow$ O celular usa seu DAC e o fone apenas toca o som.
    \\item No cabo USB-C/Lightning $\\rightarrow$ Depende do fone! Pode ser o DAC do fone ou do celular.
\\end{itemize}

Se for um fone com fio:
\\begin{itemize}
    \\item O DAC do celular faz a conversão digital para analógica.
    \\item O celular envia um sinal analógico pelo cabo para o fone.
    \\item O fone apenas recebe e reproduz o som — não precisa de DAC próprio.
\\end{itemize}

Se for um fone Bluetooth:
\\begin{itemize}
    \\item O celular mantém o áudio digital e usa um codec Bluetooth (AAC, aptX, LDAC, etc.).
    \\item O fone Bluetooth tem seu próprio DAC, que converte o áudio digital em som analógico.
    \\item O DAC do fone pode ser bom ou ruim, o que afeta a qualidade do som.
\\end{itemize}

\\textbf{Ou seja:} Com fio $\\rightarrow$ O DAC do celular faz o trabalho. Bluetooth $\\rightarrow$ O DAC do fone faz o trabalho.

\\section{CODEC e Taxa de Transmissão}

Um CODEC (Codificador-Decodificador) comprime o áudio para reduzir o tamanho dos dados transmitidos e descomprime no fone para reproduzir o som.

Se a compressão for muito forte, o áudio perde qualidade. Se a compressão for eficiente, o áudio pode manter qualidade mesmo com arquivos menores.

Cada codec tem um limite máximo de taxa de bits (bitrate), ou seja, a quantidade de dados enviados por segundo.

\\textbf{Exemplos de bitrates por CODEC:}
\\begin{itemize}
    \\item SBC: ~328 kbps (Média)
    \\item AAC: ~256 kbps (iPhone), ~320 kbps (Android) (Boa)
    \\item aptX: ~384 kbps (Boa)
    \\item aptX HD: ~576 kbps (Muito boa)
    \\item LDAC: 330 / 660 / 990 kbps (Quase sem perdas em 990 kbps)
    \\item FLAC (não via Bluetooth): ~1000 - 3000 kbps (Qualidade de estúdio)
\\end{itemize}

LDAC pode chegar a 990 kbps, que é quase a qualidade de um FLAC. Já SBC e AAC perdem mais qualidade.

\\section{Hardware que Afeta o Som}

\\begin{itemize}
    \\item \\textbf{DAC (Conversor Digital para Analógico):} Está no celular ou no fone de ouvido (se for Bluetooth). Converte o áudio digital (AAC, FLAC, MP3) em sinais elétricos para os alto-falantes. DACs melhores preservam mais detalhes e reduzem ruído.
    \\item \\textbf{Amplificador de Áudio:} Aumenta a potência do sinal antes de enviar para os fones ou alto-falantes. Amplificadores ruins podem distorcer o som ou limitar frequências.
    \\item \\textbf{Alto-falante ou driver do fone:} Quanto maior e melhor o driver, melhor a qualidade do som. Fones premium têm diafragmas maiores e materiais melhores para graves mais profundos e agudos mais claros.
    \\item \\textbf{Bluetooth:} Se for um fone Bluetooth, a qualidade do áudio depende do codec que ele suporta (AAC, aptX, LDAC). Bluetooth tem limitação de banda, então nunca transmite áudio "puro" como um fone com fio faria.
\\end{itemize}
`;