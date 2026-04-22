import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gebruiksvoorwaarden | ModestDirectory',
  description: 'De gebruiksvoorwaarden van ModestDirectory. Lees de regels en voorwaarden voor het gebruik van onze website en diensten.',
  alternates: { canonical: '/gebruiksvoorwaarden' },
}

export default function GebruiksvoorwaardenPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Gebruiksvoorwaarden</h1>
      <p className="text-sm text-gray-500 mb-10">Laatst bijgewerkt: april 2025</p>

      <div className="prose prose-gray max-w-none space-y-8">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Toepasselijkheid</h2>
          <p className="text-gray-700 leading-relaxed">
            Deze gebruiksvoorwaarden zijn van toepassing op het gebruik van de website ModestDirectory (modestdirectory.com) en alle daarmee verbonden diensten. Door gebruik te maken van onze website stemt u in met deze voorwaarden. Wij raden u aan deze voorwaarden zorgvuldig te lezen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Over ModestDirectory</h2>
          <p className="text-gray-700 leading-relaxed">
            ModestDirectory is een online directory die islamitische kledingwinkels, hijab shops en modest fashion boutiques in Nederland en België samenbrengt. Consumenten kunnen winkels zoeken, vergelijken en reviews achterlaten. Winkeliers kunnen hun winkel aanmelden om zichtbaarder te worden voor potentiële klanten.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Gebruik van de website</h2>
          <p className="text-gray-700 leading-relaxed mb-3">U mag de website gebruiken voor wettige doeleinden. Het is niet toegestaan om:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Valse, misleidende of lasterlijke informatie te plaatsen.</li>
            <li>Reviews te plaatsen over winkels waar u geen klant bent geweest.</li>
            <li>De website te gebruiken voor spam of commerciële doeleinden zonder toestemming.</li>
            <li>Auteursrechtelijk beschermd materiaal te plaatsen zonder rechthebbende te zijn.</li>
            <li>De technische werking van de website te verstoren of te omzeilen.</li>
            <li>Persoonsgegevens van anderen te verzamelen via de website.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Winkelregistratie</h2>
          <p className="text-gray-700 leading-relaxed">
            Winkeliers die zich aanmelden op ModestDirectory garanderen dat de verstrekte informatie juist, volledig en up-to-date is. ModestDirectory behoudt het recht om aanmeldingen te weigeren of te verwijderen indien de informatie onjuist of misleidend is, of indien de winkel niet voldoet aan onze richtlijnen. Betaalde abonnementen worden niet terugbetaald tenzij de weigering te wijten is aan een fout van ModestDirectory.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Reviews</h2>
          <p className="text-gray-700 leading-relaxed">
            Reviews moeten gebaseerd zijn op echte ervaringen met de betreffende winkel. ModestDirectory verifieert reviews via e-mail. Reviews die nep, beledigend, discriminerend of anderszins ongepast zijn, kunnen worden verwijderd. ModestDirectory is niet aansprakelijk voor de inhoud van reviews geplaatst door gebruikers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectueel eigendom</h2>
          <p className="text-gray-700 leading-relaxed">
            Alle content op ModestDirectory — inclusief teksten, logo's, afbeeldingen en de structuur van de website — is eigendom van ModestDirectory of de betreffende winkel, tenzij anders vermeld. Het is niet toegestaan deze content te kopiëren, verspreiden of commercieel te exploiteren zonder uitdrukkelijke toestemming.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Door content (zoals teksten, logo's of foto's) te uploaden op ModestDirectory verleent u ons een niet-exclusieve, royaltyvrije licentie om deze content te gebruiken voor het functioneren van de directory.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Aansprakelijkheid</h2>
          <p className="text-gray-700 leading-relaxed">
            ModestDirectory besteedt veel zorg aan de nauwkeurigheid van de informatie op de website, maar kan de volledigheid of juistheid niet garanderen. ModestDirectory is niet aansprakelijk voor:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
            <li>Onjuiste informatie verstrekt door winkeliers of gebruikers.</li>
            <li>Schade door het gebruik van informatie op de website.</li>
            <li>Tijdelijke onbeschikbaarheid van de website.</li>
            <li>Handelsrelaties tussen consumenten en winkels die via ModestDirectory gevonden zijn.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Links naar externe websites</h2>
          <p className="text-gray-700 leading-relaxed">
            ModestDirectory bevat links naar externe websites van winkels. Wij zijn niet verantwoordelijk voor de inhoud of het privacybeleid van deze externe websites. Het bezoeken van externe websites is op eigen risico.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Wijzigingen</h2>
          <p className="text-gray-700 leading-relaxed">
            ModestDirectory behoudt het recht deze gebruiksvoorwaarden te wijzigen. Gewijzigde voorwaarden worden gepubliceerd op deze pagina met vermelding van de datum van de laatste wijziging. Voortgezet gebruik van de website na wijziging geldt als aanvaarding van de nieuwe voorwaarden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Toepasselijk recht</h2>
          <p className="text-gray-700 leading-relaxed">
            Op deze gebruiksvoorwaarden is Belgisch recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechtbank in België, tenzij dwingende wettelijke bepalingen anders voorschrijven.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Vragen over deze gebruiksvoorwaarden? Neem contact op via{' '}
            <a href="mailto:info@modestdirectory.com" className="text-accent hover:underline">
              info@modestdirectory.com
            </a>
          </p>
        </section>

      </div>
    </div>
  )
}
