import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { DonationSetting } from '../models/DonationSetting.js';
import { FounderContent } from '../models/FounderContent.js';

dotenv.config();

const initialEvents = [
  {
    title: 'Saagar Foundation Food Drive',
    slug: 'saagar-foundation-food-drive',
    category: 'Community',
    label: 'Community outreach',
    location: 'DHA Phase 8, Lahore',
    date: 'FOOD DRIVE',
    image: '/events/food-drive/food-drive-1.jpg',
    gallery: [
      '/events/food-drive/food-drive-1.jpg',
      '/events/food-drive/food-drive-2.jpg',
      '/events/food-drive/food-drive-3.jpg',
      '/events/food-drive/food-drive-4.jpg',
      '/events/food-drive/food-drive-5.jpg',
    ],
    description: 'The Saagar Foundation successfully organized a food drive in DHA Phase 8, Lahore, providing meals to 100 people in need. This initiative reflects our commitment to serving humanity, spreading kindness, and ensuring that help reaches those who need it most.\n\nEvery meal served is a step toward our vision of building something meaningful that continues to grow, make a difference, and serve communities for generations to come. At Saagar Foundation, we believe that even the smallest act of kindness can create a lasting impact.',
    order: 1,
    isPublished: true,
  },
  {
    title: 'Saagar Foundation Fundraiser',
    slug: 'saagar-foundation-fundraiser',
    category: 'Fundraising',
    label: 'Community fundraiser',
    location: 'Bean Theory, DHA Phase 6, Lahore',
    date: 'FUNDRAISING',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    description: 'The Saagar Foundation organized a fundraising event filled with fun activities, including FIFA and much more, to raise money for an upcoming visit to an orphanage. The event brought people together for a meaningful cause, combining entertainment, community, and the spirit of giving back.\n\nThrough this initiative, our goal was to raise funds to support children in need and make our orphanage visit a memorable and meaningful experience. At Saagar Foundation, we believe that helping others doesn’t always have to start with something big—it starts with people coming together, sharing what they can, and making a difference.',
    order: 2,
    isPublished: true,
  },
  {
    title: 'Riyat × Saagar Foundation Football Fundraiser',
    slug: 'riyat-x-saagar-foundation-football-fundraiser',
    category: 'Sports',
    label: 'Sport for good',
    location: 'Pine Avenue Cross Courts, Lahore',
    date: 'SPORTS FOR GOOD',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=85',
    description: 'Riyat partnered with Saagar Foundation for a football fundraiser that brought people together through sports, teamwork, and a shared purpose. The initiative aimed to raise funds for a meaningful cause while promoting sportsmanship, discipline, and community spirit.\n\nThrough the power of football, we hope to inspire young people to grow both on and off the field, showing that sport is not just about winning games, but also about respect, teamwork, and making a positive impact on the lives of others.',
    order: 3,
    isPublished: true,
  },
  {
    title: 'Saagar Foundation × Falah Foundation',
    slug: 'saagar-foundation-x-falah-foundation',
    category: 'Outreach',
    label: 'Orphanage visit',
    location: '19/A, Khuda Baksh Colony, New Airport Road, Cantt, Lahore, 54000',
    date: 'ORPHANAGE VISIT',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85',
    description: 'Saagar Foundation visited Falah Foundation to spend time with orphaned children and bring a little happiness into their lives. Using the funds raised through our fundraising initiatives, we provided the children with snacks and stationery items to support their everyday needs and education.\n\nThis visit was a meaningful reminder of why we do what we do. Beyond raising money, our goal is to turn every contribution into real impact, bringing smiles to children’s faces and helping them feel supported and cared for. At Saagar Foundation, we believe that every small act of kindness matters and that, together, we can build a lasting legacy of compassion, generosity, and service to humanity.',
    order: 4,
    isPublished: true,
  },
  {
    title: 'Saagar Sports Fest',
    slug: 'saagar-sports-fest',
    category: 'Sports',
    label: 'Two-day sports event',
    location: 'FR Cross Courts, Pine Avenue',
    date: 'SPORTS FEST',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=85',
    description: 'Saagar Sports Fest was a two-day sporting event that brought together over 800 participants across four different categories, celebrating athletic talent, teamwork, and sportsmanship. The event provided a platform for participants to showcase their skills, challenge themselves, and connect through their shared passion for sports.\n\nBeyond the competition, Saagar Sports Fest aimed to promote discipline, unity, and personal growth, creating an environment where everyone could learn, improve, and thrive. At Saagar Foundation, we believe sports have the power to bring people together, build character, and inspire positive change.',
    order: 5,
    isPublished: true,
  },
  {
    title: 'Saagar Foundation × Todd’s Welfare',
    slug: 'saagar-foundation-x-todds-welfare',
    category: 'Animal Welfare',
    label: 'Animal welfare',
    location: 'Near Arif Memorial Hospital, Lahore',
    date: 'ANIMAL WELFARE',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=85',
    description: 'Saagar Foundation visited Todd’s Welfare to spend a day with the animals, learn more about their care, and support the important work being done to protect and look after them. As part of our visit, we donated funds raised through our sports event to contribute toward their welfare and ongoing needs.\n\nThis initiative reflected our belief that giving back goes beyond helping people—it also means showing compassion toward animals who deserve care, safety, and kindness. By turning the support we received through our sporting events into meaningful contributions, we aim to make a positive difference wherever we can.',
    order: 6,
    isPublished: true,
  },
];

