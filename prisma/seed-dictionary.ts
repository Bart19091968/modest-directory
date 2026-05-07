import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function toHtml(text: string): string {
  return text
    .trim()
    .split(/\n\n+/)
    .map(p => `<p>${p.trim().replace(/\n/g, ' ')}</p>`)
    .join('\n')
}

const terms = [
  {
    term: 'Hijab',
    slug: 'hijab',
    arabic: 'حجاب',
    category: 'Hoofdbedekking',
    aliases: ['Hijaab', 'Hoofddoek', 'Hijab scarf', 'Muslim headscarf'],
    transliterationVariants: ['hijaab', 'hidjab', 'hijab scarf'],
    shortDefinition: 'Een hijab is een hoofddoek of hoofdbedekking die door veel moslimvrouwen wordt gedragen en binnen modest fashion in verschillende stijlen, stoffen en kleuren voorkomt.',
    longDefinition: toHtml(`Een hijab is een hoofddoek of hoofdbedekking die door veel moslimvrouwen wordt gedragen. In modest fashion verwijst het woord vaak naar de sjaal of doek die rond het hoofd, de hals en soms de schouders wordt gestyled. De hijab bestaat in veel vormen: van eenvoudige jersey hijabs voor elke dag tot chiffon, modal of satijnen varianten voor meer geklede looks.

De hijab is niet één vast model. Sommige vrouwen dragen hem strak en praktisch, anderen kiezen voor een losser silhouet met zachte plooien. Ook de stof bepaalt veel: jersey blijft goed zitten, chiffon oogt luchtig en elegant, modal voelt soepel en modern.

Op ModestDirectory wordt de term hijab gebruikt voor winkels en webshops die hoofddoeken, onderkapjes, hijab pins, magneten en verwante modest fashion-accessoires aanbieden.`),
    relatedTermSlugs: ['khimar', 'undercap', 'chiffon-hijab', 'jersey-hijab'],
    relatedCategoryLinks: [
      { label: 'Hijab winkels in Nederland', href: '/hijab-shops/nederland', type: 'category' },
      { label: 'Hijab winkels in België', href: '/hijab-shops/belgie', type: 'category' },
      { label: 'Modest fashion winkels in Nederland', href: '/modest-fashion/nederland', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een hijab? Betekenis, stijlen en hoofddoek uitleg | ModestDirectory',
    seoDescription: 'Ontdek wat een hijab is, hoe hij gedragen wordt en welke stijlen, stoffen en winkels relevant zijn voor hoofddoeken en modest fashion.',
    isFeatured: true,
  },
  {
    term: 'Abaya',
    slug: 'abaya',
    arabic: 'عباية',
    category: 'Kledingstukken',
    aliases: ['Abaya jurk', 'Abaja', 'Open abaya'],
    transliterationVariants: ['abaja', 'abaaya', 'abayah'],
    shortDefinition: 'Een abaya is een lange, ruimvallende jurk of mantel die vaak wordt gedragen als onderdeel van een bescheiden of islamitische kledingstijl.',
    longDefinition: toHtml(`Een abaya is een lang, ruimvallend kledingstuk dat meestal tot aan de enkels reikt. Traditioneel is de abaya eenvoudig en vaak zwart, maar in de hedendaagse modest fashion bestaat ze in veel variaties: open abaya's, kimono abaya's, geborduurde modellen, lichte zomerstoffen en luxere uitvoeringen voor gelegenheden zoals Eid of bruiloften.

De kracht van de abaya zit in haar eenvoud. Ze bedekt veel, maar kan tegelijk elegant en modebewust ogen. Een dagelijkse abaya wordt vaak gecombineerd met een praktische hijab en comfortabele schoenen, terwijl een feestelijke abaya meer detail kan hebben in de mouwen, stof of afwerking.

Op ModestDirectory vind je abaya winkels en webshops waar bezoekers verschillende stijlen kunnen ontdekken, van basic modellen tot meer uitgesproken ontwerpen.`),
    relatedTermSlugs: ['jilbab', 'kimono-abaya', 'open-abaya', 'modest-fashion'],
    relatedCategoryLinks: [
      { label: 'Abaya winkels in Nederland', href: '/abaya-shops/nederland', type: 'category' },
      { label: 'Abaya winkels in België', href: '/abaya-shops/belgie', type: 'category' },
      { label: 'Modest fashion winkels', href: '/modest-fashion/nederland', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een abaya? Betekenis, stijlen en verschil met jilbab | ModestDirectory',
    seoDescription: 'Lees wat een abaya is, welke stijlen er bestaan en waar je abaya winkels en modest fashion webshops kunt vinden.',
    isFeatured: true,
  },
  {
    term: 'Khimar',
    slug: 'khimar',
    arabic: 'خمار',
    category: 'Hoofdbedekking',
    aliases: ['Gimaar', 'Khimaar', 'Lange hoofddoek'],
    transliterationVariants: ['khimaar', 'kimar', 'gimaar'],
    shortDefinition: 'Een khimar is een ruimvallende hoofdbedekking die meestal over het hoofd, de schouders, borst en rug valt.',
    longDefinition: toHtml(`Een khimar is een ruimvallende hoofdbedekking die meer bedekking biedt dan een gewone hijab. Waar een hijab vaak als sjaal rond het hoofd en de hals wordt gewikkeld, valt een khimar meestal losser over het hoofd, de schouders, borst en rug.

De khimar wordt vaak gekozen door vrouwen die een vloeiend, rustig silhouet willen. Hij bestaat in korte, middellange en lange modellen en wordt soms gecombineerd met een abaya, jilbab of lange jurk. In moderne modest fashion zijn er khimars in lichte stoffen, zachte kleuren en praktische modellen die geschikt zijn voor dagelijks gebruik.

Het verschil tussen een khimar en een hijab zit vooral in vorm en bedekking: een khimar is meestal een voorgevormd of ruimvallend kledingstuk, terwijl een hijab vaak een losse doek is.`),
    relatedTermSlugs: ['hijab', 'jilbab', 'abaya', 'undercap'],
    relatedCategoryLinks: [
      { label: 'Hijab winkels in Nederland', href: '/hijab-shops/nederland', type: 'category' },
      { label: 'Islamitische kledingwinkels in België', href: '/islamitische-kleding/belgie', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een khimar? Betekenis en verschil met hijab | ModestDirectory',
    seoDescription: 'Ontdek wat een khimar is, hoe hij gedragen wordt en waarin hij verschilt van een hijab, jilbab of abaya.',
    isFeatured: true,
  },
  {
    term: 'Jilbab',
    slug: 'jilbab',
    arabic: 'جلباب',
    category: 'Kledingstukken',
    aliases: ['Djilbab', 'Jilbaab', 'Lange islamitische jurk'],
    transliterationVariants: ['jilbaab', 'djilbab', 'jelbab'],
    shortDefinition: 'Een jilbab is een lang, bedekkend kledingstuk dat vaak als ruimvallende jurk of set wordt gedragen binnen islamitische kleding.',
    longDefinition: toHtml(`Een jilbab is een lang en ruimvallend kledingstuk dat veel bedekking biedt. Afhankelijk van de stijl kan het lijken op een lange jurk, een tweedelige set of een kledingstuk dat samen met een hoofdbedekking wordt gedragen. De jilbab wordt vaak gekozen om zijn praktische bedekking en eenvoudige silhouet.

In modest fashion wordt de term soms anders gebruikt per land of winkel. Bij sommige merken verwijst jilbab naar een volledige set, bij andere naar een lange jurk of mantel. Daarom is het nuttig om bij winkels altijd goed te kijken naar foto's, pasvorm en productomschrijving.

Het verschil met een abaya is niet altijd scherp, maar meestal is een abaya meer een mantel of lange jurk, terwijl een jilbab vaker wordt gezien als een vollediger bedekkend kledingstuk of set.`),
    relatedTermSlugs: ['abaya', 'khimar', 'hijab'],
    relatedCategoryLinks: [
      { label: 'Islamitische kledingwinkels in Nederland', href: '/islamitische-kleding/nederland', type: 'category' },
      { label: 'Abaya winkels in België', href: '/abaya-shops/belgie', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een jilbab? Betekenis en verschil met abaya | ModestDirectory',
    seoDescription: 'Lees wat een jilbab is, hoe het gedragen wordt en wat het verschil is met een abaya, khimar of hijab.',
    isFeatured: true,
  },
  {
    term: 'Qamis',
    slug: 'qamis',
    arabic: 'قميص',
    category: 'Herenkleding',
    aliases: ['Kamis', 'Thobe', 'Jubba', 'Islamitische herenjurk'],
    transliterationVariants: ['kamis', 'quamis', 'qamees', 'thobe'],
    shortDefinition: 'Een qamis is een lang, ruimvallend kledingstuk voor mannen, vaak gedragen binnen islamitische of traditionele kledingstijlen.',
    longDefinition: toHtml(`Een qamis is een lang, ruimvallend kledingstuk voor mannen. Het lijkt op een lange tuniek of jurk en wordt in verschillende landen onder andere namen gedragen, zoals thobe, jubba of kandura. De qamis wordt vaak gekozen voor gebed, feestdagen, dagelijkse kleding of formele gelegenheden.

Er bestaan eenvoudige katoenen modellen, maar ook luxere qamis met borduurwerk, knopen, stevige kragen of fijne afwerking. In Europese modest fashion webshops wordt qamis vaak aangeboden naast hijabs, abaya's, islamitische kinderkleding en gebedskleding.

Voor bezoekers van ModestDirectory is qamis vooral relevant binnen islamitische herenkleding en winkels die een breder aanbod hebben dan alleen damesmode.`),
    relatedTermSlugs: ['modest-fashion'],
    relatedCategoryLinks: [
      { label: 'Islamitische kledingwinkels in Nederland', href: '/islamitische-kleding/nederland', type: 'category' },
      { label: 'Islamitische kledingwinkels in België', href: '/islamitische-kleding/belgie', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een qamis? Betekenis van qamis, thobe en jubba | ModestDirectory',
    seoDescription: 'Ontdek wat een qamis is, hoe het gedragen wordt en welke islamitische kledingwinkels qamis en herenkleding aanbieden.',
    isFeatured: false,
  },
  {
    term: 'Undercap',
    slug: 'undercap',
    arabic: null,
    category: 'Accessoires',
    aliases: ['Onderkapje', 'Hijab cap', 'Bonnet'],
    transliterationVariants: ['under cap', 'onderkap', 'hijabcap'],
    shortDefinition: 'Een undercap is een onderkapje dat onder de hijab wordt gedragen om haar op zijn plaats te houden en de hoofddoek beter te laten zitten.',
    longDefinition: toHtml(`Een undercap, ook wel onderkapje genoemd, wordt onder de hijab gedragen. Het helpt om het haar op zijn plaats te houden en zorgt ervoor dat de hijab minder snel verschuift. Vooral bij gladde stoffen zoals chiffon of satijn kan een undercap het verschil maken tussen een look die blijft zitten en een hijab die de hele dag gecorrigeerd moet worden.

Undercaps bestaan in verschillende vormen: buisvormige modellen, tie-back modellen, katoenen kapjes en zachte varianten die minder druk geven rond het hoofd. De keuze hangt af van comfort, haarstijl en de stof van de hijab.`),
    relatedTermSlugs: ['hijab', 'chiffon-hijab', 'hijab-magnet'],
    relatedCategoryLinks: [
      { label: 'Hijab winkels in Nederland', href: '/hijab-shops/nederland', type: 'category' },
      { label: 'Hijab winkels in België', href: '/hijab-shops/belgie', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een undercap? Onderkapje voor onder je hijab uitgelegd | ModestDirectory',
    seoDescription: 'Lees wat een undercap of onderkapje is, waarom je het onder een hijab draagt en welke varianten er bestaan.',
    isFeatured: false,
  },
  {
    term: 'Chiffon hijab',
    slug: 'chiffon-hijab',
    arabic: null,
    category: 'Stoffen',
    aliases: ['Chiffon hoofddoek', 'Chiffon scarf'],
    transliterationVariants: ['chiffon hoofddoek', 'chiffon hijabs'],
    shortDefinition: 'Een chiffon hijab is een lichte, elegante hoofddoek van een fijne, transparante stof die vaak wordt gekozen voor geklede looks.',
    longDefinition: toHtml(`Een chiffon hijab is een hoofddoek van een lichte, fijne stof met een elegante uitstraling. Chiffon valt luchtig en soepel, waardoor het populair is voor feestelijke outfits, bruiloften, Eid en momenten waarop een hijab net iets verfijnder mag ogen.

Omdat chiffon gladder is dan jersey of katoen, wordt het vaak gedragen met een undercap, hijab pins of magneten. De stof blijft minder vanzelf zitten, maar geeft wel een zachte en stijlvolle afwerking aan een outfit.

Chiffon hijabs zijn verkrijgbaar in neutrale kleuren, pastels en diepe tinten zoals navy, bordeaux of emerald. Ze passen goed bij abaya's, jurken en meer formele modest fashion looks.`),
    relatedTermSlugs: ['hijab', 'undercap', 'hijab-magnet', 'jersey-hijab'],
    relatedCategoryLinks: [
      { label: 'Hijab winkels in Nederland', href: '/hijab-shops/nederland', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een chiffon hijab? Lichte hoofddoekstof uitgelegd | ModestDirectory',
    seoDescription: 'Ontdek wat een chiffon hijab is, wanneer je deze stof kiest en hoe je chiffon hoofddoeken mooi en praktisch draagt.',
    isFeatured: false,
  },
  {
    term: 'Jersey hijab',
    slug: 'jersey-hijab',
    arabic: null,
    category: 'Stoffen',
    aliases: ['Jersey hoofddoek', 'Stretch hijab'],
    transliterationVariants: ['jersey hoofddoek', 'jersey hijabs'],
    shortDefinition: 'Een jersey hijab is een zachte, rekbare hoofddoek die goed blijft zitten en vaak wordt gekozen voor dagelijks gebruik.',
    longDefinition: toHtml(`Een jersey hijab is een hoofddoek van een zachte, rekbare stof. De stof voelt comfortabel aan, valt soepel en blijft meestal goed zitten zonder veel pins of correcties. Daarom is jersey populair voor dagelijkse looks, werk, studie en reizen.

Waar chiffon vooral elegant en luchtig oogt, voelt jersey praktischer en iets sportiever. De stof beweegt mee, geeft voldoende grip en is vaak minder transparant. Voor veel vrouwen is een jersey hijab een betrouwbare basis in de garderobe.

Jersey hijabs bestaan in lichte en zwaardere varianten. Een dunne jersey is prettig in de lente of zomer, terwijl een dikkere jersey meer structuur geeft in koudere maanden.`),
    relatedTermSlugs: ['hijab', 'chiffon-hijab', 'modal-hijab'],
    relatedCategoryLinks: [
      { label: 'Hijab winkels in België', href: '/hijab-shops/belgie', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een jersey hijab? Comfortabele hoofddoekstof uitgelegd | ModestDirectory',
    seoDescription: 'Lees wat een jersey hijab is, waarom deze stof goed blijft zitten en wanneer je voor jersey kiest in plaats van chiffon of modal.',
    isFeatured: false,
  },
  {
    term: 'Modal hijab',
    slug: 'modal-hijab',
    arabic: null,
    category: 'Stoffen',
    aliases: ['Modal hoofddoek', 'Modal scarf'],
    transliterationVariants: ['modal hijabs', 'modal hoofddoek'],
    shortDefinition: 'Een modal hijab is een soepele, zachte hoofddoekstof die bekendstaat om comfort, een matte uitstraling en een moderne drape.',
    longDefinition: toHtml(`Een modal hijab is een hoofddoek van een zachte, soepele stof die comfortabel aanvoelt en mooi valt. Modal heeft vaak een matte, rustige uitstraling en wordt in modest fashion gewaardeerd omdat het minder formeel oogt dan chiffon, maar verfijnder kan aanvoelen dan eenvoudige katoen.

De stof is geschikt voor dagelijkse outfits, minimalistische looks en capsule wardrobes. Modal hijabs worden vaak gekozen in neutrale tinten zoals taupe, beige, bruin, grijs en zwart, maar bestaan ook in zachte seizoenskleuren.`),
    relatedTermSlugs: ['hijab', 'jersey-hijab', 'chiffon-hijab'],
    relatedCategoryLinks: [
      { label: 'Hijab winkels in Nederland', href: '/hijab-shops/nederland', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een modal hijab? Zachte hoofddoekstof uitgelegd | ModestDirectory',
    seoDescription: 'Ontdek wat een modal hijab is, waarom deze stof populair is en hoe modal verschilt van jersey en chiffon.',
    isFeatured: false,
  },
  {
    term: 'Instant hijab',
    slug: 'instant-hijab',
    arabic: null,
    category: 'Hoofdbedekking',
    aliases: ['Ready-to-wear hijab', 'Voorgevormde hijab', 'Praktische hijab'],
    transliterationVariants: ['instant hoofddoek', 'ready to wear hijab'],
    shortDefinition: 'Een instant hijab is een voorgevormde of gemakkelijk aan te trekken hijab die weinig styling nodig heeft.',
    longDefinition: toHtml(`Een instant hijab is een hijab die ontworpen is om snel en eenvoudig te dragen. In plaats van een losse doek volledig te wikkelen en vast te zetten, heeft een instant hijab vaak een voorgevormde pasvorm of een model dat direct over het hoofd kan worden aangetrokken.

Instant hijabs zijn populair bij wie comfort en snelheid belangrijk vindt: voor school, werk, sport, reizen of drukke ochtenden. Ze zijn er in eenvoudige jersey modellen, sportieve varianten en meer geklede uitvoeringen.`),
    relatedTermSlugs: ['hijab', 'undercap', 'jersey-hijab'],
    relatedCategoryLinks: [
      { label: 'Hijab winkels in Nederland', href: '/hijab-shops/nederland', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een instant hijab? Voorgevormde hijab uitgelegd | ModestDirectory',
    seoDescription: 'Lees wat een instant hijab is, wanneer dit model handig is en hoe het verschilt van een gewone losse hijab.',
    isFeatured: false,
  },
  {
    term: 'Kimono abaya',
    slug: 'kimono-abaya',
    arabic: null,
    category: 'Kledingstukken',
    aliases: ['Open kimono abaya', 'Kimono style abaya'],
    transliterationVariants: ['kimono abaja', 'kimono abayah'],
    shortDefinition: 'Een kimono abaya is een abaya met een los, open of kimono-achtig silhouet, vaak gedragen als elegante laag over een outfit.',
    longDefinition: toHtml(`Een kimono abaya is een abaya met een losvallende snit die doet denken aan een kimono. Vaak wordt ze open gedragen over een jurk, rok of broek, waardoor ze meer als stijlvolle bovenlaag functioneert dan als volledig gesloten jurk.

Deze stijl is populair in moderne modest fashion omdat hij gemakkelijk te combineren is. Een eenvoudige outfit wordt meteen gekleder door een kimono abaya in satijn, crêpe, linnenmix of een stof met subtiele structuur.`),
    relatedTermSlugs: ['abaya', 'open-abaya', 'modest-fashion'],
    relatedCategoryLinks: [
      { label: 'Abaya winkels in Nederland', href: '/abaya-shops/nederland', type: 'category' },
      { label: 'Abaya winkels in België', href: '/abaya-shops/belgie', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een kimono abaya? Open abaya stijl uitgelegd | ModestDirectory',
    seoDescription: 'Ontdek wat een kimono abaya is, hoe je deze open abaya draagt en waarom dit model populair is binnen modest fashion.',
    isFeatured: false,
  },
  {
    term: 'Open abaya',
    slug: 'open-abaya',
    arabic: null,
    category: 'Kledingstukken',
    aliases: ['Open abaja', 'Abaya mantel'],
    transliterationVariants: ['open abaja', 'open abayah'],
    shortDefinition: 'Een open abaya is een abaya die aan de voorkant open valt en vaak als lange mantel over een outfit wordt gedragen.',
    longDefinition: toHtml(`Een open abaya is een lange, ruimvallende mantel die aan de voorkant open blijft. Ze wordt vaak gedragen over een jurk, rok, broek of inner dress. Daardoor voelt ze lichter en flexibeler dan een volledig gesloten abaya.

Open abaya's zijn populair voor gelegenheden waarbij laagjes mooi werken: Eid, bruiloften, etentjes of dagelijkse outfits die iets gekleder mogen ogen. De stijl kan minimalistisch zijn, maar ook rijk afgewerkt met borduurwerk, satijnranden of wijde mouwen.`),
    relatedTermSlugs: ['abaya', 'kimono-abaya', 'inner-dress'],
    relatedCategoryLinks: [
      { label: 'Abaya winkels in Nederland', href: '/abaya-shops/nederland', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een open abaya? Lange abaya mantel uitgelegd | ModestDirectory',
    seoDescription: 'Lees wat een open abaya is, hoe je deze draagt en hoe dit model verschilt van een gesloten abaya of kimono abaya.',
    isFeatured: false,
  },
  {
    term: 'Inner dress',
    slug: 'inner-dress',
    arabic: null,
    category: 'Kledingstukken',
    aliases: ['Onderjurk', 'Abaya onderjurk', 'Slip dress'],
    transliterationVariants: ['innerdress', 'onderjurk'],
    shortDefinition: 'Een inner dress is een eenvoudige onderjurk die onder een open abaya, kimono abaya of transparante laag wordt gedragen.',
    longDefinition: toHtml(`Een inner dress is een basisjurk die onder een open abaya of kimono abaya wordt gedragen. Ze zorgt voor bedekking en vormt de rustige laag waarover een meer uitgesproken abaya, mantel of kimono valt.

Inner dresses zijn meestal eenvoudig van snit, zonder veel details. Daardoor zijn ze ideaal als basisstuk in een modest wardrobe. Ze bestaan in neutrale kleuren zoals zwart, beige, crème, bruin en grijs, maar ook in feestelijke stoffen voor speciale gelegenheden.`),
    relatedTermSlugs: ['open-abaya', 'kimono-abaya', 'abaya'],
    relatedCategoryLinks: [
      { label: 'Abaya winkels in België', href: '/abaya-shops/belgie', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een inner dress? Onderjurk voor abaya\'s uitgelegd | ModestDirectory',
    seoDescription: 'Ontdek wat een inner dress is en waarom deze onderjurk vaak wordt gecombineerd met open abaya\'s en kimono abaya\'s.',
    isFeatured: false,
  },
  {
    term: 'Hijab magnet',
    slug: 'hijab-magnet',
    arabic: null,
    category: 'Accessoires',
    aliases: ['Hijab magneet', 'Hoofddoek magneet', 'Magnet pin'],
    transliterationVariants: ['hijab magneet', 'hijab magnets'],
    shortDefinition: 'Een hijab magnet is een kleine magneet die wordt gebruikt om een hijab vast te zetten zonder stof te beschadigen.',
    longDefinition: toHtml(`Een hijab magnet is een kleine magneet waarmee je een hijab kunt vastzetten zonder een traditionele pin door de stof te steken. Dat is vooral handig bij delicate stoffen zoals chiffon, satijn of modal, waar gaatjes of haaltjes sneller zichtbaar worden.

Hijab magneten bestaan meestal uit twee magnetische delen die de stof op hun plaats houden. Ze worden gebruikt onder de kin, aan de zijkant of op andere punten waar de hijab extra steun nodig heeft.`),
    relatedTermSlugs: ['hijab', 'chiffon-hijab', 'undercap'],
    relatedCategoryLinks: [
      { label: 'Hijab winkels in Nederland', href: '/hijab-shops/nederland', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een hijab magnet? Hoofddoek magneet uitgelegd | ModestDirectory',
    seoDescription: 'Lees wat een hijab magnet is, hoe je een hoofddoekmagneet gebruikt en waarom het handig is bij chiffon of satijnen hijabs.',
    isFeatured: false,
  },
  {
    term: 'Niqab',
    slug: 'niqab',
    arabic: 'نقاب',
    category: 'Hoofdbedekking',
    aliases: ['Gezichtssluier', 'Face veil'],
    transliterationVariants: ['niqaab', 'nikab'],
    shortDefinition: 'Een niqab is een gezichtssluier die een deel van het gezicht bedekt, meestal in combinatie met andere bedekkende kleding.',
    longDefinition: toHtml(`Een niqab is een gezichtssluier die een deel van het gezicht bedekt. De exacte vorm kan verschillen, maar meestal blijven de ogen zichtbaar. De niqab wordt gedragen door sommige moslimvrouwen als onderdeel van een meer bedekkende kledingstijl.

Binnen een modest fashion woordenboek is het belangrijk om de term rustig en feitelijk uit te leggen. Een niqab is niet hetzelfde als een hijab: een hijab verwijst meestal naar een hoofddoek, terwijl een niqab specifiek betrekking heeft op gezichtsbedekking.`),
    relatedTermSlugs: ['hijab', 'khimar', 'jilbab'],
    relatedCategoryLinks: [
      { label: 'Islamitische kledingwinkels in Nederland', href: '/islamitische-kleding/nederland', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een niqab? Betekenis en verschil met hijab | ModestDirectory',
    seoDescription: 'Ontdek wat een niqab is en hoe deze gezichtssluier verschilt van een hijab, khimar of jilbab.',
    isFeatured: false,
  },
  {
    term: 'Burkini',
    slug: 'burkini',
    arabic: null,
    category: 'Kledingstukken',
    aliases: ['Modest swimwear', 'Bescheiden zwemkleding', 'Islamitische zwemkleding'],
    transliterationVariants: ['burkini swimwear', 'burqini'],
    shortDefinition: 'Een burkini is bedekkende zwemkleding die ontworpen is voor vrouwen die ook tijdens het zwemmen een modest kledingstijl willen aanhouden.',
    longDefinition: toHtml(`Een burkini is bedekkende zwemkleding die meestal bestaat uit een lange top, broek en hoofdbedekking. Het kledingstuk is ontworpen voor vrouwen die willen zwemmen of sporten aan het water zonder hun voorkeur voor bedekkende kleding los te laten.

Moderne burkini's zijn vaak gemaakt van sneldrogende, lichte zwemstoffen. Ze bestaan in sportieve en meer elegante modellen, van eenvoudige effen sets tot ontwerpen met kleurvlakken of subtiele prints.`),
    relatedTermSlugs: ['modest-fashion', 'hijab', 'sport-hijab'],
    relatedCategoryLinks: [
      { label: 'Modest fashion winkels in Nederland', href: '/modest-fashion/nederland', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een burkini? Modest swimwear uitgelegd | ModestDirectory',
    seoDescription: 'Lees wat een burkini is, hoe deze bedekkende zwemkleding werkt en waar modest swimwear binnen islamitische mode past.',
    isFeatured: false,
  },
  {
    term: 'Sport hijab',
    slug: 'sport-hijab',
    arabic: null,
    category: 'Hoofdbedekking',
    aliases: ['Sporthoofddoek', 'Sports hijab', 'Active hijab'],
    transliterationVariants: ['sport hoofddoek', 'sports hijab'],
    shortDefinition: 'Een sport hijab is een praktische, lichte hoofdbedekking die ontworpen is voor beweging, training en actieve momenten.',
    longDefinition: toHtml(`Een sport hijab is een hijab die speciaal ontworpen is voor beweging. De stof is meestal licht, ademend en blijft goed zitten zonder veel spelden of styling. Daardoor is een sport hijab handig voor fitness, hardlopen, teamsporten, wandelen of reizen.

In tegenstelling tot een chiffon of satijnen hijab draait het bij een sport hijab minder om drape en meer om comfort, veiligheid en stabiliteit. Veel modellen zijn voorgevormd en vallen soepel rond hoofd en hals.`),
    relatedTermSlugs: ['hijab', 'instant-hijab', 'burkini'],
    relatedCategoryLinks: [
      { label: 'Hijab winkels in Nederland', href: '/hijab-shops/nederland', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een sport hijab? Hoofddoek voor sporten uitgelegd | ModestDirectory',
    seoDescription: 'Ontdek wat een sport hijab is, wanneer je deze draagt en waarom het model handig is voor beweging en training.',
    isFeatured: false,
  },
  {
    term: 'Modest fashion',
    slug: 'modest-fashion',
    arabic: null,
    category: 'Stijlen',
    aliases: ['Bescheiden mode', 'Islamic fashion', 'Islamitische mode'],
    transliterationVariants: ['modest kleding', 'bescheiden fashion'],
    shortDefinition: 'Modest fashion is mode die stijl combineert met meer bedekking, vaak via langere lijnen, lossere silhouetten en bewuste styling.',
    longDefinition: toHtml(`Modest fashion betekent letterlijk bescheiden mode. Het verwijst naar kledingstijlen die meer bedekking bieden, zonder dat stijl of persoonlijkheid verdwijnt. Denk aan langere rokken, wijde broeken, abaya's, tunieken, hoofddoeken, laagjes en silhouetten die niet te strak of onthullend zijn.

Voor sommige vrouwen is modest fashion religieus gemotiveerd, voor anderen draait het om comfort, elegantie of persoonlijke smaak. De kracht van modest fashion is dat het niet één vaste look is. Het kan minimalistisch, klassiek, kleurrijk, sportief of luxueus zijn.

Op ModestDirectory gebruiken we de term voor winkels, webshops en merken die hijabs, abaya's, islamitische kleding en bescheiden mode aanbieden.`),
    relatedTermSlugs: ['hijab', 'abaya', 'khimar', 'jilbab'],
    relatedCategoryLinks: [
      { label: 'Modest fashion winkels in Nederland', href: '/modest-fashion/nederland', type: 'category' },
      { label: 'Modest fashion winkels in België', href: '/modest-fashion/belgie', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is modest fashion? Betekenis van bescheiden mode | ModestDirectory',
    seoDescription: 'Lees wat modest fashion betekent en hoe bescheiden mode zich vertaalt naar hijabs, abaya\'s, langere silhouetten en moderne styling.',
    isFeatured: true,
  },
  {
    term: 'Kaftan',
    slug: 'kaftan',
    arabic: 'قفطان',
    category: 'Kledingstukken',
    aliases: ['Caftan', 'Marokkaanse kaftan'],
    transliterationVariants: ['caftan', 'kaftaan'],
    shortDefinition: 'Een kaftan is een lang, vaak feestelijk kledingstuk dat in verschillende culturen wordt gedragen en binnen modest fashion populair is voor gelegenheden.',
    longDefinition: toHtml(`Een kaftan is een lang kledingstuk met een losse pasvorm, vaak rijk afgewerkt met borduurwerk, knopen of decoratieve details. De kaftan komt in verschillende culturen voor en is onder meer bekend binnen Marokkaanse mode.

Binnen modest fashion wordt de kaftan vaak gedragen voor bruiloften, Eid, familiefeesten of andere gelegenheden. De stijl kan traditioneel zijn, maar ook modern geïnterpreteerd met minimalistische lijnen, zachte stoffen en eigentijdse kleuren.`),
    relatedTermSlugs: ['abaya', 'modest-fashion', 'eid-outfit'],
    relatedCategoryLinks: [
      { label: 'Islamitische kledingwinkels in België', href: '/islamitische-kleding/belgie', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een kaftan? Betekenis en gebruik binnen modest fashion | ModestDirectory',
    seoDescription: 'Ontdek wat een kaftan is, wanneer dit feestelijke kledingstuk wordt gedragen en hoe het past binnen modest fashion.',
    isFeatured: false,
  },
  {
    term: 'Eid outfit',
    slug: 'eid-outfit',
    arabic: 'عيد',
    category: 'Gelegenheden',
    aliases: ['Eid kleding', 'Suikerfeest outfit', 'Feestelijke islamitische kleding'],
    transliterationVariants: ['aid outfit', 'eid kleding', 'suikerfeest kleding'],
    shortDefinition: 'Een Eid outfit is een feestelijke outfit die wordt gedragen tijdens Eid, vaak met een abaya, kaftan, jurk, qamis of stijlvolle modest fashion look.',
    longDefinition: toHtml(`Een Eid outfit is de kleding die wordt gekozen voor Eid, de islamitische feestdag na Ramadan of tijdens Eid al-Adha. Voor vrouwen kan dat een abaya, kaftan, lange jurk of elegante modest fashion look zijn. Voor mannen kan het een qamis, thobe of geklede outfit zijn.

Een Eid look is vaak net iets feestelijker dan dagelijkse kleding: rijkere stoffen, zachtere kleuren, borduurwerk, sieraden of een zorgvuldig gekozen hijab. Toch hoeft een Eid outfit niet overdreven te zijn. Veel mensen kiezen juist voor kleding die ze na Eid ook nog kunnen dragen.`),
    relatedTermSlugs: ['abaya', 'kaftan', 'qamis', 'hijab'],
    relatedCategoryLinks: [
      { label: 'Modest fashion winkels in Nederland', href: '/modest-fashion/nederland', type: 'category' },
      { label: 'Abaya winkels in België', href: '/abaya-shops/belgie', type: 'category' },
    ],
    relatedBlogLinks: [],
    seoTitle: 'Wat is een Eid outfit? Feestelijke modest fashion uitgelegd | ModestDirectory',
    seoDescription: 'Lees wat een Eid outfit is en welke kledingstukken zoals abaya\'s, kaftans, hijabs en qamis vaak voor Eid worden gekozen.',
    isFeatured: false,
  },
]

async function main() {
  console.log('Seeding dictionary terms...')

  for (const term of terms) {
    await prisma.dictionaryTerm.upsert({
      where: { slug: term.slug },
      update: {
        ...term,
        isPublished: true,
        publishedAt: new Date('2026-05-07'),
      },
      create: {
        ...term,
        isPublished: true,
        publishedAt: new Date('2026-05-07'),
      },
    })
    console.log(`  ✓ ${term.term}`)
  }

  console.log(`\nDone! Seeded ${terms.length} dictionary terms.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
