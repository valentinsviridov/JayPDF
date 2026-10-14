import { OperationContent } from "../operation-types";
import { OperationKey } from "../../../types/operations";

const operationsHuContent: Record<OperationKey, OperationContent> = {
  compress: {
    key: "compress",
    slug: "tomoriteni",
    mode: "compress",
    meta: {
      title: "PDF tömörítése ingyenesen online | Méret csökkentése | JayPDF",
      description:
        "Csökkentsd hatékonyan a PDF fájlok méretét minőségveszteség nélkül. Ingyenes és bizalmas tömörítés közvetlenül a böngésződben – szerverre feltöltés nélkül.",
      keywords: [
        "pdf tömörítés",
        "pdf compress",
        "pdf tömörítése",
        "pdf méret csökkentése",
        "pdf tömörítés online",
        "pdf kompresszor",
        "pdf kisebb méret",
        "pdf optimalizálás",
      ],
      ogTitle: "PDF tömörítése minőségveszteség nélkül | JayPDF",
      ogDescription:
        "Töltsd fel a fájlt, válaszd ki az optimális tömörítési szintet, és töltsd le a kisebb PDF-et másodpercek alatt – biztonságosan, idegen szerverre feltöltés nélkül.",
      ogImageAlt: "A JayPDF PDF-tömörítő eszköze",
    },
    hero: {
      title: "PDF tömörítése online, minőség megőrzésével",
      description:
        "Csökkentsd a dokumentumok méretét e-mail-mellékleti korlátok teljesítéséhez, oktatási platformokra való feltöltéshez vagy hatósági benyújtáshoz – az olvashatóság megőrzése mellett.",
      bulletPoints: [
        "100%-ban helyi feldolgozás – a fájlok soha nem hagyják el a böngészőt",
        "Válassz alacsony, közepes vagy magas tömörítési szintet az igényeidhez",
        "Szükség esetén őrizd meg a metaadatokat és a dokumentumszerkezetet",
      ],
      imageAlt: "PDF-tömörítési munkafolyamat a JayPDF-ben",
    },
    benefitsTitle: "Miért tömörítsd PDF-jeidet a JayPDF-szel?",
    benefits: [
      {
        title: "Kiegyensúlyozott minőség",
        description:
          "Az algoritmus minden elemet megvizsgál, a lehető legnagyobb méretcsökkentést biztosítva a szöveg és a grafika élességének megőrzésével.",
      },
      {
        title: "Beküldésre kész fájlok",
        description:
          "Olyan fájlokat kaphatsz, amelyek megfelelnek az állami portálok, egyetemi platformok és vállalati dokumentumkezelő rendszerek szigorú feltöltési korlátainak.",
      },
      {
        title: "Adatvédelem alapból",
        description:
          "Idegen szerverre töltés nélkül nincs adatszivárgás, és a belső adatvédelmi irányelveknek való megfelelés is könnyebben teljesíthető.",
      },
    ],
    howTo: {
      title: "Hogyan tömöríts PDF-et a JayPDF-szel?",
      steps: [
        "Kattints a \"Fájlok feltöltése\" gombra, és válaszd ki az optimalizálni kívánt PDF-et.",
        "Válaszd ki a tömörítési szintet, és állítsd be a speciális lehetőségeket, például a metaadatok eltávolítását.",
        "Kattints a \"Feldolgozás\" gombra, és töltsd le a tömörített dokumentumot másodpercek alatt.",
      ],
      note:
        "Több jelentéssel dolgozol? Tömörítsd őket egyenként – napi limit és vízjel nélkül.",
    },
    useCasesTitle: "Mikor érdemes PDF-et tömöríteni?",
    useCases: [
      "Szerződés, számla vagy kézikönyv küldése e-mailben a mellékletméret-korlát túllépése nélkül.",
      "Fájl feltöltése oktatási platformra (Moodle, Canvas, Kréta), amely szigorú méretkorlátot szab.",
      "Szakdolgozat, katalógus vagy kutatási anyag méretének csökkentése a letöltési sebesség javítása érdekében.",
      "Dokumentáció archiválása a felhőben tárhelymegtakarítással, fontos részletek elvesztése nélkül.",
    ],
  },
  merge: {
    key: "merge",
    slug: "osszefuzni",
    mode: "merge",
    meta: {
      title: "PDF összefűzése online | PDF merge ingyen | JayPDF",
      description:
        "Fűzz össze több PDF-fájlt egyetlen rendezett dokumentumba oldalszám-korlát nélkül. Húzd át, rendezd és töltsd le azonnal – teljes bizalmassággal.",
      keywords: [
        "pdf összefűzés",
        "pdf merge",
        "pdf egyesítés",
        "pdf egyesítése",
        "pdf összefűzése",
        "pdf összevonás",
        "merge pdf online",
        "pdf fájlok összevonása",
      ],
      ogTitle: "Fűzd össze a PDF-jeidet másodpercek alatt | JayPDF",
      ogDescription:
        "Rendezd a dokumentumokat a megfelelő sorrendbe, állítsd be a beállításokat, és töltsd le az összefűzött PDF-et egyetlen adat felhőre töltése nélkül.",
      ogImageAlt: "Több PDF-fájl összefűzése a JayPDF-ben",
    },
    hero: {
      title: "PDF összefűzése online – gyorsan és biztonságosan",
      description:
        "Készíts egyetlen összefűzött fájlt szerződésekből, előadásjegyzetekből vagy belső szabályzatokból – beküldésre, aláírásra vagy archiválásra készen.",
      bulletPoints: [
        "Húzd át a fájlokat az oldalsorrend szabályozásához",
        "Rejtett korlát nélkül – fűzz össze terjedelmes dokumentumokat ingyen",
        "Szükség esetén őrizd meg a könyvjelzőket és a metaadatokat",
      ],
      imageAlt: "PDF dokumentumok összefűzése a JayPDF-ben",
    },
    benefitsTitle: "A JayPDF-szel való PDF-összefűzés előnyei",
    benefits: [
      {
        title: "Egységes megjelenítés",
        description:
          "Adj át anyagokat egyetlen fájlban, folyamatos oldalszámozással és egységes formázással.",
      },
      {
        title: "Időmegtakarítás",
        description:
          "Nincs szükség nehézkes asztali szerkesztőkre. Húzd át a fájlokat, rendezd és töltsd le a kész dokumentumot.",
      },
      {
        title: "Bizalmas és anonim",
        description:
          "Nincs szerveres másolat, nincs személyes adat – ideális bizalmas információk kezeléséhez.",
      },
    ],
    howTo: {
      title: "Hogyan fűzz össze PDF-eket a JayPDF-szel?",
      steps: [
        "Kattints a \"Fájlok feltöltése\" gombra, és válassz legalább két PDF - dokumentumot.",
        "Húzd át a fájlokat vagy használd a nyilakat a végső sorrend beállításához.",
        "Válaszd ki a könyvjelzőbeállításokat, és kattints a \"Feldolgozás\" gombra az összefűzött PDF letöltéséhez.",
      ],
      note:
        "Több fájlt kell hozzáadni? A listához bármikor adhatsz hozzá anélkül, hogy újra kellene kezdeni a folyamatot.",
    },
    useCasesTitle: "Mikor kell PDF-eket összefűzni?",
    useCases: [
      "Egységes kereskedelmi ajánlat készítése mellékletekkel, árajánlatokkal és feltételekkel.",
      "Havi számlák küldése egyetlen fájlban a könyvelési osztálynak.",
      "Beszkennelt jegyzetek és prezentációk összegyűjtése egyetlen PDF-be a hallgatók számára.",
      "Teljes jogi dokumentációs csomag összeállítása elektronikus aláírásra.",
    ],
  },
  split: {
    key: "split",
    slug: "szetbontas",
    mode: "split",
    meta: {
      title: "PDF szétbontása oldalak vagy fejezetek szerint | Ingyenes | JayPDF",
      description:
        "Bontsd fel a PDF-et több fájlra oldaltartomány vagy szakaszok szerint. Teljes kontroll a dokumentumszerkezet felett – szerverre feltöltés nélkül.",
      keywords: [
        "pdf split",
        "pdf szétbontása",
        "pdf felbontás",
        "pdf szétválasztása",
        "pdf felosztása",
        "pdf szétválasztása oldalak szerint",
        "split pdf online",
        "pdf ketté vágás",
      ],
      ogTitle: "Bontsd szét a PDF-jeidet pontosan | JayPDF",
      ogDescription:
        "Válaszd ki, hogyan bontod szét a dokumentumot, hozz létre annyi különálló fájlt, amennyire szükséged van, és töltsd le őket azonnal.",
      ogImageAlt: "PDF-fájl szétbontása a JayPDF-ben",
    },
    hero: {
      title: "PDF szétbontása oldalak vagy szegmensek szerint",
      description:
        "Nyerd ki a fejezeteket, mellékleteket vagy adott szakaszokat különálló fájlokba, amelyek átadásra készek.",
      bulletPoints: [
        "Állítsd be a szétbontást rögzített oldalszám vagy egyedi tartományok szerint",
        "Több PDF-et kaphatsz egyetlen feldolgozási lépésben",
        "Oldalszám- és vízjelkorlát nélkül dolgozhatsz",
      ],
      imageAlt: "PDF szétbontási munkafolyamat",
    },
    benefitsTitle: "Mit kapsz a JayPDF-szel való szétbontással?",
    benefits: [
      {
        title: "Kontroll az információmegosztás felett",
        description:
          "Csak a dokumentum releváns részét add át, ne fedj fel bizalmas vagy felesleges szakaszokat.",
      },
      {
        title: "Hatékony fájlgenerálás",
        description:
          "Egyszerre hozz létre több fájlt, majd mentsd el az archiváláshoz vagy továbbításhoz szükségeseket.",
      },
      {
        title: "Rugalmas beállítások",
        description:
          "Kötegekbe bontj, adj hozzá elválasztókat, vagy határozz meg kimeneti formátumokat a munkafolyamatodhoz.",
      },
    ],
    howTo: {
      title: "Hogyan bonts szét PDF-et a JayPDF-szel?",
      steps: [
        "Töltsd fel a szétbontani kívánt PDF-et az eszközödről.",
        "Válassz rögzített oldalszám szerinti szétbontást, vagy állítsd be egyénileg a tartományokat.",
        "Kattints a „Feldolgozás” gombra, majd mentsd el a fájlokat a mellettük lévő gombbal.",
      ],
      note:
        "Mentsd el külön-külön az eredményeket. Az elérhető mentési lehetőségek a böngészőtől függnek.",
    },
    useCasesTitle: "Tipikus PDF-szétbontási forgatókönyvek",
    useCases: [
      "Egy e-könyv minden fejezetét önálló erőforrásként tedd közzé egy tanulási platformon.",
      "Különítsd el a mellékleteket, amelyeket különböző csatornákon kell elküldeni.",
      "Emeld ki a negyedéves jelentéseket egy terjedelmes éves pénzügyi dokumentumból.",
      "Készíts kompakt csomagokat az ügyfelek számára belső műszaki dokumentáció nélkül.",
    ],
  },
  extract: {
    key: "extract",
    slug: "kivalasztani",
    mode: "extract",
    meta: {
      title: "PDF oldalak kinyerése | Oldalak mentése külön | JayPDF",
      description:
        "Válassz ki egyes oldalakat bármely PDF-ből, és azonnal hozz létre belőlük új dokumentumot. Korlátlan, privát feldolgozás közvetlenül a böngésződben.",
      keywords: [
        "pdf oldalak kiválasztása",
        "pdf oldalak kiválasztás",
        "extract pdf",
        "pdf oldalak kinyerése",
        "pdf oldalak kivágása",
        "pdf-ből oldalak mentése",
      ],
      ogTitle: "Csak a szükséges oldalakat nyerd ki | JayPDF",
      ogDescription:
        "Jelöld meg a kívánt oldalakat, hozz létre új PDF-et másodpercek alatt, és tartsd biztonságban az adataidat a saját eszközödön.",
      ogImageAlt: "PDF oldalak kiválasztása a JayPDF-ben",
    },
    hero: {
      title: "Egyes PDF-oldalak kinyerése",
      description:
        "Készíts személyre szabott dokumentumokat, csak azokat az oldalakat megtartva, amelyeket meg kell osztani vagy archiválni kell.",
      bulletPoints: [
        "Böngéssz az előnézeti képek között, és jelöld meg a kívánt oldalakat",
        "Tartsd meg az eredeti oldalszámozást, vagy hozz létre újat",
        "Töltsd le az eredmény PDF-et azonnal",
      ],
      imageAlt: "Oldalak kinyerése PDF-ből a JayPDF-ben",
    },
    benefitsTitle: "Az oldalak PDF-ből való kinyerésének előnyei a JayPDF-szel",
    benefits: [
      {
        title: "Csak a szükséges tartalom",
        description:
          "Ossz meg kollégákkal vagy ügyfelekkel csak releváns adatokat, fölösleges tartalom nélkül.",
      },
      {
        title: "Teljes böngészőalapú kontroll",
        description:
          "Válassz, tekints meg és ellenőrizz minden oldalt nehézkes szoftver vagy stabil internet nélkül.",
      },
      {
        title: "Tiszta eredmény",
        description:
          "Az új PDF megőrzi az eredeti minőséget és a metaadatokat a beállításaidnak megfelelően.",
      },
    ],
    howTo: {
      title: "Hogyan nyerd ki az oldalakat a JayPDF-szel?",
      steps: [
        "Töltsd fel a PDF-et, és válaszd ki a munkára szánt dokumentumot.",
        "Jelöld meg a szükséges oldalakat az előnézeti képek paneljén.",
        "Kattints a \"Feldolgozás\" gombra, és töltsd le a kiválasztott oldalakból álló PDF - et.",
      ],
      note:
        "A kinyerést más műveletekkel is kombinálhatod – például összefűzéssel vagy tömörítéssel – külön munkamenetekben.",
    },
    useCasesTitle: "Ötletek PDF-oldalak kinyeréséhez",
    useCases: [
      "Add át csak a hozzárendelt fejezetet egy kézikönyvből a projektcsapatnak.",
      "Küld el a hitelszerződés adott oldalait jogi ellenőrzésre.",
      "Állíts össze személyre szabott csomagot, amely minden ügyfélnek csak a releváns adatait tartalmazza.",
      "Mentsd el az archiválni kívánt nyomtatványoldalakat vagy nyugtákat.",
    ],
  },
  crop: {
    key: "crop",
    slug: "korulvagas",
    mode: "crop",
    meta: {
      title: "PDF oldalak vágása online | Margók eltávolítása | JayPDF",
      description:
        "Vágd le a PDF oldalait és távolítsd el a felesleges margókat közvetlenül a böngésződben. Válaszd ki az oldalakat, állítsd be a vágási területet – szerverre feltöltés nélkül.",
      keywords: [
        "pdf körülvágás",
        "pdf levágás",
        "kivágás pdf",
        "crop pdf",
        "pdf vágása",
        "pdf margók vágása",
        "pdf körbevágás",
        "crop pdf online",
      ],
      ogTitle: "Vágd le a PDF oldalait bizalmasan | JayPDF",
      ogDescription:
        "Távolítsd el a fehér margókat, és összpontosíts minden oldal lényeges tartalmára – minden feldolgozás helyben, az eszközödön zajlik.",
      ogImageAlt: "PDF oldalak vágása a JayPDF-ben",
    },
    hero: {
      title: "PDF oldalak vágása és margók eltávolítása",
      description:
        "Távolítsd el a felesleges fehér területet, vagy szűkítsd le a kiválasztott oldalak látható területét – anélkül, hogy a dokumentumot bárhova elküldened.",
      bulletPoints: [
        "Csak a vágni kívánt oldalakat válaszd ki",
        "Pontosan add meg a felső, jobb, alsó és bal margókat pontokban",
        "Teljes mértékben helyi feldolgozás közvetlenül az eszközödön",
      ],
      imageAlt: "PDF vágási munkafolyamat a JayPDF-ben",
    },
    benefitsTitle: "Miért érdemes PDF-et vágni a JayPDF-szel?",
    benefits: [
      {
        title: "Tiszta oldalak",
        description:
          "Távolítsd el a zavaró fehér margókat, és irányítsd az olvasó figyelmét a fontos tartalomra.",
      },
      {
        title: "Szelektív szerkesztés",
        description:
          "Csak a módosítást igénylő oldalakat vágd le, az egész dokumentumot ne módosítsd.",
      },
      {
        title: "Adatvédelem alapból",
        description:
          "A vágás közvetlenül a böngésződben fut – biztonságos számlák, beszkennelt dokumentumok és belső jelentések számára.",
      },
    ],
    howTo: {
      title: "Hogyan vágd le a PDF-oldalakat a JayPDF-szel?",
      steps: [
        "Töltsd fel a PDF-et, és válaszd ki a vágni kívánt oldalakat tartalmazó fájlt.",
        "Jelöld meg a módosítandó oldalakat, és állítsd be a vágási margókat.",
        "Kattints a \"Feldolgozás\" gombra, és töltsd le az új laphatárú PDF - et.",
      ],
      note:
        "Ha az oldalak különböző csoportjai eltérő vágást igényelnek, futtasd a műveletet többször.",
    },
    useCasesTitle: "Mikor hasznos a PDF vágása?",
    useCases: [
      "Távolítsd el a szkenner margóit az űrlapokról, nyugtákról vagy aláírt dokumentumokról.",
      "Szüntesd meg a felesleges margókat nyomtatás vagy fájlok összefűzése előtt.",
      "Egységesítsd a különböző eszközökből exportált, eltérő szegéllyel rendelkező oldalakat.",
      "Tömörebb elrendezést készíts kézikönyvek, jelentések vagy tananyagok megosztása előtt.",
    ],
  },
  rotate: {
    key: "rotate",
    slug: "forgatas",
    mode: "rotate",
    meta: {
      title: "PDF oldalak forgatása online | Tájolás javítása | JayPDF",
      description:
        "Forgasd el a kiválasztott PDF-oldalakat 90 vagy 180 fokkal közvetlenül a böngésződben. Ingyenes, bizalmas és teljesen helyi.",
      keywords: [
        "pdf forgatása",
        "pdf elforgatása",
        "pdf rotate",
        "rotate pdf",
        "pdf oldal megfordítás",
        "pdf elforgatás",
        "pdf tájolás javítása",
        "rotate pdf online",
      ],
      ogTitle: "Forgasd el a PDF oldalakat másodpercek alatt | JayPDF",
      ogDescription:
        "Válaszd ki a hibás tájolású oldalakat, add meg a szöget, és töltsd le a javított PDF-et bárhova való feltöltés nélkül.",
      ogImageAlt: "PDF oldalak forgatása a JayPDF-ben",
    },
    hero: {
      title: "PDF oldalak forgatása minőségveszteség nélkül",
      description:
        "Javítsd ki a féloldalas szkenneket, fejjel lefelé fordított dokumentumokat, vagy vegyes tájolású oldalakat néhány kattintással.",
      bulletPoints: [
        "Csak a kiválasztott oldalakat forgasd el",
        "Válassz 90°-os jobbra, 180°-os vagy 90°-os balra forgatást",
        "Minden a böngésződben fut – feltöltés és várakozás nélkül",
      ],
      imageAlt: "PDF oldal-forgatási munkafolyamat a JayPDF-ben",
    },
    benefitsTitle: "Miért érdemes az oldalakat a JayPDF-szel forgatni?",
    benefits: [
      {
        title: "Pontos javítások",
        description:
          "Csak a hibás tájolású oldalakat állítsd be – ideális vegyes szkennelt kötegekhez.",
      },
      {
        title: "Gyors javítás",
        description:
          "Változtasd meg az oldalak tájolását másodpercek alatt, nehézkes asztali szerkesztő megnyitása nélkül.",
      },
      {
        title: "Teljes adatvédelem",
        description:
          "A bizalmas dokumentumok az eszközödön maradnak – minden forgatás helyben hajtódik végre.",
      },
    ],
    howTo: {
      title: "Hogyan forgasd el a PDF-oldalakat a JayPDF-szel?",
      steps: [
        "Töltsd fel a PDF-et, és válaszd ki a javítani kívánt oldalakat tartalmazó dokumentumot.",
        "Jelöld meg a forgatni kívánt oldalakat, és válassz szöget: 90° jobbra, 180° vagy 90° balra.",
        "Kattints a \"Feldolgozás\" gombra, és töltsd le a frissített tájolású PDF - et.",
      ],
      note:
        "További módosításra van szükség? Az elforgatott PDF-et külön lépésben átrendezheted, oldalakat vonhatsz ki belőle, vagy tömörítheted.",
    },
    useCasesTitle: "Mikor hasznos az oldalak forgatása?",
    useCases: [
      "Javítsd ki az oldalra beszkennelt szerződéseket, nyomtatványokat vagy nyugtákat.",
      "Fordítsd vissza a fejjel lefelé lévő oldalakat a különböző forrásokból összeállított jelentésekben.",
      "Rendezd a hallgatói kiosztmányokat vagy tankönyveket megosztás előtt.",
      "Tisztítsd meg az archív PDF-eket, hogy minden oldal kényelmesen olvasható legyen.",
    ],
  },
  reorder: {
    key: "reorder",
    slug: "atrendezni",
    mode: "reorder",
    meta: {
      title: "PDF oldalak átrendezése | Sorrend módosítása | JayPDF",
      description:
        "Rendezd át könnyedén a PDF-oldalakat drag-and-drop módszerrel. Javítsd a sorrendet és mentsd el azonnal – teljesen helyi feldolgozással.",
      keywords: [
        "pdf oldalak átrendezése",
        "pdf sorrend módosítása",
        "reorder pdf online",
        "pdf oldalak sorrendje",
        "pdf rendezés",
      ],
      ogTitle: "PDF oldalak rendezése extra szoftver nélkül | JayPDF",
      ogDescription:
        "Húzd a megfelelő helyre az oldalakat, javítsd a sorrendet, és töltsd le a tökéletesen szervezett PDF-et.",
      ogImageAlt: "PDF oldalak átrendezése a JayPDF-ben",
    },
    hero: {
      title: "PDF oldalak átrendezése drag-and-drop módszerrel",
      description:
        "Javítsd a beszkennelt számlák, prezentációk vagy hosszú jelentések sorrendjét másodpercek alatt.",
      bulletPoints: [
        "A nagy előnézeti képek segítenek elkerülni a sorrendhibákat",
        "Húzd át az oldalakat, és azonnal erősítsd meg az új sorrendet",
        "Az átrendezett PDF-et könyvjelzők és belső hivatkozások elvesztése nélkül exportálhatod",
      ],
      imageAlt: "PDF oldalsorrend-rendező felület",
    },
    benefitsTitle: "Miért érdemes a PDF-oldalakat a JayPDF-szel rendezni?",
    benefits: [
      {
        title: "Gyorsabb munkafolyamatok",
        description:
          "Rendezetlen szkenneket javítj ki újraszkennelés és bonyolult szerkesztők nélkül.",
      },
      {
        title: "Vizuális kontroll",
        description:
          "Az előnézeti képek segítségével minden oldalt ellenőrizhetsz az új sorrend exportálása előtt.",
      },
      {
        title: "Nyom nélkül",
        description:
          "Minden az eszközödön zajlik – ideális bizalmas dokumentumok esetén.",
      },
    ],
    howTo: {
      title: "Hogyan rendezd át a PDF-oldalakat a JayPDF-szel?",
      steps: [
        "Töltsd fel a PDF-et, és válaszd ki a szerkeszteni kívánt dokumentumot.",
        "Húzd az egyes előnézeti képeket a kívánt helyre.",
        "Kattints a \"Feldolgozás\" gombra, és töltsd le az új oldalsorrend szerinti dokumentumot.",
      ],
      note:
        "A sorrendet exportálás után is módosíthatod anélkül, hogy újra fel kellene tölteni a fájlt.",
    },
    useCasesTitle: "Mikor hasznos a PDF átrendezése?",
    useCases: [
      "Rendezd logikus sorrendbe a kereskedelmi ajánlatokat, mellékleteket és aláírásokat az elküldés előtt.",
      "Készíts nyomtatási anyagokat a diák pontos sorrendjében.",
      "Javítsd ki a tömeges szkennelés után megduplázódott vagy felcserélt oldalakat.",
      "Frissítsd a kézikönyveket a meglévő tartalom átszervezésével teljes újratervezés nélkül.",
    ],
  },
  pdfToImages: {
    key: "pdfToImages",
    slug: "pdf-kepekbe",
    mode: "pdfToImages",
    meta: {
      title: "PDF konvertálása képekké | PNG / JPEG exportálás | JayPDF",
      description:
        "Alakítsd át a PDF minden oldalát kiváló minőségű PNG vagy JPEG képpé. Válaszd ki a felbontást, és töltsd le ZIP-archívumban – 100%-ban privát módon.",
      keywords: [
        "pdf képekké konvertálása",
        "pdf-ből png",
        "pdf-ből jpeg",
        "pdf oldal képként",
        "pdf exportálás képként",
        "pdf oldalak letöltése képként",
      ],
      ogTitle: "Exportáld a PDF oldalakat éles képekként | JayPDF",
      ogDescription:
        "Rendereld az oldalakat közvetlenül a böngésződben. Állítsd be a minőséget, nevezd el a fájlokat, és azonnal kapj egy rendezett ZIP-archívumot.",
      ogImageAlt: "JayPDF PDF exportálása képekbe",
    },
    hero: {
      title: "PDF oldalak PNG vagy JPEG formátumba konvertálása",
      description:
        "Készíts képeket prezentációkhoz, jóváhagyásokhoz vagy designprojektekhez nehézkes szerkesztők nélkül.",
      bulletPoints: [
        "Válassz PNG vagy JPEG formátumot, és állítsd be az exportálási felbontást (DPI)",
        "Töltsd le egy ZIP-archívumban vagy külön fájlonként",
        "Teljes mértékben helyi renderelés – feltöltés és nyom nélkül",
      ],
      imageAlt: "PDF képekbe exportálási munkafolyamat",
    },
    benefitsTitle: "Miért exportáld a PDF-eket képekként a JayPDF-szel?",
    benefits: [
      {
        title: "Prezentációminőségű képek",
        description:
          "Válassz a diákodhoz illő felbontást – találgatás nélkül, hogy az oldalak elég élések lesznek-e.",
      },
      {
        title: "Rugalmas letöltési lehetőségek",
        description:
          "Kérj rendezett ZIP-archívumot hosszú dokumentumokhoz, vagy töltsd le csak a kívánt oldalakat.",
      },
      {
        title: "Garantált adatvédelem",
        description:
          "A renderelés a böngésződben fut, tehát a bizalmas dokumentumok soha nem kerülnek harmadik félt szerverére.",
      },
    ],
    howTo: {
      title: "Hogyan konvertálj PDF-et képekké?",
      steps: [
        "Töltsd fel a konvertálni kívánt PDF-et.",
        "Válassz PNG vagy JPEG formátumot, állítsd be a DPI-t, és döntsd el, hogy ZIP-archívumra van-e szükséged.",
        "Kattints a \"Képek exportálása\" gombra a fájlok letöltéséhez.",
      ],
      note:
        "Csak néhány oldalra van szükséged? Előbb oszd fel vagy nyerd ki őket, majd exportáld képekként.",
    },
    useCasesTitle: "Mikor hasznos a PDF képekké konvertálása?",
    useCases: [
      "Jóváhagyott designterv statikus előnézetének megosztása.",
      "Egyes PDF-oldalak beágyazása CMS-be, PowerPoint-prezentációba vagy weboldalba.",
      "Képek létrehozása tabletekhez vagy e-olvasókhoz, amelyek nehezen jelenítik meg a PDF-eket.",
      "Munkafolyamatok dokumentálása oldalankénti képernyőképekkel felülvizsgálathoz.",
    ],
  },
  imagesToPdf: {
    key: "imagesToPdf",
    slug: "kepek-pdf-be",
    mode: "imagesToPdf",
    meta: {
      title: "PDF létrehozása képekből | JPG, PNG PDF-be | JayPDF",
      description:
        "Hozz létre professzionális PDF-et a képeidből. Rendezd a fotókat, szabd testre az elrendezést és a margókat – a dokumentum helyben, a böngésződben jön létre.",
      keywords: [
        "képek pdf-be",
        "jpg pdf-be",
        "png pdf-be",
        "pdf létrehozása képekből",
        "képek konvertálása pdf-be",
        "webp pdf-be",
      ],
      ogTitle: "Hozz létre rendezett PDF-et a képeidből | JayPDF",
      ogDescription:
        "Húzd át a képeket, állítsd be az oldalparamétereket, és exportálj nyomtatásra kész PDF-et – fájlfeltöltés és vízjel nélkül.",
      ogImageAlt: "PDF létrehozása képekből a JayPDF-ben",
    },
    hero: {
      title: "JPG vagy PNG képek összefűzése professzionális PDF-be",
      description:
        "Fűzd össze a szkenneket, fotókat vagy grafikákat egyetlen dokumentumba, amely kész az átadásra a csapatnak, diákoknak vagy ügyfeleknek.",
      bulletPoints: [
        "Húzd át a képeket az oldalak sorrendjének megadásához",
        "Állítsd be az oldalméretet, a tájolást és a margókat nyomtatáshoz vagy képernyőn való megtekintéshez",
        "Adj meg háttérszínt, hogy elkerüld a váratlan átlátszóságot",
      ],
      imageAlt: "Képek PDF-be alakításának munkafolyamata",
    },
    benefitsTitle: "Miért érdemes PDF-et képekből összerakni a JayPDF-szel?",
    benefits: [
      {
        title: "Egységes megjelenés",
        description:
          "Hozd közös nevezőre a különböző képformátumokat egy egységes PDF-be nyújtás vagy váratlan vágás nélkül.",
      },
      {
        title: "Nyomtatásra és megtekintésre kész",
        description:
          "Szabályozd a margókat, a tájolást és a hátteret, hogy az exportált PDF papíron és képernyőkön is tökéletesen nézzen ki.",
      },
      {
        title: "Biztonságos feldolgozás",
        description:
          "A konverzió teljesen helyi – biztonságos személyigazolványok, nyugták és tanulási anyagok esetén.",
      },
    ],
    howTo: {
      title: "Hogyan hozz létre PDF-et képekből?",
      steps: [
        "Add hozzá a képeket, és rendezd át őket a végső dokumentumnak megfelelően.",
        "Állítsd be az illesztési módot, az oldalméretet, a tájolást és a margókat az igényeidnek megfelelően.",
        "Kattints a \"PDF létrehozása\" gombra, és töltsd le a megosztásra vagy archiválásra kész fájlt.",
      ],
      note:
        "Az eredmény PDF túl nagy lett? Tömörítsd vagy oszd fel a képek újbóli feltöltése nélkül.",
    },
    useCasesTitle: "Ötletek PDF-ek képekből való létrehozásához",
    useCases: [
      "Beszkennelt házi feladatok vagy dolgozatok összegyűjtése az elküldés előtt.",
      "Kiadási nyugták összefűzése egyetlen PDF-be több tucat különálló melléklet helyett.",
      "Portfólió vagy katalógus létrehozása designexportokból másodpercek alatt.",
      "Helyszíni ellenőrzési fotójelentés összeállítása egyetlen dokumentumban a megrendelő számára.",
    ],
  },
  repair: {
    key: "repair",
    slug: "javitas",
    mode: "repair",
    meta: {
      title: "PDF javítása ingyen online | Sérült fájlok helyreállítása | JayPDF",
      description:
        "Sérült vagy hibás PDF-fájlok javítása közvetlenül a böngészőben. Olvashatatlan PDF-ek biztonságos és helyi helyreállítása.",
      keywords: [
        "pdf javítása",
        "sérült pdf helyreállítása",
        "hibás pdf javítás",
        "pdf javítás online",
      ],
      ogTitle: "Sérült PDF-ek javítása és helyreállítása online | JayPDF",
      ogDescription:
        "Olvashatatlan PDF-dokumentumok javítása közvetlenül a böngészőben 100% adatvédelemmel, feltöltés nélkül.",
      ogImageAlt: "JayPDF PDF javító felület",
    },
    hero: {
      title: "Sérült PDF-ek helyi javítása és újjáépítése",
      description:
        "Sérült vagy olvashatatlan PDF-fájlok helyreállítása újrarajzolással és tiszta, érvényes dokumentummá történő újjáépítéssel.",
      bulletPoints: [
        "100% helyi és privát — a fájljaid soha nem hagyják el a készülékedet",
        "Javítja a törött xref táblákat, a hibás adatfolyamokat és a sérült oldalakat",
        "Tiszta, szabványos PDF-et hoz létre minden megtekintőhöz",
      ],
      imageAlt: "PDF javítási munkafolyamat",
    },
    benefitsTitle: "Miért javíts PDF-eket a JayPDF segítségével",
    benefits: [
      {
        title: "Alapos helyreállítás",
        description:
          "Rugalmas megjelenítő motorokat használ a sérült fájlok oldalainak megmentésére.",
      },
      {
        title: "Szabványos kimenet",
        description:
          "A helyreállított oldalakat egy teljesen új, érvényes PDF-dokumentummá építi újra.",
      },
      {
        title: "Teljes adatvédelem",
        description:
          "Minden művelet helyben fut a böngésződben, külső szerverre küldés nélkül.",
      },
    ],
    howTo: {
      title: "Hogyan javíts meg egy PDF-et a JayPDF-szel",
      steps: [
        "Töltsd fel a sérült vagy hibás PDF-fájlt.",
        "Kattints a „Feldolgozás” gombra a helyreállítás elindításához.",
        "Töltsd le azonnal a javított, működőképes PDF-dokumentumot.",
      ],
      note:
        "Ha egy fájl továbbra sem olvasható, a megnyitása és virtuális nyomtatóval PDF-be nyomtatása szintén segíthet.",
    },
    useCasesTitle: "Mikor segít a PDF javítása",
    useCases: [
      "Megszakadt letöltések vagy fájlátvitelek során megsérült PDF-ek javítása.",
      "Olyan dokumentumok megmentése, amelyek más programokban nem nyithatók meg.",
      "Régebbi vagy hibás szoftverek által exportált PDF-ek újjáépítése.",
      "Korábban használhatatlan fájlok feldolgozhatóvá tétele.",
    ],
  },
};

export const operationsHu: Record<OperationKey, OperationContent> = {
  merge: operationsHuContent.merge,
  compress: operationsHuContent.compress,
  split: operationsHuContent.split,
  extract: operationsHuContent.extract,
  crop: operationsHuContent.crop,
  rotate: operationsHuContent.rotate,
  reorder: operationsHuContent.reorder,
  pdfToImages: operationsHuContent.pdfToImages,
  imagesToPdf: operationsHuContent.imagesToPdf,
  repair: operationsHuContent.repair,
};
