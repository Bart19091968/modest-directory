import prisma from '@/lib/db'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ShopCard from '@/components/ShopCard'

export const dynamic = 'force-dynamic'

const categoryNames: Record<string, string> = {
  'hijab-shops': 'Hijab Shops',
  'abaya-shops': 'Abaya Winkels',
  'islamitische-kleding': 'Islamitische Kleding',
}

const categoryH1Names: Record<string, string> = {
  'hijab-shops': 'Hijab winkels',
  'abaya-shops': 'Abaya winkels',
  'islamitische-kleding': 'Islamitische kledingwinkels',
}

type PageContent = {
  h1: string
  seoTitle: string
  metaDesc: string
  intro: string
  seoBlock: string
}

const pageContent: Record<string, PageContent> = {
  // ── Country / category (section 5) ──────────────────────────────────
  'hijab-shops_nederland': {
    h1: 'Hijab winkels in Nederland',
    seoTitle: 'Hijab winkels in Nederland | Hoofddoeken, sjaals & shops',
    metaDesc: 'Vind hijab winkels in Nederland. Vergelijk webshops en fysieke winkels voor hoofddoeken, jersey hijabs, chiffon hijabs en accessoires.',
    intro: 'Zoek je een hijab winkel in Nederland? Op deze pagina vind je webshops en fysieke winkels met hijabs, hoofddoeken, onderkapjes, sjaals en accessoires. De selectie loopt van dagelijkse basics tot luxere stoffen voor werk, studie, feestdagen of een bijzondere gelegenheid.\n\nGebruik de filters om winkels te bekijken per stad en type winkel. Zo vind je sneller een hijabshop in Amsterdam, Rotterdam, Den Haag, Utrecht, Eindhoven of een webshop die in heel Nederland levert.',
    seoBlock: 'Een goede hijab is vaak een kwestie van detail: stof, lengte, transparantie, grip en hoe de kleur zich houdt in daglicht. Nederlandse hijab winkels spelen daar steeds beter op in, met collecties in jersey, chiffon, modal, katoen en satijn.\n\nVoor wie fysiek wil passen of stoffen wil voelen, zijn steden als Amsterdam, Rotterdam en Den Haag logische vertrekpunten. Wie vooral breed wil vergelijken, vindt bij webshops vaak meer kleuren, meer voorraad en snelle levering binnen Nederland.',
  },
  'hijab-shops_belgie': {
    h1: 'Hijab winkels in België',
    seoTitle: 'Hijab winkels in België | Hoofddoeken, sjaals & shops',
    metaDesc: 'Vind hijab winkels in België. Vergelijk fysieke winkels en webshops voor hoofddoeken, hijabs, sjaals, onderkapjes en accessoires.',
    intro: 'Op zoek naar een hijab winkel in België? Hier vind je fysieke winkels en webshops met hijabs, hoofddoeken, sjaals, onderkapjes en hijabaccessoires. Van eenvoudige dagelijkse modellen tot stoffen en kleuren voor gelegenheden waarbij de outfit net wat meer mag hebben.\n\nBekijk winkels in Antwerpen, Brussel, Gent, Luik, Charleroi en daarbuiten. Gebruik de filters om snel te zien welke winkels fysiek bereikbaar zijn en welke webshops in België leveren.',
    seoBlock: 'België heeft een groeiend aanbod voor wie hoofddoeken en hijabs zoekt zonder eindeloos te moeten zoeken op losse socialmediaprofielen. In Antwerpen en Brussel vind je winkels met een sterk stedelijk karakter, terwijl webshops vaak een ruimer kleur- en stoffenpalet aanbieden.\n\nLet bij het vergelijken vooral op materiaal, formaat en draagmoment. Een jersey hijab werkt anders dan chiffon; een lichte sjaal voor de zomer vraagt iets anders dan een vollere stof voor de winter. Deze gids helpt om winkels te vinden die bij die keuze passen.',
  },
  'abaya-shops_nederland': {
    h1: "Abaya winkels in Nederland",
    seoTitle: "Abaya winkels in Nederland | Abaya's, jilbabs & gebedskleding",
    metaDesc: "Vind abaya winkels in Nederland. Vergelijk webshops en fysieke winkels voor abaya's, jilbabs, gebedsjurken en modest fashion.",
    intro: "Deze pagina verzamelt abaya winkels in Nederland: webshops en fysieke winkels met abaya's, jilbabs, gebedsjurken, kimono's en andere bescheiden kleding. Of je zoekt naar een eenvoudige zwarte abaya, een soepel vallend model voor dagelijks gebruik of een elegantere versie voor Eid of een familiegelegenheid.\n\nVergelijk winkels op stad, categorie en type winkel. Zo zie je sneller waar je terechtkunt in Amsterdam, Rotterdam, Den Haag, Utrecht, Eindhoven of online.",
    seoBlock: "De abaya is in Nederland allang niet meer één vast kledingstuk. Je ziet minimalistische modellen, open abaya's, abaya's met subtiel borduurwerk en ontwerpen die dichter bij modest fashion dan bij traditionele gelegenheidskleding staan.\n\nFysieke winkels zijn handig wanneer pasvorm, lengte en stof belangrijk zijn. Webshops bieden vaak juist meer keuze in kleuren, maten en modellen. Deze gids brengt beide opties samen, zodat bezoekers gericht kunnen vergelijken.",
  },
  'abaya-shops_belgie': {
    h1: "Abaya winkels in België",
    seoTitle: "Abaya winkels in België | Abaya's, jilbabs & gebedskleding",
    metaDesc: "Vind abaya winkels in België. Vergelijk fysieke winkels en webshops voor abaya's, jilbabs, gebedsjurken en islamitische kleding.",
    intro: "Zoek je een abaya winkel in België? Op deze pagina vind je webshops en fysieke winkels met abaya's, jilbabs, gebedsjurken, kimono-abaya's en andere modest fashion. Van ingetogen basics tot elegantere modellen voor Ramadan, Eid of een feestelijke avond.\n\nBekijk winkels in Antwerpen, Brussel, Gent, Luik en Charleroi, of vergelijk webshops die in heel België leveren.",
    seoBlock: "In België wordt de abaya op verschillende manieren gedragen: als rustig dagelijks silhouet, als onderdeel van een feestelijke look of als praktische keuze voor wie bedekking en comfort zoekt. Vooral in steden met een sterke modest-fashioncultuur zie je dat klassieke modellen naast modernere snitten bestaan.\n\nLet bij het kiezen op lengte, stofdikte, mouwvorm en sluiting. Een abaya voor dagelijks gebruik vraagt vaak iets anders dan een abaya voor een speciale gelegenheid. Deze gids helpt bezoekers om sneller winkels te vinden die passen bij die voorkeur.",
  },
  'islamitische-kleding_nederland': {
    h1: 'Islamitische kledingwinkels in Nederland',
    seoTitle: 'Islamitische kleding in Nederland | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in Nederland. Vergelijk webshops en fysieke winkels voor hijabs, abaya's, jilbabs, qamis en meer.",
    intro: "Welkom bij de gids voor islamitische kledingwinkels in Nederland. Hier vind je winkels en webshops met hijabs, abaya's, jilbabs, khimars, qamis, gebedskleding en andere bescheiden kleding voor dames, heren en kinderen.\n\nGebruik de filters om winkels te vergelijken op stad, categorie en type winkel. Of je nu zoekt naar een fysieke winkel in Amsterdam, Rotterdam of Den Haag, of naar een webshop met levering in heel Nederland: deze pagina geeft je een helder vertrekpunt.",
    seoBlock: "Islamitische kleding in Nederland is breed: van functionele basics tot modebewuste collecties. Sommige winkels combineren kleding met boeken, parfums en cadeaus, terwijl andere zich volledig richten op abaya's, hijabs of hedendaagse modest fashion.\n\nDie variatie maakt vergelijken belangrijk. Niet elke winkel heeft hetzelfde doel, dezelfde stijl of hetzelfde assortiment. Deze gids helpt bezoekers om sneller te zien welke winkels passen bij hun zoekvraag.",
  },
  'islamitische-kleding_belgie': {
    h1: 'Islamitische kledingwinkels in België',
    seoTitle: 'Islamitische kleding in België | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in België. Vergelijk fysieke winkels en webshops voor hijabs, abaya's, jilbabs, qamis en meer.",
    intro: "Op deze pagina vind je islamitische kledingwinkels in België: fysieke winkels en webshops met hijabs, abaya's, jilbabs, khimars, qamis, gebedskleding en bescheiden mode voor verschillende stijlen en gelegenheden.\n\nVergelijk winkels in Antwerpen, Brussel, Gent, Luik, Charleroi en online. Zo vind je sneller een winkel die past bij wat je zoekt, of dat nu dagelijkse kleding is, feestelijke kleding of een praktische basisgarderobe.",
    seoBlock: "Het Belgische aanbod aan islamitische kleding is veelzijdig. Sommige winkels zijn geworteld in lokale winkelstraten, andere bereiken klanten vooral online. Je vindt er eenvoudige basics, meer uitgesproken modest fashion, kleding voor gebed en feestelijke stukken voor Ramadan of Eid.\n\nDeze gids brengt die verschillende winkels samen zonder ze allemaal hetzelfde te maken. De kracht zit juist in het vergelijken: stad, type winkel, categorie en stijl.",
  },

  // ── Amsterdam (section 7.1) ──────────────────────────────────────────
  'hijab-shops_amsterdam': {
    h1: 'Hijab winkels in Amsterdam',
    seoTitle: 'Hijab winkels Amsterdam | Hoofddoeken & hijab shops',
    metaDesc: 'Vind hijab winkels in Amsterdam. Vergelijk fysieke winkels en webshops voor hoofddoeken, jersey hijabs, chiffon hijabs en accessoires.',
    intro: "Amsterdam is een van de beste steden in Nederland om gericht naar hijabs en hoofddoeken te zoeken. Van Osdorpplein tot Amsterdam-West en De Pijp vind je winkels met jersey hijabs, chiffon sjaals, onderkapjes, abaya's en modest fashion.\n\nGebruik deze pagina om hijab winkels in Amsterdam te vergelijken op type winkel, locatie en aanbod.",
    seoBlock: 'Wie in Amsterdam een hijab winkel zoekt, wil vaak meer dan alleen een adres. Stof, kleur, lengte en draagcomfort maken het verschil. Een fysieke winkel helpt om materialen te voelen; een webshop geeft vaak meer keuze in tinten en voorraad.',
  },
  'abaya-shops_amsterdam': {
    h1: 'Abaya winkels in Amsterdam',
    seoTitle: "Abaya winkels Amsterdam | Abaya's, jilbabs & modest fashion",
    metaDesc: "Vind abaya winkels in Amsterdam. Vergelijk winkels en webshops voor abaya's, jilbabs, kimono-abaya's en islamitische kleding.",
    intro: "Op zoek naar een abaya winkel in Amsterdam? Deze pagina verzamelt winkels en webshops met abaya's, jilbabs, kimono-abaya's en bescheiden kleding voor dagelijks gebruik of een bijzondere gelegenheid.\n\nVergelijk winkels op locatie en type aanbod, van fysieke boutiques tot webshops met levering in Amsterdam.",
    seoBlock: "Amsterdam heeft zowel praktische adressen voor dagelijkse modest fashion als winkels met meer uitgesproken collecties. Voor abaya's is vooral pasvorm belangrijk: lengte, mouwvorm en stof bepalen of een model geschikt is voor dagelijks gebruik, werk, gebed of een feestelijke gelegenheid.",
  },
  'islamitische-kleding_amsterdam': {
    h1: 'Islamitische kledingwinkels in Amsterdam',
    seoTitle: 'Islamitische kleding Amsterdam | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in Amsterdam. Vergelijk winkels en webshops voor hijabs, abaya's, jilbabs, qamis en meer.",
    intro: "Amsterdam heeft een breed aanbod aan islamitische kledingwinkels en webshops. Je vindt er hijabs, abaya's, jilbabs, qamis, kaftans, islamitische boeken, accessoires en kleding voor verschillende stijlen en leeftijden.\n\nGebruik deze pagina om winkels in Amsterdam te vergelijken en sneller te zien welk type winkel bij je zoekvraag past.",
    seoBlock: "Het aanbod in Amsterdam is divers: sommige winkels zijn sterk in hijabs en damesmode, andere combineren kleding met boeken, cadeaus of producten voor het gezin.",
  },

  // ── Rotterdam (section 7.2) ──────────────────────────────────────────
  'hijab-shops_rotterdam': {
    h1: 'Hijab winkels in Rotterdam',
    seoTitle: 'Hijab winkels Rotterdam | Hoofddoeken & hijab shops',
    metaDesc: 'Vind hijab winkels in Rotterdam. Vergelijk fysieke winkels en webshops voor hoofddoeken, hijabs, onderkapjes en accessoires.',
    intro: 'Rotterdam heeft een herkenbaar aanbod voor wie hijabs en hoofddoeken zoekt: praktisch, stedelijk en vaak dicht bij andere modest-fashionwinkels. Bekijk winkels en webshops met jersey hijabs, chiffon hoofddoeken, sjaals, onderkapjes en accessoires.\n\nGebruik deze pagina om hijab winkels in Rotterdam gericht te vergelijken.',
    seoBlock: 'In Rotterdam speelt fysieke bereikbaarheid een grote rol. Bezoekers willen snel weten waar ze stoffen kunnen voelen, kleuren kunnen vergelijken of een hijab kunnen combineren met een abaya of outfit.',
  },
  'abaya-shops_rotterdam': {
    h1: 'Abaya winkels in Rotterdam',
    seoTitle: "Abaya winkels Rotterdam | Abaya's, jilbabs & meer",
    metaDesc: "Vind abaya winkels in Rotterdam. Vergelijk winkels en webshops voor abaya's, jilbabs, gebedsjurken en modest fashion.",
    intro: "Zoek je abaya's in Rotterdam? Deze pagina brengt winkels en webshops samen met abaya's, jilbabs, gebedsjurken en modest fashion voor dagelijks gebruik of een speciale gelegenheid.\n\nVergelijk fysieke winkels en webshops op locatie, aanbod en type winkel.",
    seoBlock: "Rotterdamse modest fashion heeft vaak een praktische inslag: kleding moet mooi zijn, maar ook draagbaar en bereikbaar. Voor abaya's betekent dat letten op stof, lengte, sluiting en bewegingsruimte.",
  },
  'islamitische-kleding_rotterdam': {
    h1: 'Islamitische kledingwinkels in Rotterdam',
    seoTitle: 'Islamitische kleding Rotterdam | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in Rotterdam. Vergelijk winkels en webshops voor hijabs, abaya's, qamis, jilbabs en meer.",
    intro: "Rotterdam biedt islamitische kledingwinkels met een breed assortiment: van hijabs en abaya's tot qamis, boeken, parfums, accessoires en kleding voor mannen, vrouwen en kinderen.\n\nGebruik deze pagina om winkels in Rotterdam te vergelijken en snel naar de juiste categorie door te klikken.",
    seoBlock: "Voor bezoekers die islamitische kleding in Rotterdam zoeken, is het handig om brede winkels en gespecialiseerde boutiques op één plek te zien. Sommige adressen zijn ideaal voor basisproducten, andere voor outfits met meer modegevoel.",
  },

  // ── Den Haag (section 7.3) ───────────────────────────────────────────
  'hijab-shops_den-haag': {
    h1: 'Hijab winkels in Den Haag',
    seoTitle: 'Hijab winkels Den Haag | Hoofddoeken & hijab shops',
    metaDesc: 'Vind hijab winkels in Den Haag. Vergelijk fysieke winkels en webshops voor hoofddoeken, hijabs, sjaals en accessoires.',
    intro: 'Den Haag heeft meerdere adressen voor wie hijabs, hoofddoeken en bescheiden damesmode zoekt. Van winkelstraten tot boutiques en webshops: de stad biedt opties voor dagelijkse basics en meer verzorgde looks.\n\nGebruik deze pagina om hijab winkels in Den Haag te vergelijken op locatie, categorie en type winkel.',
    seoBlock: 'Een hijab kopen in Den Haag draait vaak om vertrouwen en gemak. Bezoekers willen snel weten welke winkels fysiek bereikbaar zijn, welke webshops leveren en waar je terechtkunt voor advies over stof of kleur.',
  },
  'abaya-shops_den-haag': {
    h1: 'Abaya winkels in Den Haag',
    seoTitle: "Abaya winkels Den Haag | Abaya's, jilbabs & meer",
    metaDesc: "Vind abaya winkels in Den Haag. Vergelijk winkels en webshops voor abaya's, jilbabs, gebedsjurken en islamitische kleding.",
    intro: "Op zoek naar een abaya winkel in Den Haag? Bekijk winkels en webshops met abaya's, jilbabs, gebedsjurken en bescheiden kleding voor dagelijks gebruik, werk, gebed of een feestelijke gelegenheid.\n\nGebruik de filters om winkels in Den Haag snel te vergelijken.",
    seoBlock: "Den Haag heeft een aanbod waarin traditionele kleding en modernere modest fashion naast elkaar bestaan. Voor abaya's is het belangrijk om te letten op lengte, mouwvorm, stofdikte en stylingmogelijkheden.",
  },
  'islamitische-kleding_den-haag': {
    h1: 'Islamitische kledingwinkels in Den Haag',
    seoTitle: 'Islamitische kleding Den Haag | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in Den Haag. Vergelijk winkels en webshops voor hijabs, abaya's, qamis, jilbabs en meer.",
    intro: "Den Haag heeft een gevarieerd aanbod aan islamitische kledingwinkels, van boutiques voor damesmode tot winkels met boeken, geschenken, qamis, abaya's en hijabs.\n\nGebruik deze pagina om winkels in Den Haag te vergelijken en sneller te zien welke adressen passen bij je zoekvraag.",
    seoBlock: "Voor islamitische kleding is Den Haag een stad waar assortiment en advies samenkomen. Sommige bezoekers zoeken een complete outfit, anderen een specifiek kledingstuk of een betrouwbare webshop.",
  },

  // ── Utrecht (section 7.4) ────────────────────────────────────────────
  'hijab-shops_utrecht': {
    h1: 'Hijab winkels in Utrecht',
    seoTitle: 'Hijab winkels Utrecht | Hoofddoeken & hijab shops',
    metaDesc: 'Vind hijab winkels in Utrecht. Vergelijk winkels en webshops voor hoofddoeken, hijabs, onderkapjes en accessoires.',
    intro: 'Utrecht is een handig vertrekpunt voor wie in het midden van Nederland hijabs en hoofddoeken zoekt. Bekijk winkels en webshops met sjaals, onderkapjes, jersey hijabs, chiffon hijabs en modest fashion.\n\nGebruik deze pagina om hijab winkels in Utrecht te vergelijken.',
    seoBlock: 'Omdat Utrecht veel bezoekers uit omliggende plaatsen aantrekt, is een duidelijke vergelijking extra waardevol. Fysieke winkels zijn interessant voor stof en kleur; webshops bieden vaak meer keuze en snelle levering.',
  },
  'abaya-shops_utrecht': {
    h1: 'Abaya winkels in Utrecht',
    seoTitle: "Abaya winkels Utrecht | Abaya's, jilbabs & meer",
    metaDesc: "Vind abaya winkels in Utrecht. Vergelijk fysieke winkels en webshops voor abaya's, jilbabs, gebedsjurken en modest fashion.",
    intro: "Zoek je abaya's in Utrecht? Op deze pagina vind je winkels en webshops met abaya's, jilbabs, gebedsjurken en bescheiden kleding voor verschillende gelegenheden.\n\nVergelijk winkels op type, categorie en bereikbaarheid.",
    seoBlock: "Voor abaya's is Utrecht vooral interessant als centraal gelegen winkelstad. Bezoekers zoeken vaak een betrouwbare optie zonder naar Amsterdam, Rotterdam of Den Haag te hoeven reizen.",
  },
  'islamitische-kleding_utrecht': {
    h1: 'Islamitische kledingwinkels in Utrecht',
    seoTitle: 'Islamitische kleding Utrecht | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in Utrecht. Vergelijk winkels en webshops voor hijabs, abaya's, qamis, jilbabs en meer.",
    intro: "Utrecht heeft winkels en webshops voor islamitische kleding, hijabs, abaya's, khimars, boeken en accessoires. Deze pagina helpt je om het aanbod overzichtelijk te vergelijken.\n\nGebruik de filters om winkels in Utrecht te bekijken op categorie en type winkel.",
    seoBlock: "Voor islamitische kleding in Utrecht is overzicht belangrijk. Het aanbod is compacter dan in sommige grotere steden, maar daardoor kan een goede directory juist veel tijd besparen.",
  },

  // ── Eindhoven (section 7.5) ──────────────────────────────────────────
  'hijab-shops_eindhoven': {
    h1: 'Hijab winkels in Eindhoven',
    seoTitle: 'Hijab winkels Eindhoven | Hoofddoeken & hijab shops',
    metaDesc: 'Vind hijab winkels in Eindhoven. Vergelijk winkels en webshops voor hijabs, hoofddoeken, sjaals en accessoires.',
    intro: 'Eindhoven is een praktisch startpunt voor wie in Zuid-Nederland hijabs, hoofddoeken en modest fashion zoekt. Bekijk winkels en webshops met jersey hijabs, chiffon sjaals, onderkapjes en accessoires.\n\nGebruik deze pagina om hijab winkels in Eindhoven te vergelijken.',
    seoBlock: 'Voor bezoekers uit Eindhoven en omgeving is het verschil tussen fysiek passen en online bestellen belangrijk. Deze pagina toont beide opties helder, zonder het aanbod groter te maken dan het is.',
  },
  'abaya-shops_eindhoven': {
    h1: 'Abaya winkels in Eindhoven',
    seoTitle: "Abaya winkels Eindhoven | Abaya's, jilbabs & meer",
    metaDesc: "Vind abaya winkels in Eindhoven. Vergelijk winkels en webshops voor abaya's, jilbabs, gebedskleding en modest fashion.",
    intro: "Op zoek naar abaya's in Eindhoven? Deze pagina verzamelt winkels en webshops met abaya's, jilbabs, gebedskleding en bescheiden mode voor dagelijks gebruik of speciale gelegenheden.\n\nVergelijk het lokale aanbod en webshops die in Eindhoven leveren.",
    seoBlock: "Abaya's online kopen is handig, maar pasvorm en lengte blijven belangrijk. Daarom is het nuttig om lokale winkels en webshops naast elkaar te zien.",
  },
  'islamitische-kleding_eindhoven': {
    h1: 'Islamitische kledingwinkels in Eindhoven',
    seoTitle: 'Islamitische kleding Eindhoven | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in Eindhoven. Vergelijk winkels en webshops voor hijabs, abaya's, qamis, jilbabs en meer.",
    intro: "Eindhoven biedt winkels en webshops voor islamitische kleding, hijabs, abaya's, gebedskleding, boeken en accessoires. Deze pagina helpt bezoekers om sneller relevante adressen en webshops te vinden.\n\nGebruik de filters om winkels in Eindhoven te vergelijken.",
    seoBlock: "Voor islamitische kleding in Eindhoven is regionale relevantie belangrijk. Bezoekers willen weten welke winkels fysiek bereikbaar zijn en welke webshops snel in Zuid-Nederland leveren.",
  },

  // ── Antwerpen (section 7.6) ──────────────────────────────────────────
  'hijab-shops_antwerpen': {
    h1: 'Hijab winkels in Antwerpen',
    seoTitle: 'Hijab winkels Antwerpen | Hoofddoeken & hijab shops',
    metaDesc: 'Vind hijab winkels in Antwerpen. Vergelijk fysieke winkels en webshops voor hoofddoeken, hijabs, sjaals en accessoires.',
    intro: 'Antwerpen is een sterke stad voor wie hijabs en hoofddoeken zoekt met gevoel voor stijl. Bekijk winkels en webshops met jersey hijabs, chiffon sjaals, onderkapjes, accessoires en modest fashion.\n\nGebruik deze pagina om hijab winkels in Antwerpen te vergelijken op locatie, aanbod en type winkel.',
    seoBlock: 'In Antwerpen mag een hijab praktisch zijn, maar ook precies de juiste afwerking hebben. Kleur, stof en combinatie met abaya of outfit spelen vaak een grote rol.',
  },
  'abaya-shops_antwerpen': {
    h1: 'Abaya winkels in Antwerpen',
    seoTitle: "Abaya winkels Antwerpen | Abaya's, jilbabs & meer",
    metaDesc: "Vind abaya winkels in Antwerpen. Vergelijk winkels en webshops voor abaya's, jilbabs, kimono-abaya's en islamitische kleding.",
    intro: "Zoek je een abaya winkel in Antwerpen? Deze pagina brengt winkels en webshops samen met abaya's, jilbabs, kimono-abaya's en bescheiden kleding voor dagelijks gebruik of speciale gelegenheden.\n\nVergelijk het aanbod op locatie, categorie en type winkel.",
    seoBlock: "Antwerpen heeft een modebewuste blik op abaya's. Naast klassieke modellen is er ruimte voor moderne snitten, subtiele details en combinaties met hijabs, kaftans of accessoires.",
  },
  'islamitische-kleding_antwerpen': {
    h1: 'Islamitische kledingwinkels in Antwerpen',
    seoTitle: 'Islamitische kleding Antwerpen | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in Antwerpen. Vergelijk winkels en webshops voor hijabs, abaya's, qamis, jilbabs en meer.",
    intro: "Antwerpen heeft een rijk aanbod voor wie islamitische kleding zoekt: hijabs, abaya's, kaftans, jilbabs, qamis, accessoires en modest fashion komen er op verschillende manieren samen.\n\nGebruik deze pagina om winkels in Antwerpen te vergelijken en snel door te klikken naar de categorie die je zoekt.",
    seoBlock: "Voor islamitische kleding in Antwerpen is de combinatie van stijl en bruikbaarheid belangrijk. Sommige winkels richten zich op dagelijkse basics, andere op feestelijke kleding of uitgesproken modest fashion.",
  },

  // ── Brussel (section 7.7) ────────────────────────────────────────────
  'hijab-shops_brussel': {
    h1: 'Hijab winkels in Brussel',
    seoTitle: 'Hijab winkels Brussel | Hoofddoeken & hijab shops',
    metaDesc: 'Vind hijab winkels in Brussel. Vergelijk winkels en webshops voor hijabs, hoofddoeken, sjaals, onderkapjes en accessoires.',
    intro: 'Brussel heeft een internationale modest-fashionmix, en dat zie je ook in het aanbod aan hijabs en hoofddoeken. Bekijk winkels en webshops met dagelijkse hijabs, sjaals, onderkapjes en accessoires.\n\nGebruik deze pagina om hijab winkels in Brussel te vergelijken.',
    seoBlock: 'In Brussel is bereikbaarheid vaak net zo belangrijk als assortiment. Bezoekers willen snel weten of een winkel fysiek bereikbaar is, of dat een webshop de betere keuze is.',
  },
  'abaya-shops_brussel': {
    h1: 'Abaya winkels in Brussel',
    seoTitle: "Abaya winkels Brussel | Abaya's, jilbabs & meer",
    metaDesc: "Vind abaya winkels in Brussel. Vergelijk winkels en webshops voor abaya's, jilbabs, gebedsjurken en islamitische kleding.",
    intro: "Op zoek naar abaya's in Brussel? Deze pagina verzamelt winkels en webshops met abaya's, jilbabs, gebedskleding en bescheiden mode voor dagelijks gebruik of een gelegenheid.\n\nVergelijk winkels op categorie, locatie en type aanbod.",
    seoBlock: "Brussel heeft een breed publiek en daardoor ook verschillende modest-fashionbehoeften. De ene bezoeker zoekt een eenvoudige abaya, de andere een feestelijker model of een combinatie met hijab en accessoires.",
  },
  'islamitische-kleding_brussel': {
    h1: 'Islamitische kledingwinkels in Brussel',
    seoTitle: 'Islamitische kleding Brussel | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in Brussel. Vergelijk winkels en webshops voor hijabs, abaya's, qamis, jilbabs en meer.",
    intro: "Brussel heeft islamitische kledingwinkels en webshops met een breed aanbod: hijabs, abaya's, jilbabs, qamis, gebedskleding, boeken en accessoires.\n\nGebruik deze pagina om winkels in Brussel te vergelijken en snel te zien welke categorie bij je zoekvraag past.",
    seoBlock: "Islamitische kleding in Brussel is veelzijdig, net als de stad zelf. Sommige winkels zijn breed georiënteerd, andere hebben een specifieker aanbod rond damesmode, abaya's of hijabs.",
  },

  // ── Gent (section 7.8) ───────────────────────────────────────────────
  'hijab-shops_gent': {
    h1: 'Hijab winkels in Gent',
    seoTitle: 'Hijab winkels Gent | Hoofddoeken & hijab shops',
    metaDesc: 'Vind hijab winkels in Gent. Vergelijk winkels en webshops voor hijabs, hoofddoeken, sjaals en accessoires.',
    intro: 'Gent heeft een kleiner maar relevant aanbod voor wie hijabs en hoofddoeken zoekt. Bekijk fysieke winkels en webshops met hijabs, sjaals, onderkapjes en modest fashion.\n\nGebruik deze pagina om hijab winkels in Gent overzichtelijk te vergelijken.',
    seoBlock: 'Voor Gent is duidelijkheid belangrijk: welke winkels zijn lokaal, welke webshops leveren in België en welke categorieën zijn echt relevant? Deze pagina beantwoordt die vragen snel.',
  },
  'abaya-shops_gent': {
    h1: 'Abaya winkels in Gent',
    seoTitle: "Abaya winkels Gent | Abaya's, jilbabs & meer",
    metaDesc: "Vind abaya winkels in Gent. Vergelijk winkels en webshops voor abaya's, jilbabs, gebedskleding en modest fashion.",
    intro: "Zoek je abaya's in Gent? Deze pagina helpt je winkels en webshops te vinden met abaya's, jilbabs, gebedskleding en bescheiden mode.\n\nVergelijk lokale opties en webshops die in Gent of heel België leveren.",
    seoBlock: "Niet elke stad heeft een groot abaya-aanbod, maar een goede selectiepagina blijft nuttig. Toon eerlijk wat beschikbaar is en maak het makkelijk om door te klikken naar bredere Belgische webshops.",
  },
  'islamitische-kleding_gent': {
    h1: 'Islamitische kledingwinkels in Gent',
    seoTitle: 'Islamitische kleding Gent | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in Gent. Vergelijk winkels en webshops voor hijabs, abaya's, qamis, jilbabs en meer.",
    intro: "Gent heeft winkels en webshops voor islamitische kleding, hijabs, abaya's, boeken, accessoires en bescheiden mode. Deze pagina helpt bezoekers om het aanbod snel te vergelijken.\n\nGebruik de filters om winkels in Gent te bekijken op categorie en type winkel.",
    seoBlock: "Voor islamitische kleding in Gent is een overzichtelijke gids waardevoller dan een lange tekst. Bezoekers zoeken vaak concreet: een winkel, een webshop of een specifieke categorie.",
  },

  // ── Charleroi (section 7.9) ──────────────────────────────────────────
  'hijab-shops_charleroi': {
    h1: 'Hijab winkels in Charleroi',
    seoTitle: 'Hijab winkels Charleroi | Hoofddoeken & hijab shops',
    metaDesc: 'Vind hijab winkels in Charleroi. Vergelijk winkels en webshops voor hijabs, hoofddoeken, sjaals en accessoires.',
    intro: 'Zoek je hijabs of hoofddoeken in Charleroi? Deze pagina helpt je om lokale winkels en Belgische webshops te vergelijken voor hijabs, sjaals, onderkapjes en accessoires.\n\nGebruik de filters om snel te zien welke opties relevant zijn voor Charleroi.',
    seoBlock: 'Voor Charleroi is het belangrijk om lokaal en online aanbod samen te tonen. Als er weinig fysieke winkels zijn, moeten Belgische webshops met levering duidelijk zichtbaar blijven.',
  },
  'abaya-shops_charleroi': {
    h1: 'Abaya winkels in Charleroi',
    seoTitle: "Abaya winkels Charleroi | Abaya's, jilbabs & meer",
    metaDesc: "Vind abaya winkels in Charleroi. Vergelijk winkels en webshops voor abaya's, jilbabs, gebedskleding en modest fashion.",
    intro: "Op zoek naar abaya's in Charleroi? Vergelijk winkels en webshops met abaya's, jilbabs, gebedskleding en bescheiden mode die lokaal relevant zijn of in België leveren.\n\nDeze pagina is bedoeld om snel overzicht te geven, ook wanneer het aanbod beperkt is.",
    seoBlock: "Bij kleinere lokale zoekopdrachten is eerlijkheid belangrijk: toon wat beschikbaar is en verwijs bezoekers naar bredere Belgische abaya-webshops wanneer dat van toepassing is.",
  },
  'islamitische-kleding_charleroi': {
    h1: 'Islamitische kledingwinkels in Charleroi',
    seoTitle: 'Islamitische kleding Charleroi | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in Charleroi. Vergelijk winkels en webshops voor hijabs, abaya's, qamis, jilbabs en meer.",
    intro: "Deze pagina verzamelt islamitische kledingwinkels en webshops die relevant zijn voor Charleroi. Denk aan hijabs, abaya's, qamis, jilbabs, gebedskleding en bescheiden mode.\n\nGebruik de filters om lokale winkels en Belgische webshops te vergelijken.",
    seoBlock: "Voor islamitische kleding in Charleroi moet de pagina vooral praktisch blijven: laat bezoekers snel zien of er lokale winkels zijn en welke webshops een goed alternatief bieden.",
  },

  // ── Luik (section 7.10) ──────────────────────────────────────────────
  'hijab-shops_luik': {
    h1: 'Hijab winkels in Luik',
    seoTitle: 'Hijab winkels Luik | Hoofddoeken & hijab shops',
    metaDesc: 'Vind hijab winkels in Luik. Vergelijk winkels en webshops voor hijabs, hoofddoeken, sjaals en accessoires.',
    intro: 'Zoek je een hijab winkel in Luik? Bekijk lokale winkels en Belgische webshops met hijabs, hoofddoeken, sjaals, onderkapjes en accessoires.\n\nGebruik deze pagina om het aanbod in Luik en online snel te vergelijken.',
    seoBlock: 'Luik bedient niet alleen de stad zelf, maar ook bezoekers uit de regio. Daarom brengt deze pagina lokale winkels en webshops met Belgische levering samen.',
  },
  'abaya-shops_luik': {
    h1: 'Abaya winkels in Luik',
    seoTitle: "Abaya winkels Luik | Abaya's, jilbabs & meer",
    metaDesc: "Vind abaya winkels in Luik. Vergelijk winkels en webshops voor abaya's, jilbabs, gebedskleding en modest fashion.",
    intro: "Op zoek naar abaya's in Luik? Deze pagina helpt je winkels en webshops te vergelijken met abaya's, jilbabs, gebedskleding en bescheiden mode.\n\nBekijk lokale opties en webshops die in België leveren.",
    seoBlock: "Voor abaya's in Luik is het belangrijk om keuze en bereikbaarheid helder te tonen. Als de lokale selectie beperkt is, kunnen Belgische webshops de pagina waardevol aanvullen.",
  },
  'islamitische-kleding_luik': {
    h1: 'Islamitische kledingwinkels in Luik',
    seoTitle: 'Islamitische kleding Luik | Winkels & webshops',
    metaDesc: "Vind islamitische kledingwinkels in Luik. Vergelijk winkels en webshops voor hijabs, abaya's, qamis, jilbabs en meer.",
    intro: "Deze pagina verzamelt islamitische kledingwinkels en webshops die relevant zijn voor Luik. Je vindt er opties voor hijabs, abaya's, qamis, jilbabs, gebedskleding en modest fashion.\n\nGebruik de filters om winkels in Luik en webshops met Belgische levering te vergelijken.",
    seoBlock: "Islamitische kleding in Luik vraagt om een pagina die helder en praktisch is: toon lokale winkels waar mogelijk, vul aan met relevante webshops en verwijs naar de bredere modest-fashionpagina voor Luik.",
  },
}

