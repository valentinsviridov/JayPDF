export const faqsFr = {
  common: [
    {
      question: "Comment fonctionne JayPDF sans télécharger mes documents sur des serveurs ?",
      answer:
        "JayPDF fonctionne entièrement dans votre navigateur avec un moteur de traitement sur l'appareil. Aucun fichier n'est téléchargé sur nos serveurs, ce qui garantit une confidentialité totale et un traitement rapide.",
    },
    {
      question: "JayPDF est-il sûr pour les documents confidentiels ?",
      answer:
        "Absolument. Tout reste sur votre appareil, de sorte que vos PDF ne quittent jamais votre contrôle — nous ne pouvons même pas accéder à leur contenu.",
    },
    {
      question: "Y a-t-il une limite à la taille ou au nombre de PDF que je peux traiter ?",
      answer:
        "La principale limite est la mémoire de votre appareil. Dans la plupart des cas, JayPDF traite des fichiers allant jusqu'à 50 Mo chacun, bien que cela puisse varier en fonction de votre matériel et de votre navigateur.",
    },
    {
      question: "JayPDF fonctionne-t-il sur les appareils mobiles ?",
      answer:
        "Oui. JayPDF est optimisé pour les ordinateurs de bureau, les tablettes et les téléphones. L'interface s'adapte à toutes les tailles d'écran.",
    },
    {
      question: "Pourquoi le projet s'appelle-t-il JayPDF ?",
      answer:
        "Le projet porte le nom de Jay, un chat Maine Coon dont le nom correspond également au mot anglais désignant l'oiseau geai (« jay », comme le geai bleu / Blue Jay). Ce double sens a inspiré à la fois le nom de l'outil et son identité visuelle aux couleurs du geai bleu.",
    },
  ],
  regional: [
    {
      question: "JayPDF m'aide-t-il à respecter les règles de protection des données ?",
      answer:
        "Parce que le traitement se fait localement, aucune donnée personnelle ne quitte votre organisation. Cela facilite le respect du RGPD, du HIPAA, du LGPD ou de toute politique de confidentialité interne.",
    },
    {
      question: "Puis-je utiliser JayPDF pour des formulaires officiels ou des factures ?",
      answer:
        "Oui. Il est idéal pour optimiser les factures, les contrats et les documents de l'administration publique tout en conservant la qualité d'origine.",
    },
    {
      question: "La compression affectera-t-elle la validité légale de mes documents ?",
      answer:
        "Le compresseur JayPDF préserve l'intégrité du document. Même ainsi, nous vous recommandons de confirmer que le fichier résultant répond aux exigences spécifiques de l'entité réceptrice lorsque les enjeux sont élevés.",
    },
  ],
  tech: [
    {
      question: "Quelles technologies propulsent JayPDF ?",
      answer:
        "JayPDF repose sur des technologies web modernes s'exécutant à 100 % côté client dans votre navigateur : pdf-lib pour la manipulation, la fusion, le découpage et l'édition de pages PDF ; Mozilla PDF.js pour le rendu rapide, les miniatures et l'analyse de documents ; JSZip pour l'archivage des images exportées ; Web Workers pour un traitement en arrière-plan fluide sans figer le navigateur ; et Next.js / React avec TypeScript pour l'interface utilisateur.",
    },
    {
      question: "Les éléments interactifs sont-ils perdus lorsque je compresse un PDF ?",
      answer:
        "Dans la plupart des cas, JayPDF conserve les liens, les formulaires et les signets. Avec une compression très agressive, certaines fonctionnalités avancées peuvent être modifiées, nous vous recommandons donc de vérifier.",
    },
    {
      question: "Quels navigateurs sont compatibles avec JayPDF ?",
      answer:
        "JayPDF fonctionne avec les navigateurs modernes tels que Chrome, Firefox, Safari, Edge et Opera. Tout ce dont vous avez besoin est un navigateur à jour prenant en charge ES2020 — aucun runtime supplémentaire n'est requis.",
    },
    {
      question: "Puis-je convertir un PDF vers d'autres formats ?",
      answer:
        "Actuellement, vous pouvez convertir des PDF en images (PNG ou JPEG) et créer des PDF à partir de JPG, PNG ou WEBP sans télécharger de fichiers. Pour d'autres formats de niche, continuez à utiliser un convertisseur dédié pendant que nous continuons à développer la boîte à outils.",
    },
  ],
};
