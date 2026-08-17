export const faqsIt = {
  common: [
    {
      question: "Come funziona JayPDF senza caricare i miei documenti sui server?",
      answer:
        "JayPDF funziona interamente nel tuo browser con un motore di elaborazione locale. Nessun file viene caricato sui nostri server, il che garantisce totale privacy ed elaborazione rapida.",
    },
    {
      question: "JayPDF è sicuro per documenti riservati?",
      answer:
        "Assolutamente si. Tutto rimane sul tuo dispositivo, quindi i tuoi PDF non escono mai dal tuo controllo — nemmeno noi possiamo accedere al loro contenuto.",
    },
    {
      question: "Esiste un limite alla dimensione o al numero di PDF che posso elaborare?",
      answer:
        "Il limite principale è la memoria del tuo dispositivo. Nella maggior parte dei casi JayPDF gestisce file fino a circa 50MB ciascuno, anche se può variare a seconda dell'hardware e del browser.",
    },
    {
      question: "JayPDF funziona sui dispositivi mobili?",
      answer:
        "Sì. JayPDF è ottimizzato per desktop, tablet e telefoni. L'interfaccia si adatta a qualsiasi dimensione dello schermo.",
    },
    {
      question: "Perché il progetto si chiama JayPDF?",
      answer:
        "Il progetto prende il nome da Jay, un gatto Maine Coon il cui nome coincide anche con il termine inglese che indica la ghiandaia («jay», come la ghiandaia azzurra / Blue Jay). Questo doppio significato ha ispirato sia il nome del toolkit sia la sua identità visiva nei toni della ghiandaia azzurra.",
    },
  ],
  regional: [
    {
      question: "JayPDF mi aiuta a rispettare le normative sulla protezione dei dati?",
      answer:
        "Poiché l'elaborazione avviene localmente, nessun dato personale lascia la tua organizzazione. Questo rende più facile rispettare GDPR, HIPAA, LGPD o qualsiasi politica interna sulla privacy.",
    },
    {
      question: "Posso usare JayPDF per moduli ufficiali o fatture?",
      answer:
        "Sì. È ideale per ottimizzare fatture, contratti e documentazione della pubblica amministrazione mantenendo la qualità originale.",
    },
    {
      question: "La compressione influenzerà la validità legale dei miei documenti?",
      answer:
        "Il compressore JayPDF preserva l'integrità del documento. Tuttavia, consigliamo di verificare che il file risultante soddisfi i requisiti specifici dell'ente destinatario quando è importante.",
    },
  ],
  tech: [
    {
      question: "Quali tecnologie alimentano JayPDF?",
      answer:
        "JayPDF è sviluppato con tecnologie web moderne che operano al 100% lato client nel browser: pdf-lib per la modifica, unione, divisione e gestione delle pagine PDF; Mozilla PDF.js per il rendering rapido, le miniature e l'analisi dei documenti; JSZip per l'archivio delle immagini esportate; Web Workers per elaborazioni in background senza bloccare la pagina; e Next.js / React con TypeScript per l'interfaccia utente.",
    },
    {
      question: "Gli elementi interattivi vengono persi quando comprimo un PDF?",
      answer:
        "Nella maggior parte dei casi JayPDF mantiene link, moduli e segnalibri. Con una compressione molto aggressiva alcune funzionalità avanzate potrebbero essere alterate, quindi consigliamo di verificare.",
    },
    {
      question: "Quali browser sono compatibili con JayPDF?",
      answer:
        "JayPDF funziona con browser moderni come Chrome, Firefox, Safari, Edge e Opera. Tutto ciò che serve è un browser aggiornato con supporto ES2020 — nessun runtime aggiuntivo richiesto.",
    },
    {
      question: "Posso convertire un PDF in altri formati?",
      answer:
        "Attualmente puoi convertire i PDF in immagini (PNG o JPEG) e creare PDF da JPG, PNG o WEBP senza caricare file. Per altri formati più specifici, continua a usare un convertitore dedicato mentre continuiamo ad ampliare gli strumenti.",
    },
  ],
};