const nlCities = [
  { slug: 'amsterdam', name: 'Amsterdam' },
  { slug: 'rotterdam', name: 'Rotterdam' },
  { slug: 'den-haag', name: 'Den Haag' },
  { slug: 'utrecht', name: 'Utrecht' },
  { slug: 'eindhoven', name: 'Eindhoven' },
]
const beCities = [
  { slug: 'antwerpen', name: 'Antwerpen' },
  { slug: 'brussel', name: 'Brussel' },
  { slug: 'gent', name: 'Gent' },
  { slug: 'charleroi', name: 'Charleroi' },
  { slug: 'luik', name: 'Luik' },
]
const allCategorySlugs = ['hijab-shops', 'abaya-shops', 'islamitische-kleding']

function getInternalLinks(
  category: string,
  location: string,
  isCountry: boolean,
  countrySlug: string,
  locationName: string,
  countryName: string,
): { href: string; label: string }[] {
  const links: { href: string; label: string }[] = []
  const h1Name = categoryH1Names[category] ?? category

  if (isCountry) {
    const cities = countrySlug === 'nederland' ? nlCities : beCities
    for (const city of cities) {
      links.push({ href: `/${category}/${city.slug}`, label: `${h1Name} in ${city.name}` })
    }
    for (const cat of allCategorySlugs) {
      if (cat !== category) {
        links.push({ href: `/${cat}/${location}`, label: `${categoryH1Names[cat] ?? cat} in ${locationName}` })
      }
    }
    links.push({ href: `/modest-fashion/${location}`, label: `Modest fashion winkels in ${locationName}` })
  } else {
    for (const cat of allCategorySlugs) {
      if (cat !== category) {
        links.push({ href: `/${cat}/${location}`, label: `${categoryH1Names[cat] ?? cat} in ${locationName}` })
      }
    }
    links.push({ href: `/modest-fashion/${location}`, label: `Modest fashion winkels in ${locationName}` })
    links.push({ href: `/${category}/${countrySlug}`, label: `${h1Name} in ${countryName}` })
  }

  return links
}

