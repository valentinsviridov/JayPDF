import { OperationContent } from "../operation-types";
import { OperationKey } from "../../../types/operations";

const operationsFrContent: Record<OperationKey, OperationContent> = {
  compress: {
    key: "compress",
    slug: "compresser",
    mode: "compress",
    meta: {
      title: "Compresser un PDF en ligne gratuitement | Réduire la taille | JayPDF",
      description:
        "Réduisez efficacement la taille du fichier PDF sans perte de qualité. Compression gratuite et privée directement dans votre navigateur.",
      keywords: [
        "compresser pdf",
        "réduire taille pdf",
        "optimiser pdf",
        "compresseur pdf",
        "pdf léger",
      ],
      ogTitle: "Compresser des PDF sans perdre en qualité | JayPDF",
      ogDescription:
        "Déposez votre fichier, choisissez le niveau de compression optimal et téléchargez un PDF beaucoup plus petit en quelques secondes — en toute sécurité, sans téléchargement sur un serveur.",
      ogImageAlt: "Interface de l'outil de compression JayPDF",
    },
    hero: {
      title: "Compresser un PDF en ligne avec des résultats clairs",
      description:
        "Réduisez la taille du document pour respecter les limites des e-mails, des plateformes LMS ou des procédures publiques tout en gardant chaque page lisible.",
      bulletPoints: [
        "Traitement 100 % local — vos fichiers ne quittent jamais le navigateur",
        "Choisissez une compression basique, moyenne ou agressive selon vos objectifs",
        "Préservez les métadonnées et la structure du document lorsque vous en avez besoin",
      ],
      imageAlt: "Flux de travail de compression PDF dans JayPDF",
    },
    benefitsTitle: "Pourquoi compresser des PDF avec JayPDF",
    benefits: [
      {
        title: "Qualité équilibrée",
        description:
          "Notre moteur de compression évalue chaque ressource pour offrir la plus grande réduction sans brouiller le texte ou les graphiques.",
      },
      {
        title: "Prêt pour les soumissions",
        description:
          "Produisez des fichiers qui respectent les limites de téléchargement strictes dans les portails gouvernementaux, les universités ou les flux de travail d'entreprise.",
      },
      {
        title: "Confidentialité dès la conception",
        description:
          "Évitez les téléchargements sur serveur et les fuites de données afin de vous conformer aux politiques de confidentialité internes sans effort.",
      },
    ],
    howTo: {
      title: "Comment compresser un PDF avec JayPDF",
      steps: [
        "Cliquez sur « Télécharger vos fichiers » et choisissez le PDF que vous souhaitez optimiser.",
        "Choisissez le niveau de compression et ajustez les options avancées comme la conservation des métadonnées.",
        "Appuyez sur « Traiter » et téléchargez le document compressé en quelques secondes.",
      ],
      note:
        "Vous travaillez avec plusieurs rapports ? Compressez-les un par un sans limites quotidiennes ni filigranes.",
    },
    useCasesTitle: "Quand la compression est utile",
    useCases: [
      "Envoyez des contrats, des factures ou des manuels par e-mail sans atteindre les limites de pièces jointes.",
      "Téléchargez des travaux sur Moodle, Canvas ou tout autre LMS qui impose une limite stricte de taille de fichier.",
      "Réduisez la taille des thèses, des catalogues ou des documents de recherche pour améliorer la vitesse de téléchargement.",
      "Archivez des dossiers dans le cloud en économisant du stockage sans perdre de détails importants.",
    ],
  },
  imagesToPdf: {
    key: "imagesToPdf",
    slug: "creer-pdf-depuis-images",
    mode: "imagesToPdf",
    meta: {
      title: "Créer un PDF à partir d'images | JPG, PNG en PDF | JayPDF",
      description:
        "Créez un PDF professionnel à partir de vos images. Organisez les photos, personnalisez la mise en page et générez votre document localement dans votre navigateur.",
      keywords: [
        "images en pdf",
        "jpg en pdf",
        "png en pdf",
        "webp en pdf",
        "créer pdf depuis images",
      ],
      ogTitle: "Créez un PDF net à partir de vos images | JayPDF",
      ogDescription:
        "Faites glisser vos images à leur place, définissez les paramètres de mise en page et exportez un fichier PDF prêt à imprimer — sans téléchargement ni filigrane.",
      ogImageAlt: "Création d'un PDF à partir d'images dans JayPDF",
    },
    hero: {
      title: "Créer un PDF soigné à partir d'images",
      description:
        "Regroupez des numérisations, des photos ou des graphiques dans un seul PDF prêt à être partagé avec des équipes, des étudiants ou des clients.",
      bulletPoints: [
        "Faites glisser pour définir l'ordre de chaque page",
        "Choisissez la taille de page, l'orientation et les marges qui conviennent à l'impression ou à la révision à l'écran",
        "Définissez une couleur d'arrière-plan unie pour éviter une transparence inattendue",
      ],
      imageAlt: "Flux de travail des images en PDF",
    },
    benefitsTitle: "Pourquoi assembler des PDF à partir d'images avec JayPDF",
    benefits: [
      {
        title: "Mise en page cohérente",
        description:
          "Alignez des formats d'image mixtes dans un PDF unifié sans surprises d'étirement ou de recadrage.",
      },
      {
        title: "Prêt pour l'impression et la révision",
        description:
          "Ajustez les marges, l'orientation et la couleur d'arrière-plan pour que le PDF exporté soit beau sur papier et sur les écrans.",
      },
      {
        title: "Traitement sécurisé",
        description:
          "Toutes les conversions se font localement dans votre navigateur, ce qui est sûr pour les numérisations de cartes d'identité, de reçus ou de matériel scolaire.",
      },
    ],
    howTo: {
      title: "Comment convertir des images en PDF",
      steps: [
        "Ajoutez les images que vous souhaitez inclure. Réorganisez-les pour que la séquence corresponde à votre document final.",
        "Ajustez le mode d'ajustement, la taille de la page, l'orientation et les marges en fonction de vos besoins de sortie.",
        "Cliquez sur « Créer PDF » pour télécharger un document compilé prêt à être partagé ou archivé.",
      ],
      note:
        "De gros lots ? Compressez le PDF résultant ou divisez-le ensuite sans télécharger à nouveau vos images.",
    },
    useCasesTitle: "Excellentes utilisations des conversions d'image en PDF",
    useCases: [
      "Combinez des feuilles de calcul numérisées ou des copies d'examen avant de les renvoyer aux étudiants.",
      "Préparez les reçus de frais dans un seul PDF au lieu de dizaines de pièces jointes.",
      "Créez des lookbooks ou des catalogues à partir d'exportations de conception en quelques secondes.",
      "Regroupez des preuves photographiques ou des clichés d'inspection dans un seul document pour les parties prenantes.",
    ],
  },
  merge: {
    key: "merge",
    slug: "fusionner",
    mode: "merge",
    meta: {
      title: "Fusionner PDF | Combiner plusieurs PDF gratuitement | JayPDF",
      description:
        "Combinez plusieurs fichiers PDF en un seul document organisé sans limite de page. Glissez, réorganisez et téléchargez votre fichier fusionné instantanément.",
      keywords: [
        "fusionner pdf",
        "combiner pdf",
        "joindre fichiers pdf",
        "fusion de pdf",
        "fusionner documents",
      ],
      ogTitle: "Fusionnez plusieurs PDF en quelques secondes | JayPDF",
      ogDescription:
        "Organisez vos documents dans l'ordre parfait, ajustez les paramètres et téléchargez un fichier PDF unifié sans jamais télécharger vos données.",
      ogImageAlt: "Combinaison de plusieurs PDF dans JayPDF",
    },
    hero: {
      title: "Fusionner des PDF en ligne — rapide et sécurisé",
      description:
        "Créez un fichier soigné avec des contrats, des notes de cours ou des documents de politique prêts à être envoyés, signés ou archivés.",
      bulletPoints: [
        "Glissez et déposez pour contrôler l'ordre final",
        "Pas de limites cachées — fusionnez de longs documents gratuitement",
        "Conservez les signets et les métadonnées lorsque vous en avez besoin",
      ],
      imageAlt: "Fusion de documents PDF",
    },
    benefitsTitle: "Avantages de la fusion avec JayPDF",
    benefits: [
      {
        title: "Livraison cohérente",
        description:
          "Livrez du matériel dans un seul fichier avec des numéros de page continus et un formatage unifié.",
      },
      {
        title: "Gagnez du temps",
        description:
          "Évitez les éditeurs de bureau lourds. Faites glisser les fichiers, organisez-les et téléchargez un document prêt à être partagé.",
      },
      {
        title: "Privé et anonyme",
        description:
          "Nous ne stockons aucune copie et ne demandons pas de données personnelles, ce qui est parfait pour les informations confidentielles.",
      },
    ],
    howTo: {
      title: "Comment fusionner des PDF avec JayPDF",
      steps: [
        "Cliquez sur « Télécharger vos fichiers » et sélectionnez au moins deux PDF.",
        "Utilisez les flèches ou faites glisser chaque fichier pour définir la séquence finale.",
        "Choisissez vos préférences de signet et appuyez sur « Traiter » pour télécharger le PDF fusionné.",
      ],
      note:
        "Besoin d'ajouter plus de fichiers plus tard ? Déposez-les à tout moment sans recommencer.",
    },
    useCasesTitle: "Quand fusionner des PDF",
    useCases: [
      "Préparez un dossier avec des annexes, des devis et des conditions commerciales.",
      "Envoyez plusieurs factures mensuelles dans un seul fichier aux départements financiers.",
      "Regroupez les notes numérisées et les présentations dans un seul PDF pour les étudiants.",
      "Créez des packages juridiques complets prêts pour les signatures électroniques.",
    ],
  },
  split: {
    key: "split",
    slug: "diviser",
    mode: "split",
    meta: {
      title: "Diviser un PDF par pages ou chapitres | Outil gratuit | JayPDF",
      description:
        "Séparez votre PDF en plusieurs fichiers par plages de pages ou chapitres spécifiques. Profitez d'un contrôle total sur la structure de votre document.",
      keywords: [
        "diviser pdf",
        "séparer pdf",
        "diviser pdf par pages",
        "diviseur pdf",
        "couper pdf",
      ],
      ogTitle: "Divisez vos PDF avec précision | JayPDF",
      ogDescription:
        "Choisissez exactement comment diviser votre document, générez autant de fichiers individuels que nécessaire et téléchargez-les instantanément.",
      ogImageAlt: "Division d'un PDF dans JayPDF",
    },
    hero: {
      title: "Diviser des PDF par pages ou segments",
      description:
        "Extrayez des chapitres, des annexes ou des sections spécifiques dans des fichiers autonomes prêts à être partagés.",
      bulletPoints: [
        "Configurez les divisions par nombre de pages ou par taille de fichier",
        "Produisez plusieurs PDF en une seule étape de traitement",
        "Travaillez sans limites de pages ni filigranes",
      ],
      imageAlt: "Flux de travail de division de PDF",
    },
    benefitsTitle: "Ce que vous apporte la division avec JayPDF",
    benefits: [
      {
        title: "Contrôle des informations partagées",
        description:
          "Ne livrez que la partie pertinente d'un document sans exposer de sections sensibles.",
      },
      {
        title: "Livraison évolutive",
        description:
          "Générez plusieurs fichiers à la fois et téléchargez-les automatiquement pour l'archivage ou le transfert.",
      },
      {
        title: "Ajustements avancés",
        description:
          "Créez des lots, insérez des séparateurs ou définissez des formats de sortie qui correspondent à votre flux de travail.",
      },
    ],
    howTo: {
      title: "Comment diviser un PDF avec JayPDF",
      steps: [
        "Téléchargez le PDF que vous souhaitez segmenter à partir de votre appareil.",
        "Choisissez si vous souhaitez diviser par un nombre fixe de pages ou par taille de fichier.",
        "Appuyez sur « Traiter » et téléchargez automatiquement les documents nouvellement générés.",
      ],
      note:
        "JayPDF télécharge le premier fichier immédiatement et enregistre le reste sur votre appareil sans étapes supplémentaires.",
    },
    useCasesTitle: "Scénarios typiques pour diviser des PDF",
    useCases: [
      "Publiez chaque chapitre d'un livre numérique dans un cours en ligne.",
      "Séparez les annexes qui doivent être envoyées par différents canaux.",
      "Extrayez des résumés trimestriels à partir de rapports financiers volumineux.",
      "Préparez des lots compacts pour les clients sans exposer la documentation interne.",
    ],
  },
  extract: {
    key: "extract",
    slug: "extraire",
    mode: "extract",
    meta: {
      title: "Extraire des pages PDF | Sauvegarder pages sélectionnées | JayPDF",
      description:
        "Sélectionnez des pages spécifiques dans n'importe quel PDF et créez instantanément un nouveau document sur mesure. Traitement privé et illimité.",
      keywords: [
        "extraire pages pdf",
        "sauvegarder pages pdf",
        "sélectionner pages pdf",
        "extracteur de pages pdf",
        "créer nouveau pdf",
      ],
      ogTitle: "Extrayez uniquement les pages dont vous avez besoin | JayPDF",
      ogDescription:
        "Marquez les pages pertinentes que vous souhaitez conserver, générez un nouveau fichier PDF en quelques secondes et assurez la sécurité de vos données.",
      ogImageAlt: "Sélection de pages PDF dans JayPDF",
    },
    hero: {
      title: "Extraire des pages PDF spécifiques",
      description:
        "Assemblez des documents sur mesure en ne conservant que les pages dont vous avez besoin de partager ou d'archiver.",
      bulletPoints: [
        "Prévisualisez les vignettes et marquez les pages individuelles",
        "Conservez les numéros de page d'origine ou créez de nouvelles sections",
        "Téléchargez instantanément le PDF résultant sans attendre",
      ],
      imageAlt: "Extraction de pages d'un PDF",
    },
    benefitsTitle: "Avantages de l'extraction de pages avec JayPDF",
    benefits: [
      {
        title: "Documents plus pertinents",
        description:
          "Partagez uniquement des informations utiles avec votre équipe ou vos clients et évitez les données redondantes.",
      },
      {
        title: "Contrôle total dans le navigateur",
        description:
          "Sélectionnez, prévisualisez et vérifiez chaque page sans logiciel lourd ni connexions stables.",
      },
      {
        title: "Des résultats propres",
        description:
          "Le nouveau PDF conserve la qualité et les métadonnées en fonction des options que vous définissez.",
      },
    ],
    howTo: {
      title: "Comment extraire des pages avec JayPDF",
      steps: [
        "Téléchargez le PDF et choisissez le fichier avec lequel vous souhaitez travailler.",
        "Sélectionnez les pages dont vous avez besoin dans la grille de vignettes.",
        "Cliquez sur « Traiter » pour télécharger un PDF avec les pages sélectionnées.",
      ],
      note:
        "Vous pouvez combiner l'extraction avec d'autres opérations telles que la fusion ou la compression lors de sessions séparées.",
    },
    useCasesTitle: "Idées pour l'extraction de pages",
    useCases: [
      "Partagez le chapitre assigné d'un manuel avec votre équipe.",
      "Envoyez des pages de prêt hypothécaire ou de contrat spécifiques pour un examen juridique.",
      "Assemblez des dossiers personnalisés avec uniquement les informations pertinentes pour chaque client.",
      "Enregistrez des copies des pages de formulaire ou des reçus que vous devez archiver.",
    ],
  },
  crop: {
    key: "crop",
    slug: "recadrer",
    mode: "crop",
    meta: {
      title: "Recadrer des pages PDF | Ajuster marges | JayPDF",
      description:
        "Recadrez des pages PDF et réduisez les marges excédentaires directement dans votre navigateur. Sélectionnez les pages, définissez la zone de recadrage.",
      keywords: [
        "recadrer pdf",
        "recadrer pdf en ligne",
        "ajuster marges pdf",
        "couper pages pdf",
        "outil de recadrage pdf",
        "recadrer pdf gratuit",
        "supprimer espace blanc pdf",
      ],
      ogTitle: "Recadrez des pages PDF localement dans votre navigateur | JayPDF",
      ogDescription:
        "Réduisez les marges blanches et concentrez chaque page sur le contenu dont vous avez besoin, avec un traitement privé sur votre appareil.",
      ogImageAlt: "Recadrage de pages PDF dans JayPDF",
    },
    hero: {
      title: "Recadrer les pages PDF et réduire les marges",
      description:
        "Supprimez l'espace blanc supplémentaire ou resserrez la zone visible des pages sélectionnées sans envoyer le document nulle part.",
      bulletPoints: [
        "Sélectionnez uniquement les pages que vous souhaitez recadrer",
        "Réduisez les marges supérieure, droite, inférieure et gauche avec des valeurs de points précises",
        "Gardez le flux de travail entièrement local avec un traitement sans serveur",
      ],
      imageAlt: "Flux de travail de recadrage PDF",
    },
    benefitsTitle: "Pourquoi recadrer des PDF avec JayPDF",
    benefits: [
      {
        title: "Pages plus propres",
        description:
          "Réduisez les bordures blanches distrayantes et concentrez chaque page sur le contenu important.",
      },
      {
        title: "Édition sélective",
        description:
          "Ne recadrez que les pages qui nécessitent un ajustement au lieu de reconstruire l'ensemble du document.",
      },
      {
        title: "Privé par défaut",
        description:
          "Chaque recadrage s'exécute dans votre navigateur, ce qui est plus sûr pour les factures, les numérisations et les rapports internes.",
      },
    ],
    howTo: {
      title: "Comment recadrer des pages PDF avec JayPDF",
      steps: [
        "Téléchargez le PDF et choisissez le fichier dont vous souhaitez recadrer les pages.",
        "Sélectionnez les pages à modifier et définissez les marges de recadrage.",
        "Cliquez sur Traiter pour télécharger un nouveau PDF avec les limites de page mises à jour.",
      ],
      note:
        "Si différents groupes de pages nécessitent des recadrages différents, exécutez l'étape de recadrage plusieurs fois.",
    },
    useCasesTitle: "Quand le recadrage d'un PDF aide",
    useCases: [
      "Coupez les bordures du scanner des formulaires, des reçus ou des documents signés.",
      "Supprimez les marges blanches supplémentaires avant l'impression ou la combinaison de fichiers.",
      "Standardisez les pages exportées de différents outils avec des bordures incohérentes.",
      "Préparez des cadres de page plus serrés avant de partager des manuels, des rapports ou du matériel d'étude.",
    ],
  },
  rotate: {
    key: "rotate",
    slug: "faire-pivoter",
    mode: "rotate",
    meta: {
      title: "Faire pivoter des pages PDF | Tourner les pages | JayPDF",
      description:
        "Faites pivoter les pages PDF sélectionnées de 90 ou 180 degrés directement dans votre navigateur. Privé, gratuit et entièrement local.",
      keywords: [
        "faire pivoter pdf",
        "tourner pages pdf",
        "rotation pdf",
        "corriger pdf de côté",
        "pivoter page pdf",
      ],
      ogTitle: "Faites pivoter des pages PDF en quelques secondes | JayPDF",
      ogDescription:
        "Sélectionnez les pages qui ont besoin d'une nouvelle orientation, choisissez 90 ou 180 degrés, et téléchargez le PDF corrigé sans rien télécharger.",
      ogImageAlt: "Rotation de pages PDF dans JayPDF",
    },
    hero: {
      title: "Faire pivoter des pages PDF sans perte de qualité",
      description:
        "Corrigez les numérisations de côté, les exportations à l'envers ou les orientations de page mixtes en quelques clics.",
      bulletPoints: [
        "Faites pivoter uniquement les pages que vous sélectionnez",
        "Choisissez 90 degrés à droite, 180 degrés ou 90 degrés à gauche",
        "Gardez tout dans votre navigateur sans téléchargements ni salles d'attente",
      ],
      imageAlt: "Flux de travail de rotation de page PDF",
    },
    benefitsTitle: "Pourquoi faire pivoter des pages avec JayPDF",
    benefits: [
      {
        title: "Corrections précises",
        description:
          "Ajustez uniquement les pages qui ont besoin d'aide, ce qui est parfait pour les lots de numérisation mixtes.",
      },
      {
        title: "Nettoyage rapide",
        description:
          "Corrigez l'orientation de la page en quelques secondes sans rouvrir le fichier dans un éditeur lourd.",
      },
      {
        title: "Privé par défaut",
        description:
          "Les documents sensibles restent sur votre appareil car chaque rotation s'exécute localement.",
      },
    ],
    howTo: {
      title: "Comment faire pivoter des pages PDF",
      steps: [
        "Téléchargez le PDF et choisissez le fichier dont vous souhaitez corriger les pages.",
        "Sélectionnez les pages à faire pivoter et choisissez 90 degrés à droite, 180 degrés ou 90 degrés à gauche.",
        "Cliquez sur Traiter pour télécharger un nouveau PDF avec l'orientation mise à jour.",
      ],
      note:
        "Besoin de plus de nettoyage ensuite ? Vous pouvez toujours réorganiser, extraire ou compresser le PDF corrigé.",
    },
    useCasesTitle: "Quand la rotation de la page aide",
    useCases: [
      "Corrigez les contrats ou formulaires numérisés qui ont été capturés de côté.",
      "Retournez les pages à l'envers dans les rapports assemblés à partir de différentes sources.",
      "Corrigez les notes de cours ou les manuels avant de les partager avec les étudiants.",
      "Nettoyez les PDF d'archives pour que chaque page soit confortable à lire à l'écran.",
    ],
  },
  reorder: {
    key: "reorder",
    slug: "reorganiser",
    mode: "reorder",
    meta: {
      title: "Réorganiser les pages PDF | Changer l'ordre | JayPDF",
      description:
        "Réorganisez facilement vos pages PDF avec une simple interface glisser-déposer. Corrigez l'ordre des documents et enregistrez instantanément.",
      keywords: [
        "réorganiser pdf",
        "changer ordre page pdf",
        "organiser pdf",
        "trier pages pdf",
      ],
      ogTitle: "Organisez des pages PDF sans réinstaller de logiciel | JayPDF",
      ogDescription:
        "Déplacez les pages à leur place, corrigez les erreurs de tri et téléchargez votre document PDF parfaitement organisé.",
      ogImageAlt: "Réorganisation de pages PDF",
    },
    hero: {
      title: "Réorganiser les pages PDF avec le glisser-déposer",
      description:
        "Corrigez la séquence des factures numérisées, des présentations ou des longs rapports en quelques secondes.",
      bulletPoints: [
        "Les grandes vignettes vous aident à éviter les erreurs",
        "Faites glisser les pages et confirmez le nouvel ordre instantanément",
        "Exportez le PDF réorganisé sans perdre les signets ou les liens internes",
      ],
      imageAlt: "Interface de commande de page",
    },
    benefitsTitle: "Pourquoi réorganiser avec JayPDF",
    benefits: [
      {
        title: "Flux de travail plus rapides",
        description:
          "Corrigez les numérisations désordonnées sans renumériser ni installer d'éditeurs complexes.",
      },
      {
        title: "Précision visuelle",
        description:
          "Les vignettes vous permettent de valider chaque page avant d'exporter la nouvelle séquence.",
      },
      {
        title: "Aucune trace",
        description:
          "Tout se passe sur votre appareil, ce qui est idéal pour les documents sensibles.",
      },
    ],
    howTo: {
      title: "Comment réorganiser les pages avec JayPDF",
      steps: [
        "Téléchargez le PDF et choisissez le fichier que vous souhaitez modifier.",
        "Faites glisser chaque vignette jusqu'à ce que l'ordre soit correct.",
        "Appuyez sur « Traiter » pour télécharger le document avec sa nouvelle séquence.",
      ],
      note:
        "Continuez à ajuster l'ordre même après une exportation sans télécharger à nouveau le fichier.",
    },
    useCasesTitle: "Quand réorganiser un PDF",
    useCases: [
      "Alignez les devis, les annexes et les signatures avant l'envoi.",
      "Préparez des présentations imprimées avec la bonne séquence.",
      "Corrigez les pages en double ou inversées après un grand lot de numérisation.",
      "Actualisez les manuels en réutilisant le contenu existant sans tout reconcevoir.",
    ],
  },
  pdfToImages: {
    key: "pdfToImages",
    slug: "pdf-en-images",
    mode: "pdfToImages",
    meta: {
      title: "Convertir des PDF en images | Exportation PNG ou JPEG | JayPDF",
      description:
        "Convertissez chaque page de votre PDF en images PNG ou JPEG de haute qualité. Choisissez votre résolution et téléchargez sous forme de ZIP.",
      keywords: [
        "pdf en images",
        "exporter pages pdf",
        "pdf en png",
        "pdf en jpeg",
        "télécharger pdf comme images",
      ],
      ogTitle: "Exportez des pages PDF sous forme d'images nettes | JayPDF",
      ogDescription:
        "Rendez chaque page sous forme d'image nette directement dans votre navigateur. Ajustez la qualité et obtenez instantanément une archive ZIP.",
      ogImageAlt: "JayPDF exportant des pages PDF en images",
    },
    hero: {
      title: "Convertir des pages PDF en PNG ou JPEG",
      description:
        "Produisez des images nettes de chaque page pour des diaporamas, des révisions ou des transferts de conception.",
      bulletPoints: [
        "Sélectionnez PNG ou JPEG et contrôlez le DPI d'exportation",
        "Regroupez tout dans un seul ZIP ou téléchargez page par page",
        "Rendu local uniquement — pas de téléchargements, pas de traces",
      ],
      imageAlt: "Flux de travail de PDF vers des images",
    },
    benefitsTitle: "Pourquoi exporter des PDF avec JayPDF",
    benefits: [
      {
        title: "Qualité prête pour la présentation",
        description:
          "Choisissez la résolution qui correspond à vos diapositives sans deviner si les pages seront assez nettes.",
      },
      {
        title: "Téléchargements flexibles",
        description:
          "Conservez un ZIP bien ordonné pour les documents longs ou déclenchez des téléchargements individuels.",
      },
      {
        title: "Privé dès la conception",
        description:
          "Le rendu s'effectue dans votre navigateur, de sorte que les documents confidentiels n'atteignent jamais de serveurs tiers.",
      },
    ],
    howTo: {
      title: "Comment convertir un PDF en images",
      steps: [
        "Téléchargez le PDF que vous souhaitez convertir.",
        "Choisissez PNG ou JPEG, ajustez le DPI et décidez s'il faut regrouper les résultats dans un ZIP.",
        "Cliquez sur « Exporter images » pour télécharger l'archive.",
      ],
      note:
        "Besoin de quelques pages seulement ? Divisez ou extrayez d'abord, puis exportez en images.",
    },
    useCasesTitle: "Quand une conversion de PDF en image aide",
    useCases: [
      "Partagez des aperçus statiques des approbations de conception.",
      "Intégrez des pages PDF uniques dans des plates-formes CMS ou des diaporamas.",
      "Créez des documents d'images pour tablettes ou liseuses qui ont du mal avec de gros PDF.",
      "Documentez des flux de travail de révision qui nécessitent des captures d'écran.",
    ],
  },
  repair: {
    key: "repair",
    slug: "reparer",
    mode: "repair",
    meta: {
      title: "Réparer un PDF en ligne gratuitement | Récupérer fichiers corrompus | JayPDF",
      description:
        "Réparez les fichiers PDF endommagés ou corrompus directement dans votre navigateur. Reconstruisez les PDF illisibles localement.",
      keywords: [
        "réparer pdf",
        "réparer pdf corrompu",
        "récupérer pdf endommagé",
        "réparation pdf gratuit",
      ],
      ogTitle: "Réparer et récupérer des PDF endommagés en ligne | JayPDF",
      ogDescription:
        "Réparez les PDF illisibles directement dans votre navigateur avec 100% de confidentialité et sans téléversement.",
      ogImageAlt: "Outil de réparation PDF JayPDF",
    },
    hero: {
      title: "Réparez et reconstruisez vos PDF endommagés localement",
      description:
        "Récupérez des fichiers PDF corrompus ou illisibles en les reconstruisant sous forme de documents propres et valides.",
      bulletPoints: [
        "100 % local et privé — vos fichiers ne quittent jamais votre appareil",
        "Répare les tables xref cassées, les flux corrompus et les pages illisibles",
        "Génère des PDF conformes aux standards compatibles avec tous les lecteurs",
      ],
      imageAlt: "Flux de réparation de PDF",
    },
    benefitsTitle: "Pourquoi réparer vos PDF avec JayPDF",
    benefits: [
      {
        title: "Récupération avancée",
        description:
          "Utilise des moteurs de rendu résilients pour analyser et récupérer les pages de documents rejetés par les autres outils.",
      },
      {
        title: "Sortie standard",
        description:
          "Reconstruit les pages récupérées dans un nouveau fichier PDF entièrement valide et propre.",
      },
      {
        title: "Confidentialité absolue",
        description:
          "Toutes les opérations s'exécutent localement dans votre navigateur sans transfert vers un serveur.",
      },
    ],
    howTo: {
      title: "Comment réparer un PDF avec JayPDF",
      steps: [
        "Téléversez le fichier PDF endommagé ou illisible.",
        "Cliquez sur « Traiter » pour lancer la réparation et reconstruction.",
        "Téléchargez immédiatement votre fichier PDF réparé.",
      ],
      note:
        "Si un fichier reste illisible, l'ouvrir dans un lecteur et l'imprimer en PDF via une imprimante virtuelle peut également aider.",
    },
    useCasesTitle: "Quand utiliser la réparation de PDF",
    useCases: [
      "Réparer des PDF corrompus lors de téléchargements ou transferts interrompus.",
      "Récupérer des documents impossibles à ouvrir ou fusionner avec d'autres outils.",
      "Reconstruire des PDF malformés exportés par des logiciels obsolètes.",
      "Rendre compatibles des fichiers auparavant inutilisables.",
    ],
  },
};

export const operationsFr: Record<OperationKey, OperationContent> = {
  merge: operationsFrContent.merge,
  compress: operationsFrContent.compress,
  split: operationsFrContent.split,
  extract: operationsFrContent.extract,
  crop: operationsFrContent.crop,
  rotate: operationsFrContent.rotate,
  reorder: operationsFrContent.reorder,
  pdfToImages: operationsFrContent.pdfToImages,
  imagesToPdf: operationsFrContent.imagesToPdf,
  repair: operationsFrContent.repair,
};