export const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saagar_foundation';
  console.log(`[Seed] Connecting to ${uri}...`);
  await mongoose.connect(uri);

  // 1. Admin User
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('[Seed] Notice: ADMIN_EMAIL or ADMIN_PASSWORD not configured in environment. Skipping admin seeding.');
  } else {
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existingAdmin) {
      await User.create({
        name: 'Saagar Administrator',
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'admin',
      });
      console.log(`[Seed] Created initial administrator: ${adminEmail}`);
    } else {
      console.log(`[Seed] Admin user already exists: ${adminEmail}`);
    }
  }

  // 2. Events
  const eventCount = await Event.countDocuments();
  if (eventCount === 0) {
    await Event.insertMany(initialEvents);
    console.log(`[Seed] Successfully inserted ${initialEvents.length} approved events.`);
  } else {
    console.log(`[Seed] Events already populated (${eventCount} found).`);
  }

  // 3. Donation Settings
  const donationSetting = await DonationSetting.findOne();
  if (!donationSetting) {
    await DonationSetting.create({
      accountHolder: 'Nabila Ahmad',
      bankName: 'Mashreq Bank',
      accountNumber: '089120169858',
      iban: '',
      instructions: 'Please verify the details with the foundation before making a transfer. No online payment is processed on this website.',
      helpPhone: '03029616426',
      helpEmail: 'Saagarwelfarefoundation@gmail.com',
    });
    console.log('[Seed] Initialized approved donation bank details.');
  }

  // 4. Founder Content
  const founder = await FounderContent.findOne();
  if (!founder) {
    await FounderContent.create({
      name: 'Memoona',
      title: 'Founder, Saagar Foundation',
      portraitUrl: '',
      introduction: "The foundation's work is guided by a commitment to compassion, kindness, and service to humanity.",
      missionHighlight: "The mission of the Saagar Foundation is to help anyone in need, regardless of their circumstances, by providing support, resources, and assistance in whatever ways possible. Our goal is to make a positive difference in people's lives through compassion, kindness, and service to humanity.",
      visionHighlight: "The vision of the Saagar Foundation is to build something meaningful and lasting—an organization that continues to grow, serve, and make a difference for generations to come. Our dream is to create a foundation that stands the test of time, reaching as many people in need as possible and providing help wherever it is needed. We aspire to build a legacy of compassion, generosity, and service that lives on forever, touching countless lives and inspiring others to do the same.",
    });
    console.log('[Seed] Initialized approved founder content.');
  }

  console.log('[Seed] Database initialization complete!');
};

// If run directly via `node server/utils/seed.js`
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('[Seed] Process finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    });
}
