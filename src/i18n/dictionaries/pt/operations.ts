import { OperationContent } from "../operation-types";
import { OperationKey } from "../../../types/operations";

const operationsPtContent: Record<OperationKey, OperationContent> = {
  compress: {
    key: "compress",
    slug: "comprimir",
    mode: "compress",
    meta: {
      title: "Comprimir PDF Online GrÃ¡tis | Reduzir Tamanho | JayPDF",
      description:
        "Reduza o tamanho do seu PDF eficientemente sem perda de qualidade. CompressÃ£o privada e gratuita direto no navegador.",
      keywords: [
        "comprimir pdf",
        "reduzir tamanho pdf",
        "otimizar pdf",
        "compressor pdf online",
        "pdf leve",
      ],
      ogTitle: "Comprimir PDFs sem perder qualidade | JayPDF",
      ogDescription:
        "Arraste seu arquivo, escolha o nÃ­vel de compressÃ£o ideal e baixe um PDF significativamente menor em segundos â€” totalmente seguro e sem uploads para servidores.",
      ogImageAlt: "Interface do JayPDF comprimindo um documento",
    },
    hero: {
      title: "Comprimir PDF online com qualidade",
      description:
        "Reduza o tamanho de documentos para caber em limites de e-mail, plataformas educacionais ou portais pÃºblicos mantendo a legibilidade.",
      bulletPoints: [
        "Processamento 100% local: seus arquivos nÃ£o saem do navegador",
        "Escolha compressÃ£o bÃ¡sica, intermediÃ¡ria ou agressiva conforme a necessidade",
        "Preserve metadados e estrutura quando for importante",
      ],
      imageAlt: "Fluxo de compressÃ£o de PDF no JayPDF",
    },
    benefitsTitle: "Por que comprimir PDFs com o JayPDF",
    benefits: [
      {
        title: "Qualidade equilibrada",
        description:
          "Nosso motor de compressÃ£o analisa cada recurso para entregar a maior reduÃ§Ã£o sem borrar textos ou grÃ¡ficos.",
      },
      {
        title: "Pronto para envios",
        description:
          "Gere arquivos que passam em limites rÃ­gidos de portais governamentais, universidades ou fluxos corporativos.",
      },
      {
        title: "Privacidade por padrÃ£o",
        description:
          "Evite uploads em servidores e reduza o risco de vazamentos cumprindo polÃ­ticas internas de privacidade.",
      },
    ],
    howTo: {
      title: "Como comprimir um PDF com o JayPDF",
      steps: [
        "Clique em â€œEnvie seus arquivosâ€ e escolha o PDF que deseja otimizar.",
        "Selecione o nÃ­vel de compressÃ£o e defina opÃ§Ãµes avanÃ§adas como manter metadados.",
        "Pressione â€œProcessarâ€ e baixe o documento comprimido em segundos.",
      ],
      note:
        "Precisa comprimir vÃ¡rios relatÃ³rios? FaÃ§a um por vez sem limites diÃ¡rios ou marcas d'Ã¡gua.",
    },
    useCasesTitle: "Quando vale a pena comprimir um PDF",
    useCases: [
      "Enviar contratos, notas fiscais ou manuais por e-mail sem estourar o limite de anexos.",
      "Enviar trabalhos para Moodle, Canvas ou qualquer AVA com limite rÃ­gido de arquivo.",
      "Deixar teses, catÃ¡logos ou relatÃ³rios mais leves para download.",
      "Arquivar documentos na nuvem economizando espaÃ§o sem perder informaÃ§Ãµes relevantes.",
    ],
  },
  merge: {
    key: "merge",
    slug: "juntar",
    mode: "merge",
    meta: {
      title: "Juntar PDF Online | Combinar VÃ¡rios PDFs GrÃ¡tis | JayPDF",
      description:
        "Combine vÃ¡rios PDF em um Ãºnico documento sem limites. Arraste, reordene e baixe seu arquivo unificado com privacidade.",
      keywords: [
        "juntar pdf",
        "combinar pdf",
        "unir arquivos pdf",
        "fundir pdf",
        "merge pdf",
      ],
      ogTitle: "Una mÃºltiplos PDFs em segundos | JayPDF",
      ogDescription:
        "Organize seus documentos na ordem perfeita, ajuste as configuraÃ§Ãµes e baixe um arquivo PDF unificado sem nunca enviar seus dados para a nuvem.",
      ogImageAlt: "JunÃ§Ã£o de arquivos PDF no JayPDF",
    },
    hero: {
      title: "Juntar PDFs online â€” rÃ¡pido e seguro",
      description:
        "Crie um arquivo polido com contratos, notas de aula ou polÃ­ticas prontas para enviar, assinar ou arquivar.",
      bulletPoints: [
        "Arraste e solte para definir a ordem final",
        "Sem limites ocultos: una documentos longos gratuitamente",
        "Mantenha marcadores e metadados quando necessÃ¡rio",
      ],
      imageAlt: "Ferramenta de junÃ§Ã£o de PDFs",
    },
    benefitsTitle: "Vantagens de juntar com o JayPDF",
    benefits: [
      {
        title: "Entrega consistente",
        description:
          "Garanta material em um Ãºnico arquivo com numeraÃ§Ã£o contÃ­nua e formato padronizado.",
      },
      {
        title: "Economia de tempo",
        description:
          "EsqueÃ§a editores pesados. Arraste, organize e baixe um documento pronto para compartilhar.",
      },
      {
        title: "Privado e sem cadastro",
        description:
          "NÃ£o armazenamos cÃ³pias nem pedimos dados pessoais â€” ideal para informaÃ§Ãµes confidenciais.",
      },
    ],
    howTo: {
      title: "Como juntar PDFs com o JayPDF",
      steps: [
        "Clique em â€œEnvie seus arquivosâ€ e selecione pelo menos dois PDFs.",
        "Use as setas ou o arrastar para definir a ordem final.",
        "Escolha as opÃ§Ãµes de marcadores e toque em â€œProcessarâ€ para baixar o PDF combinado.",
      ],
      note:
        "Precisa adicionar mais arquivos depois? Basta arrastar sem reiniciar o processo.",
    },
    useCasesTitle: "Quando juntar PDFs",
    useCases: [
      "Montar um dossiÃª com anexos, propostas e condiÃ§Ãµes comerciais.",
      "Enviar vÃ¡rias notas fiscais mensais em um Ãºnico arquivo.",
      "Reunir anotaÃ§Ãµes escaneadas e apresentaÃ§Ãµes em um PDF para alunos.",
      "Criar pacotes jurÃ­dicos completos para assinatura eletrÃ´nica.",
    ],
  },
  split: {
    key: "split",
    slug: "dividir",
    mode: "split",
    meta: {
      title: "Dividir PDF por PÃ¡ginas ou CapÃ­tulos | GrÃ¡tis | JayPDF",
      description:
        "Separe seu PDF em vÃ¡rios arquivos por intervalos ou capÃ­tulos. Controle total sobre a estrutura sem uploads para o servidor.",
      keywords: [
        "dividir pdf",
        "separar pdf",
        "dividir pdf por pÃ¡ginas",
        "split pdf",
        "partir pdf",
      ],
      ogTitle: "Divida PDFs com precisÃ£o | JayPDF",
      ogDescription:
        "Escolha exatamente como dividir seu documento, gere quantos arquivos individuais precisar e baixe-os instantaneamente para o seu dispositivo.",
      ogImageAlt: "Processo de divisÃ£o de PDF",
    },
    hero: {
      title: "Dividir PDFs por pÃ¡ginas ou segmentos",
      description:
        "Extraia capÃ­tulos, anexos ou seÃ§Ãµes especÃ­ficas em arquivos independentes prontos para compartilhar.",
      bulletPoints: [
        "Configure divisÃµes por nÃºmero de pÃ¡ginas ou por tamanho",
        "Gere vÃ¡rios PDFs em um Ãºnico processamento",
        "Trabalhe sem limites de pÃ¡ginas ou marcas d'Ã¡gua",
      ],
      imageAlt: "DivisÃ£o de documento PDF",
    },
    benefitsTitle: "O que a divisÃ£o com o JayPDF oferece",
    benefits: [
      {
        title: "Controle sobre o que compartilhar",
        description:
          "Entregue apenas a parte relevante sem expor informaÃ§Ãµes sensÃ­veis do restante do documento.",
      },
      {
        title: "Entrega escalÃ¡vel",
        description:
          "Gere vários arquivos de uma vez e salve os que precisar para arquivar ou enviar.",
      },
      {
        title: "Ajustes avanÃ§ados",
        description:
          "Crie lotes, adicione separadores ou defina formatos que combinam com seu fluxo.",
      },
    ],
    howTo: {
      title: "Como dividir um PDF com o JayPDF",
      steps: [
        "Envie o PDF que deseja segmentar.",
        "Escolha se vai dividir por nÃºmero fixo de pÃ¡ginas ou por tamanho do arquivo.",
        "Clique em “Processar” e depois use o botão ao lado de cada arquivo para salvá-lo.",
      ],
      note:
        "Salve cada resultado separadamente. As opções disponíveis dependem do navegador.",
    },
    useCasesTitle: "CenÃ¡rios comuns para dividir PDFs",
    useCases: [
      "Publicar cada capÃ­tulo de um livro digital em um curso online.",
      "Separar anexos que precisam ser enviados por canais diferentes.",
      "Extrair resumos trimestrais de relatÃ³rios financeiros extensos.",
      "Criar pacotes enxutos para clientes sem expor documentos internos.",
    ],
  },
  extract: {
    key: "extract",
    slug: "extrair",
    mode: "extract",
    meta: {
      title: "Extrair PÃ¡ginas de um PDF | Salvar SeleÃ§Ã£o | JayPDF",
      description:
        "Selecione pÃ¡ginas de qualquer PDF e crie um novo documento na hora. Processamento privado e ilimitado direto no navegador.",
      keywords: [
        "extraer paginas pdf",
        "salvar paginas pdf",
        "selecionar paginas pdf",
        "extrair paginas pdf",
        "novo pdf",
      ],
      ogTitle: "Extraia apenas as pÃ¡ginas necessÃ¡rias | JayPDF",
      ogDescription:
        "Marque as pÃ¡ginas relevantes que deseja manter, gere um novo arquivo PDF em segundos e garanta que seus dados permaneÃ§am seguros no seu prÃ³prio dispositivo.",
      ogImageAlt: "SeleÃ§Ã£o de pÃ¡ginas no JayPDF",
    },
    hero: {
      title: "Extrair pÃ¡ginas especÃ­ficas de um PDF",
      description:
        "Monte documentos sob medida mantendo apenas as pÃ¡ginas que vocÃª precisa compartilhar ou arquivar.",
      bulletPoints: [
        "Visualize miniaturas e marque pÃ¡ginas individuais",
        "Mantenha a numeraÃ§Ã£o original ou crie novas seÃ§Ãµes",
        "Baixe o PDF resultante imediatamente",
      ],
      imageAlt: "ExtraÃ§Ã£o de pÃ¡ginas em PDF",
    },
    benefitsTitle: "Vantagens de extrair pÃ¡ginas com o JayPDF",
    benefits: [
      {
        title: "Documentos mais relevantes",
        description:
          "Compartilhe apenas o conteÃºdo Ãºtil com equipe ou clientes evitando dados redundantes.",
      },
      {
        title: "Controle total no navegador",
        description:
          "Selecione, visualize e confirme cada pÃ¡gina sem softwares pesados ou conexÃ£o estÃ¡vel.",
      },
      {
        title: "Resultado limpo",
        description:
          "O novo PDF preserva qualidade e metadados conforme as opÃ§Ãµes escolhidas.",
      },
    ],
    howTo: {
      title: "Como extrair pÃ¡ginas com o JayPDF",
      steps: [
        "Envie o PDF e selecione o arquivo desejado.",
        "Marque as pÃ¡ginas necessÃ¡rias no painel de miniaturas.",
        "Clique em â€œProcessarâ€ para baixar um PDF com as pÃ¡ginas selecionadas.",
      ],
      note:
        "Combine a extraÃ§Ã£o com outras operaÃ§Ãµes como juntar ou comprimir em sessÃµes diferentes.",
    },
    useCasesTitle: "Ideias para extrair pÃ¡ginas",
    useCases: [
      "Compartilhar apenas o capÃ­tulo designado de um manual com a equipe.",
      "Enviar pÃ¡ginas especÃ­ficas de um contrato para revisÃ£o jurÃ­dica.",
      "Montar dossiÃªs personalizados com informaÃ§Ã£o relevante para cada cliente.",
      "Guardar somente pÃ¡ginas com formulÃ¡rios ou comprovantes que precisam ser arquivados.",
    ],
  },
  rotate: {
    key: "rotate",
    slug: "girar",
    mode: "rotate",
    meta: {
      title: "Girar paginas PDF online | Corrigir orientacao | JayPDF",
      description:
        "Gire paginas selecionadas de um PDF em 90 ou 180 graus direto no navegador. Gratis, privado e sem upload.",
      keywords: [
        "girar pdf",
        "girar paginas pdf",
        "corrigir orientacao pdf",
        "rotacao de paginas pdf",
        "pdf torto",
      ],
      ogTitle: "Gire paginas PDF em segundos | JayPDF",
      ogDescription:
        "Selecione as paginas com orientacao errada, escolha 90 ou 180 graus e baixe o PDF corrigido sem enviar nada.",
      ogImageAlt: "Rotacao de paginas PDF no JayPDF",
    },
    hero: {
      title: "Gire paginas PDF sem perder qualidade",
      description:
        "Corrija digitalizacoes inclinadas, paginas invertidas ou documentos com orientacoes misturadas em poucos cliques.",
      bulletPoints: [
        "Gire apenas as paginas selecionadas",
        "Escolha 90 graus para a direita, 180 graus ou 90 graus para a esquerda",
        "Tudo acontece localmente no navegador",
      ],
      imageAlt: "Fluxo de rotacao de paginas PDF",
    },
    benefitsTitle: "Por que girar paginas com o JayPDF",
    benefits: [
      {
        title: "Correcao precisa",
        description:
          "Ajuste apenas as folhas que precisam de correcao, ideal para lotes digitalizados e relatorios longos.",
      },
      {
        title: "Ajuste rapido",
        description:
          "Corrija a orientacao sem abrir editores pesados no desktop.",
      },
      {
        title: "Privacidade total",
        description:
          "Os documentos continuam no seu dispositivo porque a rotacao roda localmente.",
      },
    ],
    howTo: {
      title: "Como girar paginas PDF",
      steps: [
        "Envie o PDF e escolha o arquivo com as paginas que deseja corrigir.",
        "Marque as paginas e selecione 90 graus para a direita, 180 graus ou 90 graus para a esquerda.",
        "Clique em Processar para baixar o PDF com a nova orientacao.",
      ],
      note:
        "Depois voce ainda pode reordenar, extrair ou comprimir o arquivo corrigido.",
    },
    useCasesTitle: "Quando girar paginas ajuda",
    useCases: [
      "Corrigir contratos ou formularios escaneados de lado.",
      "Ajustar paginas invertidas dentro de relatorios montados com varias fontes.",
      "Preparar apostilas e manuais antes de compartilhar.",
      "Deixar arquivos antigos mais confortaveis para leitura na tela.",
    ],
  },
  crop: {
    key: "crop",
    slug: "recortar",
    mode: "crop",
    meta: {
      title: "Recortar páginas PDF online | Ajustar margens | JayPDF",
      description:
        "Recorte páginas PDF e remova margens extras diretamente no navegador. Tudo acontece localmente e sem uploads.",
      keywords: [
        "recortar pdf",
        "cortar margens pdf",
        "cortar pdf online",
        "tirar margem pdf",
        "recortar paginas pdf",
      ],
      ogTitle: "Recorte páginas PDF com privacidade | JayPDF",
      ogDescription:
        "Selecione as páginas, defina as margens e baixe um PDF mais limpo sem enviar arquivos para servidores.",
      ogImageAlt: "Recortando páginas PDF no JayPDF",
    },
    hero: {
      title: "Recorte páginas PDF e remova margens",
      description:
        "Elimine espaços em branco desnecessários de páginas específicas e baixe um documento mais enxuto em segundos.",
      bulletPoints: [
        "Selecione apenas as páginas que precisam de ajuste",
        "Controle margens superior, direita, inferior e esquerda com precisão",
        "Processamento 100% local com zero servidores",
      ],
      imageAlt: "Fluxo de recorte de PDF",
    },
    benefitsTitle: "Por que recortar PDFs com JayPDF",
    benefits: [
      {
        title: "Páginas mais limpas",
        description:
          "Reduza bordas vazias e destaque o conteúdo realmente importante.",
      },
      {
        title: "Edição seletiva",
        description:
          "Aplique o recorte somente nas páginas necessárias sem refazer o arquivo inteiro.",
      },
      {
        title: "Privacidade total",
        description:
          "Seus arquivos permanecem no dispositivo durante todo o processo.",
      },
    ],
    howTo: {
      title: "Como recortar páginas PDF com JayPDF",
      steps: [
        "Envie o PDF e escolha o arquivo que deseja ajustar.",
        "Marque as páginas e defina as margens superior, direita, inferior e esquerda.",
        "Clique em “Processar” para baixar um novo PDF com o recorte aplicado.",
      ],
      note:
        "Se grupos diferentes de páginas precisarem de cortes distintos, repita o processo separadamente.",
    },
    useCasesTitle: "Quando faz sentido recortar um PDF",
    useCases: [
      "Remover bordas de scanner em formulários, recibos ou documentos assinados.",
      "Reduzir margens antes de imprimir ou juntar arquivos.",
      "Padronizar páginas exportadas por ferramentas diferentes.",
      "Preparar relatórios, manuais ou materiais de estudo com enquadramento mais compacto.",
    ],
  },
  reorder: {
    key: "reorder",
    slug: "reordenar",
    mode: "reorder",
    meta: {
      title: "Reordenar PÃ¡ginas PDF | Mudar Ordem RÃ¡pido | JayPDF",
      description:
        "Reorganize facilmente as pÃ¡ginas do seu PDF arrastando e soltando. Corrija a ordem e salve o resultado instantaneamente, tudo localmente.",
      keywords: [
        "reordenar pdf",
        "mudar ordem paginas pdf",
        "organizar pdf",
        "rearranjar pdf",
        "ordenar paginas pdf",
      ],
      ogTitle: "Organize PDFs sem reinstalar software | JayPDF",
      ogDescription:
        "Mova as pÃ¡ginas para a posiÃ§Ã£o correta, corrija erros de ordenaÃ§Ã£o e baixe seu documento PDF perfeitamente organizado em apenas alguns momentos.",
      ogImageAlt: "ReordenaÃ§Ã£o de pÃ¡ginas no JayPDF",
    },
    hero: {
      title: "Reordenar pÃ¡ginas de um PDF com arrastar e soltar",
      description:
        "Corrija a sequÃªncia de notas fiscais escaneadas, apresentaÃ§Ãµes ou relatÃ³rios extensos em segundos.",
      bulletPoints: [
        "Miniaturas grandes ajudam a evitar erros",
        "Arraste as pÃ¡ginas e confirme a nova ordem rapidamente",
        "Exporte o PDF reorganizado sem perder marcadores ou links internos",
      ],
      imageAlt: "Interface de reordenaÃ§Ã£o de pÃ¡ginas",
    },
    benefitsTitle: "Por que reordenar com o JayPDF",
    benefits: [
      {
        title: "Fluxos mais Ã¡geis",
        description:
          "Corrija digitalizaÃ§Ãµes bagunÃ§adas sem redigitalizar ou instalar editores complexos.",
      },
      {
        title: "PrecisÃ£o visual",
        description:
          "As miniaturas permitem validar cada pÃ¡gina antes de exportar a nova sequÃªncia.",
      },
      {
        title: "Sem rastros",
        description:
          "Todo o processo fica no seu dispositivo â€” ideal para documentos sensÃ­veis ou confidenciais.",
      },
    ],
    howTo: {
      title: "Como reordenar pÃ¡ginas com o JayPDF",
      steps: [
        "Envie o PDF e escolha o arquivo que deseja editar.",
        "Arraste cada miniatura atÃ© alcanÃ§ar a ordem correta.",
        "Clique em â€œProcessarâ€ para baixar o documento com a nova sequÃªncia.",
      ],
      note:
        "Continue ajustando a ordem mesmo apÃ³s exportar, sem reenviar o arquivo.",
    },
    useCasesTitle: "Quando reorganizar um PDF",
    useCases: [
      "Alinhar propostas, anexos e assinaturas antes de enviar.",
      "Preparar apresentaÃ§Ãµes impressas com a sequÃªncia certa.",
      "Corrigir pÃ¡ginas duplicadas ou invertidas apÃ³s digitalizaÃ§Ãµes em lote.",
      "Atualizar manuais ou catÃ¡logos reaproveitando conteÃºdo existente sem diagramar do zero.",
    ],
  },
  pdfToImages: {
    key: "pdfToImages",
    slug: "pdf-para-imagens",
    mode: "pdfToImages",
    meta: {
      title: "Converter PDF em Imagens | Exportar PNG/JPEG | JayPDF",
      description:
        "Converta cada pÃ¡gina do seu PDF em imagens PNG ou JPEG de alta qualidade. Escolha sua resoluÃ§Ã£o e baixe como um arquivo ZIP â€” 100% privado e seguro.",
      keywords: [
        "pdf para imagens",
        "pdf para png",
        "pdf para jpeg",
        "exportar paginas pdf",
        "baixar pdf como imagem",
      ],
      ogTitle: "Exporte pÃ¡ginas de PDF como imagens nÃ­tidas | JayPDF",
      ogDescription:
        "Renderize cada pÃ¡gina como uma imagem nÃ­tida diretamente no seu navegador. Ajuste a qualidade, defina nomes e obtenha um arquivo ZIP organizado instantaneamente.",
      ogImageAlt: "JayPDF convertendo um PDF em imagens",
    },
    hero: {
      title: "Converter pÃ¡ginas PDF em PNG ou JPEG",
      description:
        "Gere imagens prontas para apresentaÃ§Ãµes, revisÃµes ou handoffs sem depender de editores pesados.",
      bulletPoints: [
        "Selecione PNG ou JPEG e controle o DPI de exportaÃ§Ã£o",
        "Baixe um Ãºnico ZIP ou uma imagem por pÃ¡gina",
        "Processamento 100% local no seu navegador â€” nada Ã© enviado",
      ],
      imageAlt: "Fluxo de PDF para imagens",
    },
    benefitsTitle: "Por que exportar PDFs com o JayPDF",
    benefits: [
      {
        title: "Qualidade pronta para apresentaÃ§Ãµes",
        description:
          "Escolha a resoluÃ§Ã£o ideal para slides, intranets ou fluxos de design sem perder nitidez.",
      },
      {
        title: "Downloads flexÃ­veis",
        description:
          "Mantenha um ZIP organizado para documentos longos ou baixe somente as pÃ¡ginas necessÃ¡rias.",
      },
      {
        title: "Privacidade garantida",
        description:
          "Todo o render acontece no navegador, ideal para documentos sigilosos ou sob NDA.",
      },
    ],
    howTo: {
      title: "Como converter um PDF em imagens",
      steps: [
        "Envie o PDF que deseja converter. Trabalhamos um arquivo por vez para preservar a qualidade.",
        "Escolha PNG ou JPEG, ajuste o DPI e defina se deseja agrupar tudo em um ZIP.",
        "Clique em â€œExportar imagensâ€ para baixar o arquivo comprimido ou as pÃ¡ginas individuais.",
      ],
      note:
        "Precisa apenas de algumas pÃ¡ginas? Extraia ou divida antes e depois exporte para imagens.",
    },
    useCasesTitle: "Quando a conversÃ£o PDFâ†’imagem ajuda",
    useCases: [
      "Compartilhar prÃ©vias de design sem enviar o PDF completo.",
      "Inserir pÃ¡ginas em CMS, apresentaÃ§Ãµes ou ferramentas que aceitam apenas imagens.",
      "Criar materiais para tablets ou e-readers que lidam melhor com PNG/JPEG.",
      "Documentar revisÃµes internas com capturas de cada pÃ¡gina.",
    ],
  },
  imagesToPdf: {
    key: "imagesToPdf",
    slug: "imagens-para-pdf",
    mode: "imagesToPdf",
    meta: {
      title: "Criar PDF de Imagens | JPG, PNG para PDF | JayPDF",
      description:
        "Crie um PDF profissional a partir de suas imagens. Organize fotos, personalize o layout e as margens, e gere seu documento localmente no seu navegador.",
      keywords: [
        "imagens para pdf",
        "jpg para pdf",
        "png para pdf",
        "webp para pdf",
        "criar pdf com fotos",
      ],
      ogTitle: "Monte um PDF impecÃ¡vel com suas imagens | JayPDF",
      ogDescription:
        "Arraste suas imagens para o lugar, defina as configuraÃ§Ãµes de layout e exporte um arquivo PDF pronto para impressÃ£o â€” sem uploads ou marcas d'Ã¡gua anexadas.",
      ogImageAlt: "CriaÃ§Ã£o de PDF a partir de imagens no JayPDF",
    },
    hero: {
      title: "Agrupe JPG ou PNG em um PDF profissional",
      description:
        "Junte digitalizaÃ§Ãµes, fotos ou grÃ¡ficos em um Ãºnico documento pronto para equipes, alunos ou clientes.",
      bulletPoints: [
        "Reordene as imagens com arrastar e soltar",
        "Defina tamanho de pÃ¡gina, orientaÃ§Ã£o e margens",
        "Escolha uma cor de fundo sÃ³lida para evitar transparÃªncias",
      ],
      imageAlt: "Fluxo de imagens para PDF",
    },
    benefitsTitle: "Vantagens de criar PDFs a partir de imagens",
    benefits: [
      {
        title: "Layout consistente",
        description:
          "Alinhe formatos diferentes em um PDF uniforme sem esticar ou cortar demais.",
      },
      {
        title: "Pronto para impressÃ£o e revisÃ£o",
        description:
          "Ajuste margens, orientaÃ§Ã£o e fundo para que o PDF fique perfeito no papel e na tela.",
      },
      {
        title: "Processamento seguro",
        description:
          "A conversÃ£o acontece inteiramente no navegador, ideal para recibos, identidades ou material educacional.",
      },
    ],
    howTo: {
      title: "Como converter imagens em PDF",
      steps: [
        "Adicione as imagens que deseja incluir e organize na ordem final.",
        "Ajuste o modo de encaixe, tamanho de pÃ¡gina, orientaÃ§Ã£o e margens.",
        "Clique em â€œCriar PDFâ€ para baixar o documento pronto para compartilhar ou arquivar.",
      ],
      note:
        "O PDF ficou pesado? Comprima ou divida depois sem reenviar as imagens.",
    },
    useCasesTitle: "Boas ideias para imagemâ†’PDF",
    useCases: [
      "Agrupar provas, tarefas ou atividades escaneadas antes de devolvÃª-las aos alunos.",
      "Reunir recibos e comprovantes em um Ãºnico PDF para prestaÃ§Ã£o de contas.",
      "Montar catÃ¡logos, portfolios ou lookbooks a partir de exportaÃ§Ãµes de design.",
      "Enviar relatórios fotográficos ou inspeções sem anexar dezenas de arquivos.",
    ],
  },
  repair: {
    key: "repair",
    slug: "reparar",
    mode: "repair",
    meta: {
      title: "Reparar PDF Online Grátis | Recuperar Arquivos Corrompidos | JayPDF",
      description:
        "Repare arquivos PDF danificados ou corrompidos diretamente no seu navegador. Reconstrua PDFs ilegíveis com segurança e privacidade.",
      keywords: [
        "reparar pdf",
        "recuperar pdf corrompido",
        "consertar pdf danificado",
        "reconstruir pdf",
      ],
      ogTitle: "Reparar e recuperar PDFs danificados online | JayPDF",
      ogDescription:
        "Conserte documentos PDF corrompidos ou ilegíveis diretamente no navegador com 100% de privacidade e sem envio de arquivos.",
      ogImageAlt: "Interface de reparo de PDF do JayPDF",
    },
    hero: {
      title: "Repare e reconstrua PDFs danificados localmente",
      description:
        "Recupere arquivos PDF corrompidos ou ilegíveis renderizando-os e reconstruindo-os em documentos limpos e válidos.",
      bulletPoints: [
        "100% privado e no navegador — seus arquivos nunca saem do seu dispositivo",
        "Recupera tabelas xref quebradas, fluxos corrompidos e páginas ilegíveis",
        "Gera PDFs limpos e compatíveis com todos os leitores e ferramentas",
      ],
      imageAlt: "Fluxo de reparo de PDF",
    },
    benefitsTitle: "Por que reparar PDFs com o JayPDF",
    benefits: [
      {
        title: "Recuperação profunda",
        description:
          "Utiliza mecanismos resilientes de renderização para analisar e recuperar páginas rejeitadas por outros leitores.",
      },
      {
        title: "Saída padrão",
        description:
          "Reconstrói as páginas recuperadas em um novo arquivo PDF totalmente em conformidade com os padrões.",
      },
      {
        title: "Privacidade total",
        description:
          "Todo o processamento acontece localmente no seu navegador sem envio a servidores.",
      },
    ],
    howTo: {
      title: "Como reparar um PDF com o JayPDF",
      steps: [
        "Envie o arquivo PDF danificado ou ilegível.",
        "Clique em “Processar” para iniciar a recuperação e reconstrução.",
        "Baixe o arquivo PDF reparado instantaneamente.",
      ],
      note:
        "Se o arquivo continuar ilegível, abri-lo em um visualizador e imprimi-lo para PDF usando uma impressora virtual também pode ajudar.",
    },
    useCasesTitle: "Quando usar o reparo de PDF",
    useCases: [
      "Corrigir PDFs danificados durante downloads interrompidos ou falhas de transferência.",
      "Recuperar documentos que não abrem ou falham ao juntar em outras ferramentas.",
      "Reconstruir PDFs malformados exportados por programas antigos.",
      "Tornar utilizáveis arquivos antes incompatíveis com fluxos de trabalho modernos.",
    ],
  },
};

export const operationsPt: Record<OperationKey, OperationContent> = {
  merge: operationsPtContent.merge,
  compress: operationsPtContent.compress,
  split: operationsPtContent.split,
  extract: operationsPtContent.extract,
  crop: operationsPtContent.crop,
  rotate: operationsPtContent.rotate,
  reorder: operationsPtContent.reorder,
  pdfToImages: operationsPtContent.pdfToImages,
  imagesToPdf: operationsPtContent.imagesToPdf,
  repair: operationsPtContent.repair,
};