type Params = {
  category: string
  location: string
}

async function getData(category: string, location: string) {
  const country = await prisma.country.findUnique({ where: { slug: location } })
  const city = await prisma.city.findUnique({
    where: { slug: location },
    include: { country: true },
  })

  if (!country && !city) return null

  const isCountry = !!country
  const locationName = isCountry ? country!.name : city!.name
  const countryCode = isCountry ? country!.code : city!.country.code

  const categoryRecord = await prisma.category.findUnique({ where: { slug: category } })

  const shops = await prisma.shop.findMany({
    where: {
      status: 'APPROVED',
      country: countryCode,
      ...(isCountry ? {} : { citySlug: location }),
      ...(categoryRecord ? { categories: { some: { categoryId: categoryRecord.id } } } : {}),
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      city: true,
      country: true,
      isPhysicalStore: true,
      isWebshop: true,
      isFeatured: true,
      logoUrl: true,
      subscriptionTier: true,
      facebookUrl: true,
      instagramUrl: true,
      pinterestUrl: true,
      youtubeUrl: true,
      tiktokUrl: true,
      googlePlaceId: true,
      googleRating: true,
      googleReviewCount: true,
      reviews: { where: { isVerified: true }, select: { score: true } },
    },
  })

  const TIER_ORDER: Record<string, number> = { GOLD: 0, SILVER: 1, BRONZE: 2 }
  const sortedShops = [...shops].sort((a, b) =>
    (TIER_ORDER[a.subscriptionTier ?? ''] ?? 3) - (TIER_ORDER[b.subscriptionTier ?? ''] ?? 3)
  )

  const relatedCities = isCountry
    ? await prisma.city.findMany({ where: { countryId: country!.id }, orderBy: { name: 'asc' } })
    : []

  return {
    isCountry,
    locationName,
    countryCode,
    shops: sortedShops,
    relatedCities,
    country: country || city?.country,
    city,
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await getData(params.category, params.location)
  if (!data) return { title: 'Niet gevonden' }

  const key = `${params.category}_${params.location}`
  const content = pageContent[key]
  const h1Name = categoryH1Names[params.category] ?? categoryNames[params.category] ?? params.category

  const title = content?.seoTitle ?? `${h1Name} in ${data.locationName} | Winkels & webshops`
  const description = content?.metaDesc ?? `Vind ${h1Name.toLowerCase()} in ${data.locationName}. Vergelijk winkels en webshops.`

  return {
    title,
    description,
    alternates: { canonical: `/${params.category}/${params.location}` },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: '/icon-512.png', width: 512, height: 512, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/icon-512.png'] },
    ...(!data.isCountry && data.shops.length < 2 && {
      robots: { index: false, follow: true },
    }),
  }
}

function generateBreadcrumbSchema(
  category: string,
  h1Name: string,
  locationName: string,
  isCountry: boolean,
  countryName?: string,
  countrySlug?: string,
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'
  const items = [
    { position: 1, name: 'Home', item: siteUrl },
    { position: 2, name: 'Winkels', item: `${siteUrl}/shops` },
  ]
  if (!isCountry && countryName && countrySlug) {
    items.push({ position: 3, name: `${h1Name} ${countryName}`, item: `${siteUrl}/${category}/${countrySlug}` })
    items.push({ position: 4, name: `${h1Name} ${locationName}`, item: `${siteUrl}/${category}/${locationName.toLowerCase()}` })
  } else {
    items.push({ position: 3, name: `${h1Name} ${locationName}`, item: `${siteUrl}/${category}/${locationName.toLowerCase()}` })
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(i => ({ '@type': 'ListItem', ...i })),
  }
}

function generateItemListSchema(shops: any[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: shops.slice(0, 10).map((shop, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Store',
        name: shop.name,
        description: shop.shortDescription,
        url: `${siteUrl}/shops/${shop.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: shop.city,
          addressCountry: shop.country,
        },
      },
    })),
  }
}

export default async function CategoryLocationPage({ params }: { params: Params }) {
  const data = await getData(params.category, params.location)
  if (!data) notFound()

  const key = `${params.category}_${params.location}`
  const content = pageContent[key]
  const h1Name = categoryH1Names[params.category] ?? categoryNames[params.category] ?? params.category
  const h1 = content?.h1 ?? `${h1Name} in ${data.locationName}`
  const introParagraphs = content?.intro?.split('\n\n') ?? []
  const seoBlockParagraphs = content?.seoBlock?.split('\n\n') ?? []
  const countrySlug = data.isCountry ? params.location : data.city?.country.slug ?? ''
  const countryName = data.isCountry ? data.locationName : data.city?.country.name ?? ''

  const internalLinks = getInternalLinks(
    params.category,
    params.location,
    data.isCountry,
    countrySlug,
    data.locationName,
    countryName,
  )

  const breadcrumbSchema = generateBreadcrumbSchema(
    params.category,
    h1Name,
    data.locationName,
    data.isCountry,
    data.city?.country.name,
    data.city?.country.slug,
  )
  const itemListSchema = data.shops.length > 0 ? generateItemListSchema(data.shops) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}

      {/* Hero header */}
      <div
        className="relative border-b"
        style={{ backgroundImage: 'url(/hero-banner.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-6xl mx-auto px-4 py-10">
          <nav className="text-sm text-white/70 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shops" className="hover:text-white">Winkels</Link>
            <span className="mx-2">/</span>
            <Link href={`/${params.category}`} className="hover:text-white">{categoryNames[params.category] ?? params.category}</Link>
            {!data.isCountry && data.city && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/${params.category}/${data.city.country.slug}`} className="hover:text-white">
                  {data.city.country.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-white">{data.locationName}</span>
          </nav>
          <h1 className="text-4xl font-bold text-white">{h1}</h1>
          <p className="text-lg text-white/80 mt-2">{data.shops.length} winkels beschikbaar</p>
        </div>
      </div>

      {/* Intro */}
      {introParagraphs.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow">
            {introParagraphs.map((p, i) => (
              <p key={i} className={`text-gray-700 leading-relaxed${i < introParagraphs.length - 1 ? ' mb-4' : ''}`}>
                {p}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Cities (country pages only) */}
      {data.isCountry && data.relatedCities.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {h1Name} per stad in {data.locationName}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.relatedCities.map(city => (
              <Link
                key={city.id}
                href={`/${params.category}/${city.slug}`}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <p className="font-semibold text-gray-900">{h1Name} {city.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Shop listings */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {data.shops.length > 0
            ? `Alle ${h1} (${data.shops.length})`
            : h1}
        </h2>
        {data.shops.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-600">
            <p className="mb-4">We zijn nog bezig met het toevoegen van winkels in {data.locationName}.</p>
            <p className="mb-6">Heb je een winkel? Meld je gratis aan en bereik duizenden potentiële klanten.</p>
            <Link href="/aanmelden" className="btn-primary">Winkel aanmelden</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.shops.map(shop => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>

      {/* SEO block */}
      {seoBlockParagraphs.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{h1Name} in {data.locationName}</h2>
            {seoBlockParagraphs.map((p, i) => (
              <p key={i} className={`text-gray-700 leading-relaxed${i < seoBlockParagraphs.length - 1 ? ' mb-4' : ''}`}>
                {p}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Internal links */}
      {internalLinks.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Meer winkels ontdekken</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {internalLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Heb je een winkel in {data.locationName}?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Meld je winkel aan bij ModestDirectory en bereik duizenden potentiële klanten die zoeken naar {h1Name.toLowerCase()} in {data.locationName}.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/aanmelden" className="btn-primary">Winkel aanmelden</Link>
            <Link href="/shops" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-white transition bg-white/50">
              Alle winkels bekijken
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
