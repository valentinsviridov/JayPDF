import { OperationContent } from "../operation-types";
import { OperationKey } from "../../../types/operations";

const operationsRoContent: Record<OperationKey, OperationContent> = {
  compress: {
    key: "compress",
    slug: "comprima",
    mode: "compress",
    meta: {
      title: "Comprimă PDF online gratuit | Redu dimensiunea | PDFLince | Compress PDF",
      description:
        "Redu eficient dimensiunea fișierului PDF fără pierderi de calitate. Compresie gratuită și privată direct în browserul tău.",
      keywords: [
        "comprimare pdf",
        "redu dimensiune pdf",
        "optimizare pdf",
        "compresor pdf",
        "pdf mai mic",
        "compress pdf",
      ],
      ogTitle: "Comprimă PDF-uri fără a pierde din calitate | PDFLince",
      ogDescription:
        "Adaugă fișierul, alege nivelul optim de compresie și descarcă un PDF mult mai mic în câteva secunde — în siguranță, fără încărcare pe vreun server.",
      ogImageAlt: "Interfața instrumentului de compresie PDFLince",
    },
    hero: {
      title: "Comprimă PDF online cu rezultate clare",
      description:
        "Redu dimensiunea documentului pentru a respecta limitele de e-mail, de pe platformele educaționale sau procedurile administrative, menținând în același timp lizibilitatea fiecărei pagini.",
      bulletPoints: [
        "Procesare 100% locală — fișierele tale nu părăsesc niciodată browserul",
        "Alege o compresie de bază, medie sau agresivă în funcție de obiectivele tale",
        "Păstrează metadatele și structura documentului atunci când ai nevoie",
      ],
      imageAlt: "Fluxul de lucru pentru compresia PDF în PDFLince",
    },
    benefitsTitle: "De ce să comprimi PDF-uri cu PDFLince",
    benefits: [
      {
        title: "Calitate echilibrată",
        description:
          "Motorul nostru de compresie evaluează fiecare resursă pentru a oferi cea mai mare reducere fără a estompa textul sau elementele grafice.",
      },
      {
        title: "Pregătit pentru trimiteri",
        description:
          "Generează fișiere care respectă limitele stricte de încărcare de pe portalurile guvernamentale, universitare sau fluxurile de lucru corporative.",
      },
      {
        title: "Confidențialitate prin design",
        description:
          "Evită încărcarea pe servere și scurgerile de date pentru a respecta politicile interne de confidențialitate fără niciun efort.",
      },
    ],
    howTo: {
      title: "Cum să comprimi un PDF cu PDFLince",
      steps: [
        "Fă clic pe „Încarcă fișierele tale” și selectează PDF-ul pe care dorești să-l optimizezi.",
        "Alege nivelul de compresie și ajustează opțiunile avansate precum păstrarea metadatelor.",
        "Apasă pe „Procesează” și descarcă documentul comprimat în câteva secunde.",
      ],
      note:
        "Lucrezi cu mai multe rapoarte? Comprimă-le unul câte unul, fără limite zilnice și fără filigrane.",
    },
    useCasesTitle: "Când este utilă compresia",
    useCases: [
      "Trimite contracte, facturi sau manuale prin e-mail fără a atinge limita de atașamente.",
      "Încarcă teme sau proiecte pe Moodle, Canvas sau orice altă platformă educațională care impune o limită strictă pentru dimensiunea fișierelor.",
      "Redu dimensiunea tezelor, cataloagelor sau documentelor de cercetare pentru a îmbunătăți viteza de descărcare.",
      "Arhivează dosare în cloud economisind spațiu de stocare fără a pierde detalii importante.",
    ],
  },
  imagesToPdf: {
    key: "imagesToPdf",
    slug: "imagini-in-pdf",
    mode: "imagesToPdf",
    meta: {
      title: "Creează PDF din imagini | JPG, PNG în PDF | PDFLince | Images to PDF",
      description:
        "Creează un PDF profesional din imaginile tale. Organizează fotografiile, personalizează aspectul paginii și generează documentul local în browser.",
      keywords: [
        "imagini in pdf",
        "jpg in pdf",
        "png in pdf",
        "webp in pdf",
        "creeaza pdf din imagini",
        "images to pdf",
      ],
      ogTitle: "Creează un PDF clar din imaginile tale | PDFLince",
      ogDescription:
        "Trage imaginile la locul lor, configurează setările de pagină și exportă un fișier PDF gata de imprimat — fără încărcări și fără filigrane.",
      ogImageAlt: "Crearea unui PDF din imagini în PDFLince",
    },
    hero: {
      title: "Creează un PDF îngrijit din imagini",
      description:
        "Grupează scanări, fotografii sau elemente grafice într-un singur PDF gata de partajat cu echipa, studenții sau clienții.",
      bulletPoints: [
        "Trage și plasează pentru a stabili ordinea fiecărei pagini",
        "Alege dimensiunea paginii, orientarea și marginile potrivite pentru imprimare sau vizualizare pe ecran",
        "Setează o culoare de fundal solidă pentru a evita transparența neașteptată",
      ],
      imageAlt: "Fluxul de lucru pentru imagini în PDF",
    },
    benefitsTitle: "De ce să asamblezi PDF-uri din imagini cu PDFLince",
    benefits: [
      {
        title: "Aspect consistent",
        description:
          "Aliniezi formate diferite de imagine într-un PDF unificat fără surprize de întindere sau decupare.",
      },
      {
        title: "Pregătit pentru imprimare și vizualizare",
        description:
          "Ajustează marginile, orientarea și culoarea de fundal pentru ca PDF-ul exportat să arate impecabil pe hârtie și pe ecrane.",
      },
      {
        title: "Procesare securizată",
        description:
          "Toate conversiile se fac local în browser, fiind sigure pentru scanări de buletine, chitanțe sau materiale școlare.",
      },
    ],
    howTo: {
      title: "Cum să convertești imagini în PDF",
      steps: [
        "Adaugă imaginile pe care dorești să le incluzi. Reorganizează-le astfel încât secvența să corespundă documentului final.",
        "Ajustează modul de potrivire, dimensiunea paginii, orientarea și marginile în funcție de nevoile tale.",
        "Fă clic pe „Creează PDF” pentru a descărca documentul compilat, gata de a fi partajat sau arhivat.",
      ],
      note:
        "Loturi mari de imagini? Comprimă PDF-ul rezultat sau împarte-l ulterior fără a fi nevoie să încarci din nou imaginile.",
    },
    useCasesTitle: "Utilizări excelente pentru conversia imaginilor în PDF",
    useCases: [
      "Combină fișe de lucru scanate sau lucrări de examen înainte de a le trimite studenților.",
      "Grupează chitanțele de cheltuieli într-un singur PDF în loc de zeci de atașamente individuale.",
      "Creează portofolii sau cataloage din exporturile de design în câteva secunde.",
      "Reunește dovezi fotografice sau imagini de la inspecții într-un singur document pentru părțile interesate.",
    ],
  },
  merge: {
    key: "merge",
    slug: "uneste",
    mode: "merge",
    meta: {
      title: "Unește PDF | Combină mai multe PDF-uri gratuit | PDFLince | Merge PDF",
      description:
        "Combină mai multe fișiere PDF într-un singur document organizat, fără limită de pagini. Trage, reordonează și descarcă fișierul unit instant.",
      keywords: [
        "uneste pdf",
        "combina pdf",
        "unire fisiere pdf",
        "combinare pdf",
        "fuziune pdf",
        "merge pdf",
      ],
      ogTitle: "Unește mai multe PDF-uri în câteva secunde | PDFLince",
      ogDescription:
        "Organizează documentele în ordinea perfectă, ajustează setările și descarcă un fișier PDF unificat fără a încărca vreodată datele tale.",
      ogImageAlt: "Combinarea mai multor PDF-uri în PDFLince",
    },
    hero: {
      title: "Unește PDF-uri online — rapid și sigur",
      description:
        "Creează un singur fișier îngrijit cu contracte, note de curs sau politici interne, gata de trimis, semnat sau arhivat.",
      bulletPoints: [
        "Trage și plasează pentru a controla ordinea finală a paginilor",
        "Fără limite ascunse — unește documente lungi în mod complet gratuit",
        "Păstrează semnele de carte (bookmarks) și metadatele atunci când ai nevoie",
      ],
      imageAlt: "Fuziunea documentelor PDF",
    },
    benefitsTitle: "Avantajele unirii cu PDFLince",
    benefits: [
      {
        title: "Livrare consistentă",
        description:
          "Livrează materiale într-un singur fișier, cu paginare continuă și formatare unificată.",
      },
      {
        title: "Economisește timp",
        description:
          "Evită editoarele desktop greoaie. Trage fișierele, organizează-le și descarcă un document gata de partajat.",
      },
      {
        title: "Privat și anonim",
        description:
          "Nu stocăm nicio copie și nu solicităm date personale, fiind perfect pentru informații confidențiale.",
      },
    ],
    howTo: {
      title: "Cum să unești PDF-uri cu PDFLince",
      steps: [
        "Fă clic pe „Încarcă fișierele tale” și selectează cel puțin două PDF-uri.",
        "Folosește săgețile sau trage fiecare fișier pentru a stabili secvența finală.",
        "Alege preferințele pentru semnele de carte și apasă pe „Procesează” pentru a descărca PDF-ul unit.",
      ],
      note:
        "Ai nevoie să adaugi mai multe fișiere mai târziu? Adaugă-le în listă în orice moment fără a relua procesul.",
    },
    useCasesTitle: "Când este util să unești PDF-uri",
    useCases: [
      "Pregătește o propunere comercială alături de anexe, devize și termeni contractuali.",
      "Trimite facturile lunare grupate într-un singur fișier către departamentul financiar.",
      "Reunește notițele scanate și prezentările într-un singur PDF pentru studenți.",
      "Creează pachete juridice complete pregătite pentru semnătura electronică.",
    ],
  },
  split: {
    key: "split",
    slug: "divide",
    mode: "split",
    meta: {
      title: "Divide un PDF pe pagini sau capitole | Gratuit | PDFLince | Split PDF",
      description:
        "Separă PDF-ul tău în mai multe fișiere după intervale de pagini sau capitole specifice. Bucură-te de control deplin asupra structurii documentului tău.",
      keywords: [
        "divide pdf",
        "separa pdf",
        "imparte pdf pe pagini",
        "divizor pdf",
        "taie pdf",
        "split pdf",
      ],
      ogTitle: "Divide PDF-urile tale cu precizie | PDFLince",
      ogDescription:
        "Alege exact cum dorești să împarți documentul, generează oricâte fișiere individuale ai nevoie și descarcă-le instantaneu.",
      ogImageAlt: "Divizarea unui PDF în PDFLince",
    },
    hero: {
      title: "Divide PDF-uri pe pagini sau segmente",
      description:
        "Extrage capitole, anexe sau secțiuni specifice în fișiere de sine stătătoare, gata de partajat.",
      bulletPoints: [
        "Configurează divizarea după un număr fix de pagini sau intervale precise",
        "Generează mai multe PDF-uri într-o singură etapă de procesare",
        "Lucrează fără limite de pagini și fără filigrane",
      ],
      imageAlt: "Fluxul de lucru pentru divizarea PDF",
    },
    benefitsTitle: "Ce îți oferă divizarea cu PDFLince",
    benefits: [
      {
        title: "Control asupra informațiilor partajate",
        description:
          "Livrează doar partea relevantă a unui document fără a expune secțiuni confidențiale sau irelevante.",
      },
      {
        title: "Generare eficientă",
        description:
          "Generează mai multe fișiere simultan și descarcă-le automat pentru arhivare sau transfer.",
      },
      {
        title: "Configurări avansate",
        description:
          "Creează loturi, inserează separatori sau definește formate de ieșire care se potrivesc fluxului tău de lucru.",
      },
    ],
    howTo: {
      title: "Cum să divizezi un PDF cu PDFLince",
      steps: [
        "Încarcă PDF-ul pe care dorești să-l fragmentezi de pe dispozitivul tău.",
        "Alege dacă dorești să divizezi după un număr fix de pagini sau prin intervale personalizate.",
        "Apasă pe „Procesează” și descarcă automat documentele nou generate.",
      ],
      note:
        "PDFLince descarcă primul fișier imediat și le salvează pe restul pe dispozitivul tău fără pași suplimentari.",
    },
    useCasesTitle: "Scenarii tipice pentru divizarea PDF-urilor",
    useCases: [
      "Publică fiecare capitol al unei cărți electronice ca resursă separată pentru un curs online.",
      "Separă anexele care trebuie trimise prin canale de comunicare diferite.",
      "Extrage rapoartele trimestriale din documente financiare anuale voluminoase.",
      "Pregătește loturi compacte pentru clienți fără a expune documentația tehnică internă.",
    ],
  },
  extract: {
    key: "extract",
    slug: "extrage",
    mode: "extract",
    meta: {
      title: "Extrage pagini PDF | Salvează paginile selectate | PDFLince | Extract PDF pages",
      description:
        "Selectează pagini specifice din orice PDF și creează instantaneu un nou document personalizat. Procesare privată și nelimitată.",
      keywords: [
        "extrage pagini pdf",
        "salveaza pagini pdf",
        "selecteaza pagini pdf",
        "extractor pagini pdf",
        "creeaza pdf nou",
        "extract pdf pages",
      ],
      ogTitle: "Extrage doar paginile de care ai nevoie | PDFLince",
      ogDescription:
        "Bifează paginile relevante pe care dorești să le păstrezi, generează un nou fișier PDF în câteva secunde și menține siguranța datelor tale.",
      ogImageAlt: "Selectarea paginilor PDF în PDFLince",
    },
    hero: {
      title: "Extrage pagini PDF specifice",
      description:
        "Asamblează documente personalizate păstrând doar paginile pe care trebuie să le partajezi sau să le arhivezi.",
      bulletPoints: [
        "Vizualizează miniaturile și bifează paginile individuale",
        "Păstrează numerele paginilor originale sau generează o numerotare nouă",
        "Descarcă instantaneu PDF-ul rezultat fără timp de așteptare",
      ],
      imageAlt: "Extragerea paginilor dintr-un PDF",
    },
    benefitsTitle: "Avantajele extragerii paginilor cu PDFLince",
    benefits: [
      {
        title: "Documente mai relevante",
        description:
          "Partajează doar informațiile utile cu echipa sau clienții tăi, eliminând datele redundante.",
      },
      {
        title: "Control total în browser",
        description:
          "Selectează, previzualizează și verifică fiecare pagină fără software-uri greoaie sau conexiune la internet.",
      },
      {
        title: "Rezultate curate",
        description:
          "Noul PDF își păstrează calitatea originală și metadatele în funcție de opțiunile stabilite de tine.",
      },
    ],
    howTo: {
      title: "Cum să extragi pagini cu PDFLince",
      steps: [
        "Încarcă PDF-ul și alege documentul cu care dorești să lucrezi.",
        "Selectează paginile de care ai nevoie din grila de miniaturi.",
        "Fă clic pe „Procesează” pentru a descărca noul PDF cu paginile selectate.",
      ],
      note:
        "Poți combina extragerea cu alte operațiuni precum unirea sau compresia în sesiuni separate.",
    },
    useCasesTitle: "Idei pentru extragerea paginilor",
    useCases: [
      "Partajează doar capitolul alocat dintr-un manual cu colegii de proiect.",
      "Trimite doar paginile specifice dintr-un contract de credit pentru o verificare juridică.",
      "Asamblează dosare personalizate conținând doar informațiile relevante pentru fiecare client.",
      "Salvează copii ale paginilor de formular sau chitanțelor pe care trebuie să le arhivezi.",
    ],
  },
  crop: {
    key: "crop",
    slug: "decupeaza",
    mode: "crop",
    meta: {
      title: "Decupează pagini PDF | Ajustează marginile | PDFLince | Crop PDF",
      description:
        "Decupează pagini PDF și elimină marginile inutile direct în browser. Selectează paginile și definește zona de decupare.",
      keywords: [
        "decupeaza pdf",
        "decupare pdf online",
        "ajusteaza margini pdf",
        "taie pagini pdf",
        "instrument decupare pdf",
        "elimina spatiu alb pdf",
        "crop pdf",
      ],
      ogTitle: "Decupează pagini PDF local în browserul tău | PDFLince",
      ogDescription:
        "Redu marginile albe și concentrează fiecare pagină doar pe conținutul esențial, cu o procesare complet privată pe dispozitivul tău.",
      ogImageAlt: "Decuparea paginilor PDF în PDFLince",
    },
    hero: {
      title: "Decupează pagini PDF și elimină marginile",
      description:
        "Elimină spațiul alb suplimentar sau restrânge zona vizibilă a paginilor selectate fără a trimite documentul pe vreun server.",
      bulletPoints: [
        "Selectează doar paginile pe care dorești să le decupezi",
        "Redu marginile superioară, dreaptă, inferioară și stângă cu valori precise în puncte",
        "Păstrează fluxul de lucru complet local, cu procesare direct pe dispozitivul tău",
      ],
      imageAlt: "Fluxul de lucru pentru decuparea PDF",
    },
    benefitsTitle: "De ce să decupezi PDF-uri cu PDFLince",
    benefits: [
      {
        title: "Pagini mai curate",
        description:
          "Elimină marginile albe care distrag atenția și concentrează fiecare pagină pe conținutul important.",
      },
      {
        title: "Editare selectivă",
        description:
          "Decupează doar paginile care necesită ajustare, în loc să modifici întregul document.",
      },
      {
        title: "Privat prin definiție",
        description:
          "Fiecare decupare rulează direct în browserul tău, fiind sigură pentru facturi, scanări și rapoarte interne.",
      },
    ],
    howTo: {
      title: "Cum să decupezi pagini PDF cu PDFLince",
      steps: [
        "Încarcă PDF-ul și alege fișierul ale cărui pagini dorești să le decupezi.",
        "Selectează paginile de modificat și configurează marginile de decupare.",
        "Fă clic pe „Procesează” pentru a descărca noul PDF cu noile limite ale paginilor.",
      ],
      note:
        "Dacă diferite grupuri de pagini necesită decupări diferite, poți rula decuparea de mai multe ori.",
    },
    useCasesTitle: "Când este utilă decuparea unui PDF",
    useCases: [
      "Ajustează marginile scanate ale formularelor, chitanțelor sau documentelor semnate.",
      "Elimină marginile albe suplimentare înainte de a imprima sau de a combina fișierele.",
      "Standardizează paginile exportate din instrumente diferite care au borduri neuniforme.",
      "Pregătește cadre mai strânse înainte de a partaja manuale, rapoarte sau materiale de studiu.",
    ],
  },
  rotate: {
    key: "rotate",
    slug: "roteste",
    mode: "rotate",
    meta: {
      title: "Rotește pagini PDF | Întoarce paginile online | PDFLince | Rotate PDF",
      description:
        "Rotește paginile selectate din PDF cu 90 sau 180 de grade direct în browser. Privat, gratuit și complet local.",
      keywords: [
        "roteste pdf",
        "intoarce pagini pdf",
        "rotire pdf",
        "corecteaza pdf inclinat",
        "roteste pagina pdf",
        "rotate pdf",
      ],
      ogTitle: "Rotește pagini PDF în câteva secunde | PDFLince",
      ogDescription:
        "Selectează paginile care au nevoie de o altă orientare, alege 90 sau 180 de grade și descarcă PDF-ul corectat fără a încărca nimic.",
      ogImageAlt: "Rotirea paginilor PDF în PDFLince",
    },
    hero: {
      title: "Rotește paginile PDF fără pierdere de calitate",
      description:
        "Corectează scanările înclinate, exporturile inversate sau paginile cu orientări mixte în doar câteva clicuri.",
      bulletPoints: [
        "Rotește doar paginile pe care le selectezi manual",
        "Alege 90 de grade la dreapta, 180 de grade sau 90 de grade la stânga",
        "Totul rulează în browserul tău, fără încărcări sau timpi de așteptare",
      ],
      imageAlt: "Fluxul de lucru pentru rotirea paginilor PDF",
    },
    benefitsTitle: "De ce să rotești pagini cu PDFLince",
    benefits: [
      {
        title: "Corecții precise",
        description:
          "Ajustează doar paginile care au orientare greșită, excelent pentru loturi de scanare mixte.",
      },
      {
        title: "Corectare rapidă",
        description:
          "Schimbă orientarea paginilor în câteva secunde fără a deschide un editor desktop greoi.",
      },
      {
        title: "Privat implicit",
        description:
          "Documentele confidențiale rămân pe dispozitivul tău, deoarece fiecare rotire se execută local.",
      },
    ],
    howTo: {
      title: "Cum să rotești pagini PDF",
      steps: [
        "Încarcă PDF-ul și alege documentul ale cărui pagini dorești să le corectezi.",
        "Selectează paginile de rotit și alege 90° dreapta, 180° sau 90° stânga.",
        "Fă clic pe „Procesează” pentru a descărca noul PDF cu orientarea actualizată.",
      ],
      note:
        "Mai ai nevoie de ajustări? Poți oricând să reordonezi, să extragi sau să comprimi ulterior PDF-ul rotit.",
    },
    useCasesTitle: "Când ajută rotirea paginilor",
    useCases: [
      "Corectează contractele sau formularele scanate care au fost introduse lateral în scanner.",
      "Întoarce paginile inversate din rapoartele asamblate din surse diferite.",
      "Corectează notițele de curs sau manualele înainte de a le partaja cu studenții.",
      "Curăță PDF-urile de arhivă pentru ca fiecare pagină să fie confortabil de citit pe ecran.",
    ],
  },
  reorder: {
    key: "reorder",
    slug: "reordoneaza",
    mode: "reorder",
    meta: {
      title: "Reordonează paginile PDF | Schimbă ordinea | PDFLince | Reorder PDF",
      description:
        "Reordonează cu ușurință paginile PDF-ului tău printr-o interfață simplă de tip drag-and-drop. Corectează ordinea documentelor și salvează instant.",
      keywords: [
        "reordoneaza pdf",
        "schimba ordine pagini pdf",
        "organizeaza pdf",
        "sorteaza pagini pdf",
        "reorder pdf",
      ],
      ogTitle: "Organizează paginile PDF fără a instala programe | PDFLince",
      ogDescription:
        "Mută paginile la locul lor, corectează erorile de sortare și descarcă documentul PDF perfect organizat.",
      ogImageAlt: "Reorganizarea paginilor PDF",
    },
    hero: {
      title: "Reordonează paginile PDF prin drag-and-drop",
      description:
        "Corectează secvența facturilor scanate, prezentărilor sau rapoartelor lungi în câteva secunde.",
      bulletPoints: [
        "Miniaturile mari te ajută să eviți erorile de sortare",
        "Trage paginile și confirmă noua ordine în mod instantaneu",
        "Exportă PDF-ul reordonat fără a pierde semnele de carte sau legăturile interne",
      ],
      imageAlt: "Interfața pentru ordonarea paginilor",
    },
    benefitsTitle: "De ce să reordonezi pagini cu PDFLince",
    benefits: [
      {
        title: "Fluxuri de lucru rapide",
        description:
          "Corectează scanările dezordonate fără a rescană și fără a instala editoare complexe.",
      },
      {
        title: "Precizie vizuală",
        description:
          "Miniaturile îți permit să validezi fiecare pagină înainte de a exporta noua structură.",
      },
      {
        title: "Fără urme lăsate",
        description:
          "Totul se întâmplă pe dispozitivul tău, fiind soluția ideală pentru documente sensibile.",
      },
    ],
    howTo: {
      title: "Cum să reordonezi paginile cu PDFLince",
      steps: [
        "Încarcă PDF-ul și alege documentul pe care dorești să-l modifici.",
        "Trage fiecare miniatură până când ordinea paginilor este cea corectă.",
        "Apasă pe „Procesează” pentru a descărca documentul cu noua sa secvență.",
      ],
      note:
        "Poți continua să ajustezi ordinea chiar și după un export, fără a reîncărca fișierul.",
    },
    useCasesTitle: "Când este util să reordonezi un PDF",
    useCases: [
      "Aliniează propunerile financiare, anexele și semnăturile în ordinea corectă înainte de trimitere.",
      "Pregătește prezentări tipărite respectând secvența exactă a diapozitivelor.",
      "Corectează paginile duplicat sau inversate după scanarea unui lot mare de documente.",
      "Actualizează manualele prin reorganizarea conținutului existent fără a le reproiecta complet.",
    ],
  },
  pdfToImages: {
    key: "pdfToImages",
    slug: "pdf-in-imagini",
    mode: "pdfToImages",
    meta: {
      title: "Convertește PDF în imagini | Export PNG sau JPEG | PDFLince | PDF to Images",
      description:
        "Convertește fiecare pagină a PDF-ului tău în imagini PNG sau JPEG de înaltă calitate. Alege rezoluția și descarcă-le ca arhivă ZIP.",
      keywords: [
        "pdf in imagini",
        "exporta pagini pdf",
        "pdf in png",
        "pdf in jpeg",
        "descarca pdf ca imagini",
        "pdf to images",
      ],
      ogTitle: "Exportă paginile PDF ca imagini clare | PDFLince",
      ogDescription:
        "Redă fiecare pagină ca o imagine clară direct în browserul tău. Ajustează calitatea și obține instant o arhivă ZIP.",
      ogImageAlt: "PDFLince exportând pagini PDF în imagini",
    },
    hero: {
      title: "Convertește paginile PDF în PNG sau JPEG",
      description:
        "Generează imagini clare din fiecare pagină pentru prezentări, revizuiri sau integrare în proiecte de design.",
      bulletPoints: [
        "Selectează PNG sau JPEG și controlează rezoluția de export (DPI)",
        "Descarcă totul grupate într-un ZIP sau descarcă paginile individual",
        "Redare exclusiv locală — fără încărcări, fără urme pe servere",
      ],
      imageAlt: "Fluxul de lucru pentru conversia PDF în imagini",
    },
    benefitsTitle: "De ce să exporți PDF-uri ca imagini cu PDFLince",
    benefits: [
      {
        title: "Calitate pregătită de prezentare",
        description:
          "Alege rezoluția potrivită pentru diapozitivele tale fără a ghici dacă paginile vor fi suficient de clare.",
      },
      {
        title: "Descărcări flexibile",
        description:
          "Obține o arhivă ZIP ordonată pentru documente lungi sau descarcă doar paginile dorite.",
      },
      {
        title: "Privat prin design",
        description:
          "Redarea se face direct în browser, astfel încât documentele confidențiale nu ajung niciodată pe servere terțe.",
      },
    ],
    howTo: {
      title: "Cum să convertești un PDF în imagini",
      steps: [
        "Încarcă PDF-ul pe care dorești să-l convertești în imagini.",
        "Alege PNG sau JPEG, ajustează DPI-ul și decide dacă dorești rezultatele într-o arhivă ZIP.",
        "Fă clic pe „Exportă imagini” pentru a descărca arhiva.",
      ],
      note:
        "Ai nevoie doar de câteva pagini? Divide sau extrage mai întâi, apoi exportă-le ca imagini.",
    },
    useCasesTitle: "Când ajută conversia din PDF în imagine",
    useCases: [
      "Partajează previzualizări statice ale propunerilor de design aprobate.",
      "Integrează pagini PDF unice în platforme web (CMS) sau prezentări PowerPoint.",
      "Creează imagini compatibile cu tablete sau e-readere care citesc mai greu PDF-uri mari.",
      "Documenteză fluxurile de lucru pentru revizuiri care necesită capturi de ecran ale paginilor.",
    ],
  },
  repair: {
    key: "repair",
    slug: "repara",
    mode: "repair",
    meta: {
      title: "Repară PDF Online Gratuit | Recuperează Fișiere Corupte | PDFLince",
      description:
        "Repară fișiere PDF deteriorate sau corupte direct în browser. Reconstruiește PDF-uri ilizibile local și în siguranță.",
      keywords: [
        "repara pdf",
        "recuperare pdf corupt",
        "reparare pdf gratuit",
        "reconstruire pdf",
      ],
      ogTitle: "Repară și recuperează PDF-uri deteriorate online | PDFLince",
      ogDescription:
        "Repară documente PDF corupte direct în browser cu 100% confidențialitate și fără încărcare pe servere.",
      ogImageAlt: "Interfață reparare PDF PDFLince",
    },
    hero: {
      title: "Repară și reconstruiește PDF-uri deteriorate local",
      description:
        "Recuperează fișiere PDF corupte sau ilizibile reconstruindu-le în documente curate și valide.",
      bulletPoints: [
        "100% privat și în browser — fișierele tale nu părăsesc dispozitivul",
        "Repară tabele xref defecte, fluxuri corupte și pagini ilizibile",
        "Generează PDF-uri curate conforme cu standardele pentru orice program",
      ],
      imageAlt: "Flux de reparare PDF",
    },
    benefitsTitle: "De ce să repari PDF-uri cu PDFLince",
    benefits: [
      {
        title: "Recuperare profundă",
        description:
          "Folosește motoare de randare reziliente pentru a analiza și recupera pagini din documente corupte.",
      },
      {
        title: "Ieșire standard",
        description:
          "Reconstruiește paginile recuperate într-un fișier PDF nou, curat și complet valid.",
      },
      {
        title: "Confidențialitate totală",
        description:
          "Toată procesarea are loc local în browser fără trimiterea datelor pe servere externe.",
      },
    ],
    howTo: {
      title: "Cum să repari un PDF cu PDFLince",
      steps: [
        "Încarcă fișierul PDF deteriorat sau ilizibil.",
        "Fă clic pe „Procesează” pentru a începe recuperarea și reconstrucția.",
        "Descarcă PDF-ul reparat instantaneu.",
      ],
      note:
        "Dacă un fișier rămâne ilizibil, deschiderea lui într-un vizualizator și imprimarea în format PDF folosind o imprimantă virtuală poate ajuta de asemenea.",
    },
    useCasesTitle: "Când ajută repararea unui PDF",
    useCases: [
      "Repară PDF-uri corupte în timpul descărcărilor întrerupte sau transferurilor de fișiere.",
      "Recuperează documente care nu se pot deschide sau îmbina în alte unelte.",
      "Reconstruiește PDF-uri malformate exportate de programe învechite.",
      "Fă utilizabile fișiere anterior neprocesabile.",
    ],
  },
};

export const operationsRo: Record<OperationKey, OperationContent> = {
  merge: operationsRoContent.merge,
  compress: operationsRoContent.compress,
  split: operationsRoContent.split,
  extract: operationsRoContent.extract,
  crop: operationsRoContent.crop,
  rotate: operationsRoContent.rotate,
  reorder: operationsRoContent.reorder,
  pdfToImages: operationsRoContent.pdfToImages,
  imagesToPdf: operationsRoContent.imagesToPdf,
  repair: operationsRoContent.repair,
};
