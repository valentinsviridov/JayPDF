export const commonFaqs = [
  {
    question: "¿Cómo funciona JayPDF sin subir mis documentos a servidores?",
    answer: "JayPDF procesa todos tus PDFs directamente en tu navegador con un motor local optimizado. Ningún archivo se sube a nuestros servidores, garantizando privacidad total y rapidez en el procesamiento."
  },
  {
    question: "¿Es seguro usar JayPDF con documentos confidenciales?",
    answer: "Sí, es completamente seguro ya que todos tus documentos se procesan localmente en tu dispositivo y nunca salen de él. Ni siquiera nosotros podemos ver el contenido de tus PDFs."
  },
  {
    question: "¿Hay algún límite en el tamaño o número de PDFs que puedo procesar?",
    answer: "El límite principal es la memoria de tu dispositivo. En general, JayPDF puede manejar archivos de hasta 50MB por documento, pero esto puede variar según tu dispositivo y navegador."
  },
  {
    question: "¿JayPDF funciona en dispositivos móviles?",
    answer: "Sí, JayPDF está optimizado tanto para ordenadores como para dispositivos móviles. La interfaz se adapta a cualquier tamaño de pantalla."
  },
  {
    question: "¿De dónde viene el nombre JayPDF?",
    answer: "El proyecto lleva el nombre de Jay, un gato Maine Coon cuyo nombre coincide además con la palabra en inglés para el arrendajo («jay», como el arrendajo azul / Blue Jay). Este doble sentido inspiró tanto el nombre de la herramienta como su identidad visual con los colores del arrendajo azul."
  }
];

export const spainFaqs = [
  {
    question: "¿JayPDF cumple con el RGPD europeo?",
    answer: "Sí, al procesar todos los documentos localmente en tu navegador, JayPDF garantiza el cumplimiento del RGPD ya que no almacenamos ni tratamos tus PDFs en servidores externos."
  },
  {
    question: "¿Puedo usar JayPDF para documentos oficiales o facturas?",
    answer: "Sí, JayPDF es ideal para optimizar cualquier tipo de documento, incluyendo facturas, contratos y documentos oficiales. La calidad se mantiene mientras se reduce el tamaño."
  },
  {
    question: "¿Cómo afecta la compresión a la validez legal de un documento?",
    answer: "La compresión de JayPDF está diseñada para mantener la integridad del documento. No obstante, para documentos legales importantes, recomendamos verificar que el resultado sigue cumpliendo los requisitos específicos de la entidad receptora."
  }
];

export const latamFaqs = [
  {
    question: "¿Es posible usar JayPDF con conexiones de Internet lentas?",
    answer: "Sí, JayPDF es ideal para conexiones lentas ya que una vez cargada la página, todas las operaciones se realizan localmente sin necesidad de subir o descargar datos adicionales durante el procesamiento."
  },
  {
    question: "¿JayPDF funciona con documentos generados por aplicaciones gubernamentales?",
    answer: "Sí, JayPDF es compatible con PDFs generados por cualquier aplicación, incluyendo formularios y documentos oficiales de entidades gubernamentales."
  },
  {
    question: "¿Puedo confiar en JayPDF para documentos de mi negocio?",
    answer: "Absolutamente. JayPDF está diseñado con la privacidad y seguridad como prioridades, haciéndolo ideal para documentos empresariales sensibles como contratos, facturas y reportes."
  }
];

export const techFaqs = [
  {
    question: "¿Qué tecnologías utiliza JayPDF para procesar los PDFs?",
    answer: "JayPDF está construido con tecnologías web modernas que se ejecutan 100% en el cliente: pdf-lib para la manipulación, unión, división y edición de páginas de PDFs; Mozilla PDF.js para el renderizado rápido, miniaturas y lectura de documentos; JSZip para empaquetar exportaciones de imágenes; Web Workers para procesamiento en segundo plano sin congelar el navegador; y Next.js / React con TypeScript para la interfaz."
  },
  {
    question: "¿Se pierden las características interactivas del PDF al comprimirlo?",
    answer: "En la mayoría de los casos, JayPDF preserva características como enlaces, formularios y marcadores. Sin embargo, con niveles de compresión muy altos, algunas características avanzadas podrían verse afectadas."
  },
  {
    question: "¿Qué navegadores son compatibles con JayPDF?",
    answer: "JayPDF es compatible con la mayoría de navegadores modernos como Chrome, Firefox, Safari, Edge y Opera. Solo necesitas un navegador actualizado con soporte para JavaScript moderno (ES2020), sin requisitos adicionales."
  },
  {
    question: "¿Cómo puedo convertir un PDF a otros formatos?",
    answer: "Actualmente nos enfocamos en convertir PDFs a imágenes (PNG o JPEG) y en crear PDFs a partir de imágenes. Para otros formatos especializados, recomendamos usar un conversor dedicado mientras seguimos ampliando el kit."
  }
];

export const defaultFaqs = [...commonFaqs, ...spainFaqs, ...techFaqs];
