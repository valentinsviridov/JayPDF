export const faqsPt = {
  common: [
    {
      question: "Como o JayPDF funciona sem enviar meus documentos para servidores?",
      answer:
        "O JayPDF processa cada PDF diretamente no navegador com um motor local otimizado. Nenhum arquivo é enviado aos nossos servidores, garantindo privacidade total e rapidez.",
    },
    {
      question: "É seguro usar o JayPDF com documentos confidenciais?",
      answer:
        "Sim. Todo o processamento acontece no seu dispositivo, então os PDFs nunca saem do seu controle — nem nós temos acesso ao conteúdo.",
    },
    {
      question: "Existe limite de tamanho ou quantidade de PDFs que posso processar?",
      answer:
        "O principal limite é a memória do dispositivo. Geralmente o JayPDF lida com arquivos de até cerca de 50 MB, mas isso pode variar conforme o navegador e o hardware.",
    },
    {
      question: "O JayPDF funciona em dispositivos móveis?",
      answer:
        "Funciona sim. O JayPDF é otimizado para desktop, tablet e celular, adaptando-se a qualquer tamanho de tela.",
    },
    {
      question: "Por que o projeto se chama JayPDF?",
      answer:
        "O projeto tem o nome de Jay, um gato Maine Coon cujo nome também coincide com a palavra em inglês para a ave gaio («jay», como o gaio-azul / Blue Jay). Esse duplo sentido inspirou tanto o nome da ferramenta quanto a sua identidade visual com as cores do gaio-azul.",
    },
  ],
  regional: [
    {
      question: "O JayPDF ajuda a cumprir normas de privacidade como LGPD ou GDPR?",
      answer:
        "Como tudo ocorre localmente, nenhum dado pessoal é enviado para terceiros. Isso facilita cumprir LGPD, GDPR, HIPAA ou políticas internas de privacidade.",
    },
    {
      question: "Posso usar o JayPDF para notas fiscais ou formulários oficiais?",
      answer:
        "Sim. Ele é ideal para otimizar notas fiscais, contratos e documentos de órgãos públicos mantendo a qualidade original.",
    },
    {
      question: "A compressão altera a validade jurídica do documento?",
      answer:
        "A compressão do JayPDF preserva a integridade do arquivo. Ainda assim, recomendamos verificar se o resultado atende aos requisitos específicos do órgão ou cliente quando for algo crítico.",
    },
  ],
  tech: [
    {
      question: "Quais tecnologias alimentam o JayPDF?",
      answer:
        "O JayPDF é desenvolvido com tecnologias web modernas executadas 100% no cliente: pdf-lib para manipulação, junção, divisão e edição de páginas PDF; Mozilla PDF.js para renderização rápida, miniaturas e leitura de documentos; JSZip para arquivamento de imagens exportadas; Web Workers para processamento em segundo plano sem travar o navegador; e Next.js / React com TypeScript para a interface.",
    },
    {
      question: "Recursos interativos do PDF se perdem ao comprimir?",
      answer:
        "Na maioria dos casos mantemos links, formulários e marcadores. Em compressões muito agressivas, algum recurso avançado pode sofrer alterações, então vale conferir o resultado.",
    },
    {
      question: "Quais navegadores são compatíveis?",
      answer:
        "Chrome, Firefox, Safari, Edge e Opera — qualquer navegador moderno com suporte a ES2020. Não exigimos ambientes adicionais.",
    },
    {
      question: "Consigo converter PDF para outros formatos?",
      answer:
        "Hoje você pode converter PDFs em imagens (PNG ou JPEG) e criar PDFs a partir de JPG, PNG ou WEBP sem enviar arquivos. Para outros formatos específicos, continue usando um conversor dedicado enquanto ampliamos o kit.",
    },
  ],
};
