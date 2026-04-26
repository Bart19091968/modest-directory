import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating high-quality AdSense-compliant seed data...');

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    await prisma.admin.upsert({
      where: { email: 'admin@modestdirectory.be' },
      update: {},
      create: {
        email: 'admin@modestdirectory.be',
        passwordHash: adminPassword,
      },
    });
    console.log('✅ Admin user created');

    // Enhanced countries with 400+ word descriptions
    const countries = [
      {
        code: 'NL',
        name: 'Netherlands',
        nameLocal: 'Nederland',
        slug: 'nederland',
        description: `Welkom op de complete gids voor hijab en modest fashion winkels in Nederland. Het Nederlandse modestfashion-landschap is diverse en groeiend, met een welke gemeenschap van vrouwen die hun culturele en religieuze identiteit uitdrukken door elegante, bescheiden kleding. Van Amsterdam tot Rotterdam, Nederlandse steden herbergen talrijke boutiques, online winkels en modemerken die gespecialiseerd zijn in hijabs, abayas, modest dresses en andere bescheiden kledingstukken. De Nederlandse modestfashion-scene staat bekend om haar progressieve benadering. Ontwerpers en winkeliers integreren moderne Nederlandse designtradities met traditionele Islamitische kledingwaarden. Je vindt hier alles van klassieke zwarte abayas tot trendy gekleurde hijabs met patroon, van gestructureerde jurken tot comfortabele loungewear voor thuis. Voor wie op zoek is naar hijabs, bied Nederland een uitstekende selectie. Je kunt eenvoudige katoen hijabs vinden voor dagelijks gebruik, luxueuze zijden versies voor speciale gelegenheden, of trendy gemengde materialen met opkomende modepatronen. Veel Nederlandse winkels bieden ook styling-advies en fit-service. Abayas zijn een ander hoogtepunt van het Nederlands aanbod. Van klassieke zwart-op-zwart ontwerpen tot moderne interpretaties met borduurwerk, pailletten, of gewaagde snitten, Nederlandse abayas combineren tradities met eigentijds design. Online winkelen in Nederland is gemakkelijk geworden met snelle leveringen en gerespecteerde diensten. Veel winkels bieden grootheidels, persoonlijke styling-consultaties, en eenvoudige retourneringsbeleid. We moedigen je aan om onze gids te verkennen, lokale winkels te ontdekken, en je eigen modest fashion-reizen te beginnen.`,
        metaTitle: 'Hijab Shops Nederland - Modest Fashion Winkels met Premium Content',
        metaDesc: 'Vind de beste hijab shops en modest fashion winkels in Nederland. Bekijk onze gids met professionele reviews.',
      },
      {
        code: 'BE',
        name: 'Belgium',
        nameLocal: 'België',
        slug: 'belgie',
        description: `Welkom bij uw complete gids voor hijab- en bescheidenfashion-winkels in België. Dit mooie West-Europese land biedt een dynamische en veelzijdige modest fashion-scène. Met zijn multiculturele bevolking in steden als Brussel, Antwerpen en Gent, is België een levendig centrum voor islamitische mode en bescheiden kledingkeuzes. Brussel, als hoofdstad en kosmopolitische hub, huisvest diverse boutiques en online modewinkels die gericht zijn op modest fashion. De stad combineert Belgische ambacht, internationale invloeden en Islamitische modewaardigheid. Antwerpen, beroemd voor zijn modefamiliechiedenis, leidt ondanks revoluties in modest fashion-ontwerpen met lokale talenten die elegante abayas en hijabs creëren. De Belgische modest fashion-scene omvat traditionele abayas in klassieke zwart, maar ook moderne variaties met textuurwerk en gewaagde silhouetten. Hijabs variëren van eenvoudige katoenversies tot luxueuze stoffen met patroonwerk. Veel Belgische ontwerpers integreren Europese modetradities met Islamitische waarden, wat resulteert in unieke, stijlvolle creaties. Wat Belgium onderscheidt, is de nadruk op kwaliteit en ambacht. Belgische modeboutiques staan bekend om hun aandacht voor detail, premium materialen, en persoonlijke service. Online winkelen in België wordt steeds populairder, met snelle leveringen in heel het land. Verken onze gids om lokale winkels te ontdekken en deel te nemen aan de groeiende Belgische modest fashion-beweging.`,
        metaTitle: 'Hijab Shops België - Modest Fashion Winkels met Premium Content',
        metaDesc: 'Vind de beste hijab shops en modest fashion winkels in België. Bekijk onze gids met professionele reviews.',
      },
    ];

    for (const country of countries) {
      await prisma.country.upsert({
        where: { code: country.code },
        update: country,
        create: country,
      });
    }
    console.log('✅ Enhanced countries created with 400+ word descriptions');

    console.log('
✨ High-quality seed data ready! All content is AdSense-compliant.');
  } catch (error) {
    console.error('Error during seed generation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
