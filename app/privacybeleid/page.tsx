import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacybeleid | ModestDirectory',
  description: 'Lees hoe ModestDirectory omgaat met jouw persoonsgegevens. Wij respecteren jouw privacy en verwerken gegevens conform de AVG/GDPR.',
  alternates: { canonical: '/privacybeleid' },
}

export default function PrivacybeleidPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacybeleid</h1>
      <p className="text-sm text-gray-500 mb-10">Laatst bijgewerkt: april 2025</p>

      <div className="prose prose-gray max-w-none space-y-8">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Wie zijn wij?</h2>
          <p className="text-gray-700 leading-relaxed">
            ModestDirectory is een online gids voor islamitische kledingwinkels in Nederland en België.
            Wij helpen consumenten de juiste hijab shops, abaya winkels en modest fashion boutiques te vinden,
            en bieden winkeliers de mogelijkheid zich aan te melden en reviews te ontvangen.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Contactgegevens: <a href="mailto:info@modestdirectory.com" className="text-accent hover:underline">info@modestdirectory.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Welke gegevens verzamelen wij?</h2>
          <p className="text-gray-700 leading-relaxed mb-3">Wij verzamelen de volgende categorieën persoonsgegevens:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Winkelregistratie:</strong> naam van de winkel, e-mailadres, adres, stad, land, websiteadres en telefoonnummer. Deze gegevens worden door winkeliers zelf ingevoerd bij aanmelding.</li>
            <li><strong>Reviews:</strong> de tekst van een review en het bijbehorende e-mailadres (voor verificatiedoeleinden). Het e-mailadres wordt niet publiek getoond.</li>
            <li><strong>Contactberichten:</strong> naam en e-mailadres bij contact via e-mail.</li>
            <li><strong>Technische gegevens:</strong> IP-adressen, browsertype en paginabezoeken via analysediensten (Google Analytics) om het gebruik van de website te begrijpen en te verbeteren.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Waarvoor gebruiken wij uw gegevens?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Het publiceren van winkelprofielen in onze directory, zodat consumenten winkels kunnen vinden.</li>
            <li>Het verifiëren van reviews via e-mail, om misbruik te voorkomen.</li>
            <li>Het beantwoorden van vragen en verzoeken via e-mail.</li>
            <li>Het verbeteren van onze website op basis van gebruiksstatistieken.</li>
            <li>Het naleven van wettelijke verplichtingen.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Rechtsgrond voor verwerking</h2>
          <p className="text-gray-700 leading-relaxed">
            Wij verwerken persoonsgegevens op basis van:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
            <li><strong>Toestemming:</strong> bij het plaatsen van een review geeft u toestemming voor verwerking van uw e-mailadres ter verificatie.</li>
            <li><strong>Uitvoering van een overeenkomst:</strong> bij aanmelding als winkel verwerken wij uw gegevens om de dienst te kunnen leveren.</li>
            <li><strong>Gerechtvaardigd belang:</strong> voor het gebruik van analysediensten om de website te verbeteren.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Delen van gegevens</h2>
          <p className="text-gray-700 leading-relaxed">
            Wij verkopen uw persoonsgegevens nooit aan derden. Wij kunnen gegevens delen met:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
            <li><strong>Hostingproviders:</strong> Railway.app voor het hosten van onze website en database.</li>
            <li><strong>E-maildiensten:</strong> Resend voor het versturen van verificatie- en bevestigingsmails.</li>
            <li><strong>Analysediensten:</strong> Google Analytics voor websitestatistieken (geanonimiseerd).</li>
            <li><strong>Advertentiediensten:</strong> Google AdSense voor het tonen van advertenties op onze website.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Al deze partijen zijn contractueel verplicht uw gegevens vertrouwelijk te behandelen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Onze website maakt gebruik van cookies. Wij onderscheiden:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
            <li><strong>Functionele cookies:</strong> noodzakelijk voor het correct functioneren van de website (bijv. inlogsessie voor beheerders).</li>
            <li><strong>Analytische cookies:</strong> Google Analytics plaatst cookies om het gebruik van de website te meten. Deze gegevens worden geanonimiseerd verwerkt.</li>
            <li><strong>Advertentiecookies:</strong> Google AdSense plaatst cookies voor het tonen van relevante advertenties.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            U kunt cookies beheren via de instellingen van uw browser. Houd er rekening mee dat het uitschakelen van cookies de functionaliteit van de website kan beïnvloeden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Bewaring van gegevens</h2>
          <p className="text-gray-700 leading-relaxed">
            Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk. Winkelprofielen worden bewaard zolang de winkel actief is in onze directory. Reviews worden bewaard totdat ze worden verwijderd. E-mailadressen voor verificatie worden na verificatie niet verder bewaard voor andere doeleinden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Uw rechten</h2>
          <p className="text-gray-700 leading-relaxed">Op grond van de AVG (GDPR) heeft u de volgende rechten:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
            <li><strong>Recht op inzage:</strong> u mag opvragen welke gegevens wij van u verwerken.</li>
            <li><strong>Recht op correctie:</strong> u kunt onjuiste gegevens laten corrigeren.</li>
            <li><strong>Recht op verwijdering:</strong> u kunt vragen uw gegevens te verwijderen.</li>
            <li><strong>Recht op bezwaar:</strong> u kunt bezwaar maken tegen de verwerking van uw gegevens.</li>
            <li><strong>Recht op dataportabiliteit:</strong> u kunt vragen uw gegevens in een gangbaar formaat te ontvangen.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Neem contact op via <a href="mailto:info@modestdirectory.com" className="text-accent hover:underline">info@modestdirectory.com</a> om gebruik te maken van uw rechten. U heeft ook het recht een klacht in te dienen bij de Gegevensbeschermingsautoriteit (België) of de Autoriteit Persoonsgegevens (Nederland).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Beveiliging</h2>
          <p className="text-gray-700 leading-relaxed">
            Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, misbruik en ongeautoriseerde toegang. Onze website maakt gebruik van HTTPS-versleuteling en wachtwoorden worden versleuteld opgeslagen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Wijzigingen</h2>
          <p className="text-gray-700 leading-relaxed">
            Wij kunnen dit privacybeleid van tijd tot tijd bijwerken. De meest recente versie is altijd beschikbaar op deze pagina. Wij raden u aan dit beleid regelmatig te raadplegen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Heeft u vragen over dit privacybeleid? Neem dan contact op via:{' '}
            <a href="mailto:info@modestdirectory.com" className="text-accent hover:underline">
              info@modestdirectory.com
            </a>
          </p>
        </section>

      </div>
    </div>
  )
}
