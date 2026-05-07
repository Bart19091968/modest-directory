import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const FOOTER_NL_BE = `<p>Ontdek meer winkels en webshops via ModestDirectory: bekijk <a href="/modest-fashion/nederland">modest fashion winkels in Nederland</a>, <a href="/modest-fashion/belgie">modest fashion winkels in België</a>, <a href="/hijab-shops/nederland">hijab winkels in Nederland</a>, <a href="/abaya-shops/nederland">abaya winkels in Nederland</a> en <a href="/islamitische-kleding/nederland">islamitische kledingwinkels in Nederland en België</a>.</p>`

const posts = [
  {
    slug: 'abaya-als-stadsjas',
    title: 'De abaya als stadsjas',
    excerpt: 'De abaya wordt vaak als traditioneel kledingstuk beschreven, maar in de stad functioneert ze steeds vaker als jas, laag en statement tegelijk.',
    metaTitle: 'De abaya als stadsjas | ModestDirectory',
    metaDesc: 'Abaya styling voor dagelijks gebruik: hoe de abaya steeds vaker functioneert als elegante stadsjas binnen modest fashion.',
    tags: ['modest fashion', 'abaya', 'Nederland', 'België', 'Eid'],
    publishedAt: new Date('2026-04-03T10:00:00.000Z'),
    content: `<p>De abaya wordt vaak als traditioneel kledingstuk beschreven, maar in de stad functioneert ze steeds vaker als jas, laag en statement tegelijk. Een open abaya over een rechte broek en blouse geeft direct rust aan een outfit. Niet overdreven feestelijk, niet te casual, maar precies verzorgd genoeg.</p>
<p>De beste dagelijkse abaya is niet de meest versierde. Ze heeft een goede stof, een lijn die beweegt en mouwen die praktisch blijven. Zwart blijft klassiek, maar taupe, olijf, espresso en blauwgrijs maken de abaya minder ceremonieel en meer dagelijks.</p>
<p>Mensen zoeken niet alleen naar "abaya kopen", maar naar een abaya voor werk, school, stad, Eid of familiebezoek. Via ModestDirectory vind je <a href="/abaya-shops/nederland">abaya winkels in Nederland</a> en <a href="/abaya-shops/belgie">abaya winkels in België</a> die precies dat bieden: van dagelijkse modellen tot feestelijke occasionwear.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'eid-outfit-na-eid',
    title: 'De Eid-outfit die je ook na Eid blijft dragen',
    excerpt: 'Feestkleding heeft vaak een kort leven. De sterkste Eid-outfit doet meer: ze voelt bijzonder op de dag zelf, maar blijft draagbaar voor diners, familiebezoeken of een zomerbruiloft.',
    metaTitle: 'De Eid-outfit die je ook na Eid blijft dragen | ModestDirectory',
    metaDesc: 'Hoe je een feestelijke modest outfit kiest die niet na één gelegenheid in de kast verdwijnt.',
    tags: ['abaya', 'Eid', 'bruiloft', 'zomer'],
    publishedAt: new Date('2026-04-06T10:00:00.000Z'),
    content: `<p>Feestkleding heeft vaak een kort leven. Ze schittert één dag en verdwijnt daarna achterin de kast. De sterkste Eid-outfit doet meer: ze voelt bijzonder op de dag zelf, maar blijft draagbaar voor diners, familiebezoeken of een zomerbruiloft.</p>
<p>Kies daarom liever voor één verfijnd detail dan voor alles tegelijk. Ton-sur-ton borduurwerk, een mooie mouw of een rijke stof blijft langer chic dan overdaad. Champagne, salie, nachtblauw, mokka en zwart zijn kleuren die na Eid niet meteen hun context verliezen.</p>
<p>Een goed gekozen Eid-outfit is ook een slimme investering. Winkels die dit begrijpen, presenteren feestelijke modellen niet alleen als "Eid collection", maar ook als bruiloftsgast, dineroutfit of zomerlook. Via ModestDirectory kun je <a href="/abaya-shops/nederland">abaya winkels in Nederland</a> en <a href="/abaya-shops/belgie">abaya winkels in België</a> vergelijken op precies dat soort veelzijdigheid.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'ramadan-naar-zomer-garderobe',
    title: 'Van Ramadan naar zomer: wat blijft?',
    excerpt: 'Na Ramadan blijft vaak meer in de garderobe hangen dan verwacht. Sommige stukken verdienen een tweede leven in de zomer.',
    metaTitle: 'Van Ramadan naar zomer: wat blijft? | ModestDirectory',
    metaDesc: 'Welke modest fashion items na Ramadan en Eid blijven werken richting lente en zomer.',
    tags: ['modest fashion', 'hijab', 'abaya', 'Eid', 'zomer'],
    publishedAt: new Date('2026-04-09T10:00:00.000Z'),
    content: `<p>Na Ramadan blijft vaak meer in de garderobe hangen dan verwacht. De lichte hijab die overal bij paste, de open abaya van iftars, de lange jurk die comfortabel genoeg was voor lange avonden. Sommige stukken verdienen een tweede leven in de zomer.</p>
<p>Combineer feestelijke items met lichtere basics. Een donkere abaya wordt zachter met een crème hijab. Een Eid-jurk voelt dagelijks met platte sandalen. Een satijnen sjaal wordt subtieler naast katoen of denim.</p>
<p>Na Eid verschuift het zoekgedrag: minder feest, meer draagbare modest fashion. Lichte abaya's, zomerhijabs, jurken voor dagelijks gebruik. Via ModestDirectory vind je <a href="/modest-fashion/nederland">modest fashion winkels in Nederland</a> en <a href="/hijab-shops/nederland">hijab winkels in Nederland</a> die dat aanbod hebben, ook buiten het feestseizoen.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'modest-denim',
    title: 'Modest denim: de lange spijkerrok is terug',
    excerpt: 'Denim geeft modest fashion structuur. Een lange spijkerrok is minder formeel dan een abaya, steviger dan viscose en praktischer dan veel jurken.',
    metaTitle: 'Modest denim: de lange spijkerrok is terug | ModestDirectory',
    metaDesc: 'Over lange denimrokken, oversized shirts en hoe denim weer een rol krijgt binnen modest fashion.',
    tags: ['modest fashion', 'hijab', 'abaya', 'Eid'],
    publishedAt: new Date('2026-04-10T10:00:00.000Z'),
    content: `<p>Denim geeft modest fashion structuur. Een lange spijkerrok is minder formeel dan een abaya, steviger dan viscose en praktischer dan veel jurken. Met een oversized overhemd en jersey hijab voelt ze ontspannen; met een lange blazer wordt ze ineens geschikt voor werk.</p>
<p>De moderne denimrok is niet stijf of zwaar. Zoek naar een A-lijn, een donkere wassing en genoeg bewegingsruimte. Denim werkt mooi naast zachte stoffen zoals modal, chiffon en katoen, omdat het contrast brengt.</p>
<p>Niet iedereen zoekt direct naar islamitische kleding. Soms zoekt iemand naar een lange rok, wijde blouse of hijabvriendelijke outfit. Via <a href="/modest-fashion/nederland">modest fashion winkels in Nederland</a> en <a href="/islamitische-kleding/nederland">islamitische kledingwinkels in Nederland</a> vind je winkels die die taal spreken.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'abaya-kopen-nederland',
    title: 'Een abaya kopen in Nederland: waar let je op?',
    excerpt: 'Een abaya kopen lijkt eenvoudig tot je begint te vergelijken. Dan blijken lengte, stof en mouwvorm belangrijker dan de productfoto.',
    metaTitle: 'Een abaya kopen in Nederland: waar let je op?',
    metaDesc: "Praktische koopgids voor abaya's in Nederland: stof, lengte, mouwen, gelegenheid en winkeltype.",
    tags: ['abaya', 'Nederland', 'Eid'],
    publishedAt: new Date('2026-04-11T10:00:00.000Z'),
    content: `<p>Een abaya kopen lijkt eenvoudig tot je begint te vergelijken. Dan blijken lengte, stof en mouwvorm belangrijker dan de productfoto. Een abaya moet lopen, zitten, wassen en een volledige dag meegaan.</p>
<p>Let eerst op lengte. Vraag naar centimeters, zeker als je kleiner of langer bent dan gemiddeld. Kijk daarna naar stof: matte crêpe is vaak geschikt voor dagelijks gebruik, satijn is feestelijker, katoenmixen zijn prettig voor warme dagen. Mouwen bepalen comfort; een dramatische mouw is mooi, maar niet altijd handig.</p>
<p>Via ModestDirectory kun je zien welke <a href="/abaya-shops/nederland">abaya winkels in Nederland</a> fysieke pasmogelijkheden hebben en welke online leveren. Sommige shops zijn gespecialiseerd in Dubai abaya's, andere in basics of feestelijke modellen — dat verschil is de moeite waard om te kennen voor je koopt.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'kleurpalet-modest-fashion',
    title: 'Het nieuwe kleurpalet van modest fashion',
    excerpt: 'Modest fashion beweegt voorbij alleen zwart en pastel. Het nieuwe kleurpalet is zachter maar volwassener: salie, espresso, botergeel, ivoor.',
    metaTitle: 'Het nieuwe kleurpalet van modest fashion | ModestDirectory',
    metaDesc: 'Over salie, espresso, botergeel en andere tinten die modest fashion volwassen maken.',
    tags: ['modest fashion', 'hijab', 'abaya'],
    publishedAt: new Date('2026-04-12T10:00:00.000Z'),
    content: `<p>Modest fashion beweegt voorbij alleen zwart en pastel. Het nieuwe kleurpalet is zachter maar volwassener: salie in plaats van mint, espresso in plaats van bruin, botergeel in plaats van fel geel, ivoor in plaats van spierwit.</p>
<p>Deze tinten werken omdat modest outfits vaak uit lagen bestaan. Hijab, abaya, jurk, jas en tas moeten samen spreken. Gedempte kleuren laten ruimte en maken combineren eenvoudiger.</p>
<p>Groepeer producten in kleurfamilies: aardetinten, neutraal, feestelijk, donkere basics, zachte lente. Dat voelt menselijker dan een eindeloze lijst losse kleuren. Bij <a href="/modest-fashion/nederland">modest fashion winkels in Nederland</a> en <a href="/modest-fashion/belgie">modest fashion winkels in België</a> vind je steeds vaker collecties die precies zo zijn samengesteld.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'islamitische-kinderkleding',
    title: 'Islamitische kinderkleding zonder verkleedgevoel',
    excerpt: 'Bij kinderkleding wordt feestelijkheid snel te veel. Islamitische kinderkleding werkt beter wanneer ze mooi is zonder verkleedgevoel.',
    metaTitle: 'Islamitische kinderkleding zonder verkleedgevoel',
    metaDesc: 'Over comfortabele, mooie islamitische kleding voor kinderen: feest, moskee, Eid en dagelijks gebruik.',
    tags: ['abaya', 'Eid', 'bruiloft'],
    publishedAt: new Date('2026-04-13T10:00:00.000Z'),
    content: `<p>Bij kinderkleding wordt feestelijkheid snel te veel. Te veel glans, te veel tule, te veel mini-volwassenheid. Islamitische kinderkleding werkt beter wanneer ze mooi is zonder verkleedgevoel: een jurk waarin een kind kan bewegen, een qamis die netjes is maar niet stijf, een kleine abaya die niet sleept.</p>
<p>Comfort komt eerst. Zachte katoen, lichte crêpe en soepele viscose zijn vaak beter dan zware glansstoffen. Maten moeten duidelijk zijn, want ouders willen niet gokken.</p>
<p>Ouders zoeken rond Eid, Ramadan, bruiloften en moskeebezoek. Via <a href="/islamitische-kleding/nederland">islamitische kledingwinkels in Nederland</a> en <a href="/islamitische-kleding/belgie">islamitische kledingwinkels in België</a> vind je winkels die ook kinderkleding voeren — zoek op categorieën en lees reviews van andere ouders.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'modest-travel-outfit',
    title: 'De modest travel outfit',
    excerpt: 'Reiskleding test elke outfit. Een goede modest travel outfit bedekt, ademt, beweegt en blijft netjes zonder constante correctie.',
    metaTitle: 'De modest travel outfit | ModestDirectory',
    metaDesc: 'Outfitideeën voor reizen met hijab of modest fashion: laagjes, stoffen en praktische styling.',
    tags: ['modest fashion', 'hijab', 'abaya'],
    publishedAt: new Date('2026-04-16T10:00:00.000Z'),
    content: `<p>Reiskleding test elke outfit. Wat thuis elegant lijkt, kan op Schiphol of in de trein ineens te warm, te strak of te ingewikkeld zijn. Een goede modest travel outfit bedekt, ademt, beweegt en blijft netjes zonder constante correctie.</p>
<p>Begin met een zachte basis: wijde pantalon, maxi-jurk of rechte rok. Voeg een open abaya, lange jas of licht vest toe. Voor hijabs zijn modal en jersey praktisch, omdat ze beter blijven zitten op lange dagen.</p>
<p>Zoektermen als kreukarm, lichtgewicht, ademend, geschikt voor umrah, vakantie of stedentrip hebben een duidelijke behoefte. Via <a href="/modest-fashion/nederland">modest fashion winkels in Nederland</a> en <a href="/hijab-shops/nederland">hijab winkels in Nederland</a> vind je winkels die op die behoefte inspelen.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'modest-sportswear',
    title: 'Modest sportswear wordt volwassen',
    excerpt: 'Modest sportswear was lang een bijzaak. Maar de vraag is groter geworden: vrouwen willen wandelen, fitnessen, zwemmen en fietsen zonder telkens zelf een oplossing te improviseren.',
    metaTitle: 'Modest sportswear wordt volwassen | ModestDirectory',
    metaDesc: 'Over sportieve modest fashion, gymwear, zwemkleding en de vraag naar betaalbare, comfortabele opties.',
    tags: ['modest fashion', 'hijab', 'Nederland', 'Eid'],
    publishedAt: new Date('2026-04-17T10:00:00.000Z'),
    content: `<p>Modest sportswear was lang een bijzaak: een oversized shirt, een wijde broek, een praktische sporthijab. Maar de vraag is groter geworden. Vrouwen willen wandelen, fitnessen, zwemmen en fietsen zonder telkens zelf een oplossing te improviseren.</p>
<p>Goede sportkleding moet bewegen zonder te tekenen, ademen zonder door te schijnen en bedekken zonder zwaar te worden. Dat vraagt technische stoffen, slimme lengtes en eerlijke maatvoering.</p>
<p>Zoektermen als sport hijab, modest gymwear, burkini Nederland en bedekkende sportkleding horen niet verloren te gaan tussen gewone modecategorieën. Via <a href="/islamitische-kleding/nederland">islamitische kledingwinkels in Nederland</a> en <a href="/hijab-shops/nederland">hijab winkels in Nederland</a> vind je steeds meer winkels die sportieve bedekkende kleding voeren.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'modest-bruiloftsgast',
    title: 'Als bruiloftsgast modest gekleed',
    excerpt: 'Bruiloftskleding vraagt diplomatie. Je wil feestelijk zijn, maar niet de hoofdrol opeisen. Voor modest fashion betekent dat: bedekking, comfort en elegantie in balans.',
    metaTitle: 'Als bruiloftsgast modest gekleed | ModestDirectory',
    metaDesc: "Stijladvies voor modest bruiloftsoutfits: kleuren, abaya's, kaftans, hijabs en etiquette.",
    tags: ['modest fashion', 'hijab', 'abaya', 'bruiloft'],
    publishedAt: new Date('2026-04-18T10:00:00.000Z'),
    content: `<p>Bruiloftskleding vraagt diplomatie. Je wil feestelijk zijn, maar niet de hoofdrol opeisen. Voor modest fashion betekent dat: bedekking, comfort en elegantie in balans.</p>
<p>Kies één sterk detail. Een mooie mouw, subtiele glans, ton-sur-ton borduurwerk of rijke stof is vaak genoeg. Champagne, salie, nachtblauw, bordeaux en mokka zijn toegankelijker dan heel licht wit of harde kleuren.</p>
<p>Mensen zoeken rond concrete gelegenheden: abaya bruiloft gast, modest wedding guest outfit, feestelijke hijab. Die zoekintentie ligt dicht bij aankoop. Via <a href="/abaya-shops/nederland">abaya winkels in Nederland</a> en <a href="/abaya-shops/belgie">abaya winkels in België</a> vind je winkels die gespecialiseerd zijn in precies deze gelegenheidslooks.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'jilbab-khimar-abaya-uitleg',
    title: 'Jilbab, khimar, abaya: rustig uitgelegd',
    excerpt: 'Modest fashion heeft een eigen vocabulaire. Hijab, khimar, abaya en jilbab worden online soms door elkaar gebruikt, terwijl shoppers juist duidelijkheid zoeken.',
    metaTitle: 'Jilbab, khimar, abaya: rustig uitgelegd | ModestDirectory',
    metaDesc: 'Toegankelijke gids over verschillen tussen jilbab, khimar, abaya en hijab voor shoppers in Nederland en België.',
    tags: ['modest fashion', 'hijab', 'hoofddoek', 'abaya', 'Nederland', 'België', 'Eid'],
    publishedAt: new Date('2026-04-20T10:00:00.000Z'),
    content: `<p>Modest fashion heeft een eigen vocabulaire. Hijab, khimar, abaya en jilbab worden online soms door elkaar gebruikt, terwijl shoppers juist duidelijkheid zoeken.</p>
<p>Een hijab is in winkeltaal vaak de hoofddoek. Een khimar bedekt meestal hoofd, schouders en borst. Een abaya is een lang losvallend overkleed, open of gesloten. Een jilbab is vaak ruimer en kan als complete bedekkende outfit functioneren.</p>
<p>Duidelijke categorieën helpen zowel gebruikers als vindbaarheid. Iemand die een khimar zoekt, wil niet door gewone sjaals bladeren. Via <a href="/hijab-shops/nederland">hijab winkels in Nederland</a>, <a href="/abaya-shops/nederland">abaya winkels in Nederland</a> en <a href="/islamitische-kleding/nederland">islamitische kledingwinkels in Nederland</a> kun je gericht zoeken op het type bedekkende kleding dat je nodig hebt.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'modest-fashion-belgie-nederland',
    title: 'België of Nederland: waar shop je anders?',
    excerpt: 'België en Nederland liggen dicht bij elkaar, maar modest fashion shoppen voelt niet hetzelfde.',
    metaTitle: 'België of Nederland: waar shop je anders? | ModestDirectory',
    metaDesc: 'Vergelijking tussen modest fashion shoppen in België en Nederland: steden, stijlen, winkels en online aanbod.',
    tags: ['modest fashion', 'hijab', 'abaya', 'Nederland', 'België', 'Amsterdam', 'Antwerpen', 'Eid'],
    publishedAt: new Date('2026-04-21T10:00:00.000Z'),
    content: `<p>België en Nederland liggen dicht bij elkaar, maar modest fashion shoppen voelt niet hetzelfde. Nederland heeft sterke webshops, veel online zichtbaarheid en snelle vergelijking. België voelt op sommige plekken boetiekachtiger, met meer nadruk op fysieke winkels en feestelijke kleding.</p>
<p>Amsterdam, Rotterdam en Den Haag zijn belangrijk voor hijabs, abaya's en islamitische kleding in Nederland. Antwerpen en Brussel bieden een andere mix: kaftans, luxe abaya's, Marokkaanse invloeden en winkels waar passen nog centraal staat.</p>
<p>Bezoekers shoppen niet altijd binnen landsgrenzen. Iemand uit Breda kijkt naar Antwerpen; iemand uit Gent bestelt bij een Nederlandse webshop. Via ModestDirectory kun je <a href="/modest-fashion/nederland">modest fashion winkels in Nederland</a> en <a href="/modest-fashion/belgie">modest fashion winkels in België</a> naast elkaar vergelijken, inclusief steden als <a href="/hijab-shops/amsterdam">Amsterdam</a> en <a href="/hijab-shops/antwerpen">Antwerpen</a>.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'plus-size-modest-fashion',
    title: 'Plus-size modest fashion verdient beter',
    excerpt: 'Plus-size modest fashion wordt te vaak behandeld als bijlage: een paar grotere maten, weinig foto\'s, onduidelijke pasvorm.',
    metaTitle: 'Plus-size modest fashion verdient beter | ModestDirectory',
    metaDesc: 'Over pasvorm, stof en representatie binnen plus-size modest fashion in Nederland en België.',
    tags: ['modest fashion', 'Nederland', 'België'],
    publishedAt: new Date('2026-04-22T10:00:00.000Z'),
    content: `<p>Plus-size modest fashion wordt te vaak behandeld als bijlage: een paar grotere maten, weinig foto's, onduidelijke pasvorm. Terwijl juist hier maatvoering cruciaal is. Ruim is niet automatisch goed passend.</p>
<p>Kleding moet voldoende borst- en heupruimte hebben, mouwen die niet trekken en stoffen die niet tekenen. Zwart mag, maar plus-size aanbod verdient net zo goed kleur, print en detail.</p>
<p>Maattabellen, stofinformatie en eerlijke pasvormnotities zijn essentieel. Via <a href="/modest-fashion/nederland">modest fashion winkels in Nederland</a> en <a href="/modest-fashion/belgie">modest fashion winkels in België</a> kun je winkels vergelijken op hun plus-size aanbod — lees reviews van andere klanten om te weten hoe de pasvorm werkelijk valt.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'hijab-basics-investeren',
    title: 'In welke hijab basics investeer je?',
    excerpt: 'Basics lijken eenvoudig, maar precies daar verlies je vaak geld. Kleuren die online beter leken, stoffen die schuiven, sjaals die na twee wasbeurten moe ogen.',
    metaTitle: 'In welke hijab basics investeer je? | ModestDirectory',
    metaDesc: 'Koopgids voor hijab basics: stoffen, kleuren en kwaliteit waar je op lange termijn iets aan hebt.',
    tags: ['hijab', 'Eid', 'zomer'],
    publishedAt: new Date('2026-04-23T10:00:00.000Z'),
    content: `<p>Elke hijabcollectie heeft vergissingen: kleuren die online beter leken, stoffen die schuiven, sjaals die na twee wasbeurten moe ogen. Basics lijken eenvoudig, maar precies daar verlies je vaak geld.</p>
<p>Investeer eerst in stof. Jersey is praktisch, modal is zacht, chiffon is elegant, satijn is feestelijk. Daarna komen kleuren: zwart, taupe, crème, chocolade, olijf en grijsblauw werken vaker dan trendkleuren.</p>
<p>Winkels kunnen basics beter verkopen door duidelijkheid te geven: welke stof is geschikt voor beginners, welke hijab blijft goed zitten, welke is luchtig in de zomer. Dat is nuttiger dan alleen "premium kwaliteit". Via <a href="/hijab-shops/nederland">hijab winkels in Nederland</a> en <a href="/hijab-shops/belgie">hijab winkels in België</a> vind je zowel fysieke winkels waar je stoffen kunt voelen als webshops met uitgebreide beschrijvingen.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'modest-layering-lente',
    title: 'Layering in de lente',
    excerpt: 'Lente is het moeilijkste seizoen om bescheiden te kleden. Winterlagen zijn te zwaar, zomerkleding is te optimistisch. Layering blijft nodig, maar moet lichter worden.',
    metaTitle: 'Layering in de lente | ModestDirectory',
    metaDesc: "Hoe je met lichte lagen, open abaya's en dunne jassen een lenteproof modest outfit maakt.",
    tags: ['hijab', 'abaya', 'Eid', 'zomer'],
    publishedAt: new Date('2026-04-24T10:00:00.000Z'),
    content: `<p>Lente is het moeilijkste seizoen om bescheiden te kleden. Winterlagen zijn te zwaar, zomerkleding is te optimistisch. Layering blijft nodig, maar moet lichter worden.</p>
<p>Een open abaya, lichte trench of lange blouse werkt goed over een maxi-jurk of wijde broek. Onderlagen moeten ook zonder jas kloppen, want zodra de zon doorbreekt wil je iets kunnen uittrekken zonder dat de outfit instort.</p>
<p>Combinaties als open abaya met pantalon, trench met jurk en modal hijab met lichte jas zijn precies het aanbod dat in de lente gevraagd wordt. Via <a href="/modest-fashion/nederland">modest fashion winkels in Nederland</a> en <a href="/abaya-shops/nederland">abaya winkels in Nederland</a> vind je winkels die dat soort lentecombinaties bieden.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'duurzame-modest-fashion',
    title: 'Duurzame modest fashion begint praktisch',
    excerpt: 'Duurzame modest fashion hoeft niet te beginnen bij perfecte merken. Vaak begint ze bij kleding die je werkelijk draagt.',
    metaTitle: 'Duurzame modest fashion begint praktisch | ModestDirectory',
    metaDesc: 'Over bewuster kopen, kwaliteit en langer dragen binnen modest fashion.',
    tags: ['modest fashion', 'hijab', 'abaya', 'Eid'],
    publishedAt: new Date('2026-04-25T10:00:00.000Z'),
    content: `<p>Duurzame modest fashion hoeft niet te beginnen bij perfecte merken. Vaak begint ze bij kleding die je werkelijk draagt. Een goede abaya, sterke hijab of blouse die jaren meegaat, is duurzamer dan vijf halve oplossingen.</p>
<p>Stel eenvoudige vragen: past deze kleur bij mijn garderobe? Kan ik dit buiten één gelegenheid dragen? Weet ik hoe de stof gewassen moet worden? Is de pasvorm duidelijk?</p>
<p>Winkels kunnen hierin helpen door eerlijk te zijn over materiaal, onderhoud en maatvoering. Via <a href="/modest-fashion/nederland">modest fashion winkels in Nederland</a> en <a href="/modest-fashion/belgie">modest fashion winkels in België</a> kun je reviews lezen van echte klanten — die geven vaak de eerlijkste informatie over kwaliteit en duurzaamheid.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'online-zoeken-modest-fashion',
    title: 'Hoe zoek je online beter naar modest fashion?',
    excerpt: 'Online zoeken naar modest fashion wordt makkelijker wanneer je preciezer zoekt. Niet alleen "hijab", maar "hijab winkel Amsterdam" of "abaya webshop Nederland".',
    metaTitle: 'Hoe zoek je online beter naar modest fashion?',
    metaDesc: 'Praktische gids voor zoektermen: hijab winkel, hoofddoek winkel, abaya webshop, khimar, jilbab en lokale zoekopdrachten.',
    tags: ['modest fashion', 'hijab', 'hoofddoek', 'abaya', 'Nederland', 'België', 'Amsterdam', 'Eid', 'bruiloft', 'zomer'],
    publishedAt: new Date('2026-04-26T10:00:00.000Z'),
    content: `<p>Online zoeken naar modest fashion wordt makkelijker wanneer je preciezer zoekt. Niet alleen "hijab", maar "hijab winkel Amsterdam", "hoofddoek winkel Rotterdam", "abaya webshop Nederland" of "khimar België".</p>
<p>Gebruik meerdere woorden voor hetzelfde product. Niet elke winkel noemt een hoofddoek hijab. Niet elke abaya staat onder islamitische kleding. Zoek ook op situatie: Eid outfit, modest workwear, sport hijab, zomerabaya of bruiloft abaya.</p>
<p>Een directory helpt omdat ze die taalverschillen opvangt. Je hoeft niet te weten hoe een winkel zichzelf noemt — zoek op stad, categorie en type winkel en krijg opties naast elkaar. Probeer <a href="/hijab-shops/nederland">hijab winkels in Nederland</a>, <a href="/abaya-shops/belgie">abaya winkels in België</a>, <a href="/islamitische-kleding/nederland">islamitische kledingwinkels in Nederland</a> of <a href="/modest-fashion/belgie">modest fashion in België</a>.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'hoofddoek-kleuren-gezicht',
    title: 'Welke hoofddoekkleuren halen je gezicht op?',
    excerpt: 'Een hoofddoekkleur doet meer dan bij een outfit passen. Ze zit dicht bij je gezicht en bepaalt of je fris, moe, zacht of streng oogt.',
    metaTitle: 'Welke hoofddoekkleuren halen je gezicht op? | ModestDirectory',
    metaDesc: 'Gids voor hijabkleuren: warme, koele en neutrale tinten die outfits zachter en sterker maken.',
    tags: ['hijab', 'hoofddoek'],
    publishedAt: new Date('2026-04-27T10:00:00.000Z'),
    content: `<p>Een hoofddoekkleur doet meer dan bij een outfit passen. Ze zit dicht bij je gezicht en bepaalt of je fris, moe, zacht of streng oogt. Daarom is kleurkeuze bij hijabs belangrijker dan bij veel andere accessoires.</p>
<p>Warme huidtinten doen het vaak goed met karamel, olijf, crème, chocolade en terracotta. Koelere tinten kunnen mooi zijn met blauwgrijs, mauve, smaragd, marine en koel taupe. Maar regels zijn minder belangrijk dan daglicht: hou de stof bij je gezicht en kijk wat er gebeurt.</p>
<p>Verkoop hijabs niet alleen per kleur, maar per effect: zachte neutralen, warme aardetinten, koele klassiekers, feestelijke tinten. Via <a href="/hijab-shops/nederland">hijab winkels in Nederland</a> en <a href="/hijab-shops/belgie">hijab winkels in België</a> vind je winkels met uitgebreide kleurenkeuzes — zowel online als fysiek, zodat je kleuren naast je gezicht kunt houden.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'modest-fashion-voor-studenten',
    title: 'Modest fashion voor studenten',
    excerpt: 'Studentenmode moet veel kunnen en weinig kosten. Je fietst, zit lang, loopt door regen en wil er toch verzorgd uitzien.',
    metaTitle: 'Modest fashion voor studenten | ModestDirectory',
    metaDesc: 'Betaalbare, praktische en stijlvolle modest outfits voor school, universiteit en drukke dagen.',
    tags: ['modest fashion', 'hijab', 'abaya', 'Eid'],
    publishedAt: new Date('2026-04-28T10:00:00.000Z'),
    content: `<p>Studentenmode moet veel kunnen en weinig kosten. Je fietst, zit lang, loopt door regen, neemt boeken mee en wil er toch verzorgd uitzien. Modest fashion voor studenten vraagt daarom om slimme basics.</p>
<p>Een wijde pantalon, lange rok, oversized blouse, jersey hijab en lichte jas vormen een goede basis. Voeg één nette abaya toe voor presentaties of gelegenheden. Kies kleuren die onderling werken, zodat je niet elke ochtend opnieuw begint.</p>
<p>Studenten zoeken niet altijd luxe, maar wel kwaliteit die niet na drie wasbeurten instort. Via <a href="/modest-fashion/nederland">modest fashion winkels in Nederland</a> en <a href="/hijab-shops/nederland">hijab winkels in Nederland</a> vind je winkels met eerlijke prijzen, goede basics en webshops die snel leveren.</p>
${FOOTER_NL_BE}`,
  },
  {
    slug: 'modestdirectory-winkelgids-gebruiken',
    title: 'Zo gebruik je een modest fashion directory slim',
    excerpt: 'Een modest fashion directory is geen gewone lijst. Goed gebruikt is het een manier om sneller te vinden wat losse zoekresultaten verbergen.',
    metaTitle: 'Zo gebruik je een modest fashion directory slim',
    metaDesc: 'Praktische uitleg over winkels vergelijken op stad, categorie, type winkel en specialisatie via ModestDirectory.',
    tags: ['modest fashion', 'hijab', 'abaya'],
    publishedAt: new Date('2026-04-30T10:00:00.000Z'),
    content: `<p>Een modest fashion directory is geen gewone lijst. Goed gebruikt is het een manier om sneller te vinden wat losse zoekresultaten verbergen: welke winkels fysiek zijn, welke online leveren, waar je hijabs vindt, waar abaya's, waar kinderkleding of feestelijke outfits.</p>
<p>Begin met je behoefte. Wil je passen? Zoek per stad. Wil je snel bestellen? Filter op webshop. Zoek je een specifiek stuk? Gebruik categorieën als hijab, abaya, khimar, jilbab, islamitische kleding of modest fashion.</p>
<p>ModestDirectory helpt je overzicht houden in een niche met veel verschillende termen. Gebruik <a href="/modest-fashion/nederland">modest fashion winkels in Nederland</a>, <a href="/modest-fashion/belgie">modest fashion winkels in België</a>, <a href="/hijab-shops/nederland">hijab winkels</a>, <a href="/abaya-shops/nederland">abaya winkels</a> en <a href="/islamitische-kleding/nederland">islamitische kledingwinkels</a> als startpunt — en lees reviews om te weten welke winkel echt bij jouw behoefte past.</p>
${FOOTER_NL_BE}`,
  },
]

async function main() {
  console.log('Seeding 20 blog posts (april 2026)...')

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        metaTitle: post.metaTitle,
        metaDesc: post.metaDesc,
        tags: post.tags,
        publishedAt: post.publishedAt,
        isPublished: true,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        metaTitle: post.metaTitle,
        metaDesc: post.metaDesc,
        tags: post.tags,
        publishedAt: post.publishedAt,
        isPublished: true,
      },
    })
    console.log(`  ✅ ${post.slug}`)
  }

  console.log('Done — 20 posts seeded.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
