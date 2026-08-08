import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/shared/libs/mongodb';
import { User } from '../src/features/users/server/user.model';
import { CourtListing } from '../src/features/listing/server/courtListing.model';
import { Booking } from '../src/features/booking/server/booking.model';
import { Review } from '../src/features/review/server/review.model';
import { CourtListingStatus, SportType } from '../src/features/listing/constants';

const DEMO_PASSWORD = 'Demo1234!';

const BASKETBALL_PHOTOS = [
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
  'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80',
];

const BADMINTON_PHOTOS = [
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
  'https://images.unsplash.com/photo-1613918431703-aa50889e3be7?w=800&q=80',
];

const TENNIS_PHOTOS = [
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80',
];

const FUTSAL_PHOTOS = [
  'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function dailyHours(open: string, close: string) {
  return Object.fromEntries(DAYS.map((d) => [d, { openingTime: open, closingTime: close }]));
}

function weekdayWeekendHours(
  wdOpen: string, wdClose: string,
  weOpen: string, weClose: string,
) {
  return Object.fromEntries(DAYS.map((d) => {
    const isWeekend = d === 'saturday' || d === 'sunday';
    return [d, { openingTime: isWeekend ? weOpen : wdOpen, closingTime: isWeekend ? weClose : wdClose }];
  }));
}

const REVIEW_NOTES = [
  'Great court! Will definitely book again.',
  'Clean facility and well-maintained.',
  'Loved the lighting and smooth floor.',
  'Convenient location, easy to find.',
  'Good value for the price.',
  'Staff was friendly and accommodating.',
  'Perfect for our team practice sessions.',
  'The aircon was a lifesaver during summer.',
  null,
  null,
];

const RATINGS = [5, 5, 4, 5, 4, 4, 3, 5, 4, 5];

async function main() {
  await connectDB();
  console.log('Connected to MongoDB');

  await Promise.all([
    Review.deleteMany({}),
    Booking.deleteMany({}),
    CourtListing.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log('Collections cleared');

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const [owner1, owner2, owner3] = await User.insertMany([
    { name: 'Juan dela Cruz', email: 'owner1@demo.com', role: ['owner'], provider: 'credentials', passwordHash },
    { name: 'Maria Santos', email: 'owner2@demo.com', role: ['owner'], provider: 'credentials', passwordHash },
    { name: 'Pedro Reyes', email: 'owner3@demo.com', role: ['owner'], provider: 'credentials', passwordHash },
  ]);

  const [booker1, booker2, booker3] = await User.insertMany([
    { name: 'Ana Garcia', email: 'booker1@demo.com', role: ['booker'], provider: 'credentials', passwordHash },
    { name: 'Carlo Mendoza', email: 'booker2@demo.com', role: ['booker'], provider: 'credentials', passwordHash },
    { name: 'Lisa Tan', email: 'booker3@demo.com', role: ['booker'], provider: 'credentials', passwordHash },
  ]);
  console.log('6 users created (3 owners, 3 bookers)');

  const courtData = [
    // ── Owner 1 (5 courts) ──────────────────────────────────────────────────
    {
      ownerId: owner1._id,
      name: 'BGC Hoops Court',
      sport: SportType.BASKETBALL,
      city: 'Taguig',
      fullAddress: {
        line1: '2nd Floor, One BGC Tower',
        barangay: 'Fort Bonifacio',
        city: 'Taguig',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1634',
      },
      pricePerHour: 700,
      operatingHours: dailyHours('06:00', '22:00'),
      description: 'Full-size indoor basketball court in the heart of BGC. Hardwood flooring, LED lighting, and airconditioning for a premium playing experience.',
      photos: BASKETBALL_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner1._id,
      name: 'Mandaluyong Sports Complex',
      sport: SportType.BASKETBALL,
      city: 'Mandaluyong',
      fullAddress: {
        line1: '45 Boni Avenue',
        barangay: 'Addition Hills',
        city: 'Mandaluyong',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1550',
      },
      pricePerHour: 500,
      operatingHours: weekdayWeekendHours('07:00', '21:00', '06:00', '22:00'),
      description: 'Affordable covered basketball court with concrete flooring. Great for casual games and practice sessions near the EDSA area.',
      photos: BASKETBALL_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner1._id,
      name: 'BGC Badminton Studio',
      sport: SportType.BADMINTON,
      city: 'Taguig',
      fullAddress: {
        line1: '3rd Floor, Net Park Building',
        barangay: 'Fort Bonifacio',
        city: 'Taguig',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1634',
      },
      pricePerHour: 400,
      operatingHours: dailyHours('08:00', '23:00'),
      description: 'Four dedicated badminton courts with synthetic flooring and shuttle-compatible ceiling height. Shuttle birds included in the rate.',
      photos: BADMINTON_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner1._id,
      name: 'Fort Bonifacio Tennis Club',
      sport: SportType.TENNIS,
      city: 'Taguig',
      fullAddress: {
        line1: '7 Lawton Avenue',
        barangay: 'Fort Bonifacio',
        city: 'Taguig',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1634',
      },
      pricePerHour: 900,
      operatingHours: dailyHours('06:00', '21:00'),
      description: 'Two clay tennis courts with professional lighting and sideline seating. Ideal for singles and doubles matches in BGC.',
      photos: TENNIS_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner1._id,
      name: 'BGC Futsal Zone',
      sport: SportType.FUTSAL,
      city: 'Taguig',
      fullAddress: {
        line1: 'Ground Floor, Uptown Mall Annex',
        barangay: 'Fort Bonifacio',
        city: 'Taguig',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1634',
      },
      pricePerHour: 1100,
      operatingHours: dailyHours('08:00', '23:00'),
      description: 'Indoor astroturf futsal court with goals, bibs, and a ball included. Air-conditioned facility open for early morning and late-night bookings.',
      photos: FUTSAL_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },

    // ── Owner 2 (5 courts) ──────────────────────────────────────────────────
    {
      ownerId: owner2._id,
      name: 'Makati Sports Hub',
      sport: SportType.BASKETBALL,
      city: 'Makati',
      fullAddress: {
        line1: '12 Dela Rosa Street',
        barangay: 'Bel-Air',
        city: 'Makati',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1209',
      },
      pricePerHour: 650,
      operatingHours: dailyHours('06:00', '22:00'),
      description: 'Semi-indoor basketball court in the Makati CBD. Convenient for corporate lunch break games and after-work sessions.',
      photos: BASKETBALL_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner2._id,
      name: 'QC Hardwood Center',
      sport: SportType.BASKETBALL,
      city: 'Quezon City',
      fullAddress: {
        line1: '88 Katipunan Avenue',
        barangay: 'Diliman',
        city: 'Quezon City',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1101',
      },
      pricePerHour: 550,
      operatingHours: weekdayWeekendHours('06:00', '22:00', '07:00', '23:00'),
      description: 'Full-size hardwood basketball court near the university belt. Popular for student teams, pickup games, and inter-barangay leagues.',
      photos: BASKETBALL_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner2._id,
      name: 'Makati Street Court',
      sport: SportType.BASKETBALL,
      city: 'Makati',
      fullAddress: {
        line1: '5 Jupiter Street',
        barangay: 'San Lorenzo Village',
        city: 'Makati',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1223',
      },
      pricePerHour: 450,
      operatingHours: dailyHours('07:00', '22:00'),
      description: 'Budget-friendly half-court with rubber flooring. Perfect for casual 3-on-3 games in the Makati residential area.',
      photos: BASKETBALL_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner2._id,
      name: 'Makati Smash Badminton',
      sport: SportType.BADMINTON,
      city: 'Makati',
      fullAddress: {
        line1: '2nd Floor, Greenbelt 5 Annex',
        barangay: 'Legazpi Village',
        city: 'Makati',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1229',
      },
      pricePerHour: 350,
      operatingHours: dailyHours('06:00', '22:00'),
      description: 'Six badminton courts with wooden flooring and professional shuttle service. Lockers and shower rooms available on-site.',
      photos: BADMINTON_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner2._id,
      name: 'QC Tennis Center',
      sport: SportType.TENNIS,
      city: 'Quezon City',
      fullAddress: {
        line1: '100 Commonwealth Avenue',
        barangay: 'Commonwealth',
        city: 'Quezon City',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1119',
      },
      pricePerHour: 800,
      operatingHours: dailyHours('06:00', '22:00'),
      description: 'Hard-surface tennis courts with night lighting and equipment rental. Great for beginners and seasoned players in QC.',
      photos: TENNIS_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },

    // ── Owner 3 (5 courts) ──────────────────────────────────────────────────
    {
      ownerId: owner3._id,
      name: 'Pasig Hoops Arena',
      sport: SportType.BASKETBALL,
      city: 'Pasig',
      fullAddress: {
        line1: '33 Ortigas Avenue Extension',
        barangay: 'Kapitolyo',
        city: 'Pasig',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1603',
      },
      pricePerHour: 600,
      operatingHours: weekdayWeekendHours('07:00', '21:00', '06:00', '23:00'),
      description: 'Regulation-size covered basketball court near the Ortigas business district. Popular for league games and corporate tournaments.',
      photos: BASKETBALL_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner3._id,
      name: 'QC Shuttlers Hub',
      sport: SportType.BADMINTON,
      city: 'Quezon City',
      fullAddress: {
        line1: '15 Mindanao Avenue',
        barangay: 'Batasan Hills',
        city: 'Quezon City',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1126',
      },
      pricePerHour: 380,
      operatingHours: dailyHours('08:00', '23:00'),
      description: 'Three badminton courts with rubberized flooring and bright LED lighting. Open late for after-work sessions in northern QC.',
      photos: BADMINTON_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner3._id,
      name: 'Pasig Tennis Courts',
      sport: SportType.TENNIS,
      city: 'Pasig',
      fullAddress: {
        line1: '78 Shaw Boulevard',
        barangay: 'Oranbo',
        city: 'Pasig',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1600',
      },
      pricePerHour: 750,
      operatingHours: dailyHours('06:00', '21:00'),
      description: 'Two synthetic grass tennis courts with retractable shade. Racket and ball rental available at the reception.',
      photos: TENNIS_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner3._id,
      name: 'Mandaluyong Futsal Arena',
      sport: SportType.FUTSAL,
      city: 'Mandaluyong',
      fullAddress: {
        line1: '20 Pioneer Street',
        barangay: 'Barangka',
        city: 'Mandaluyong',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1553',
      },
      pricePerHour: 950,
      operatingHours: dailyHours('06:00', '22:00'),
      description: 'Premium indoor futsal facility with astroturf surface, changing rooms, and a viewing area. All equipment is provided.',
      photos: FUTSAL_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
    {
      ownerId: owner3._id,
      name: 'Pasig Futsal Park',
      sport: SportType.FUTSAL,
      city: 'Pasig',
      fullAddress: {
        line1: '55 C5 Road',
        barangay: 'Ugong',
        city: 'Pasig',
        province: 'Metro Manila',
        region: 'National Capital Region',
        postalCode: '1604',
      },
      pricePerHour: 850,
      operatingHours: dailyHours('08:00', '23:00'),
      description: 'Covered outdoor futsal court with artificial turf. Suitable for both 5-a-side and 7-a-side formats. Floodlit for night games.',
      photos: FUTSAL_PHOTOS,
      status: CourtListingStatus.ACTIVE,
    },
  ];

  const courts = await CourtListing.insertMany(courtData);
  console.log(`${courts.length} courts created`);

  const bookers = [booker1, booker2, booker3];
  let ratingCursor = 0;
  let noteCursor = 0;
  let bookingCount = 0;
  let reviewCount = 0;

  for (let i = 0; i < courts.length; i++) {
    const court = courts[i];
    const numReviews = i % 2 === 0 ? 3 : 2;
    let totalRating = 0;

    for (let j = 0; j < numReviews; j++) {
      const booker = bookers[(i + j) % 3];

      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() - ((i + 2) * 5 + j * 3));
      bookingDate.setHours(0, 0, 0, 0);

      const startHour = 8 + j * 2;
      const booking = await Booking.create({
        bookerId: booker._id,
        courtListingId: court._id,
        date: bookingDate,
        startTime: `${String(startHour).padStart(2, '0')}:00`,
        endTime: `${String(startHour + 2).padStart(2, '0')}:00`,
        totalPrice: Number(court.pricePerHour) * 2,
        status: 'completed',
        paymentRefId: `SEED-${new mongoose.Types.ObjectId().toHexString()}`,
      });
      bookingCount++;

      const rating = RATINGS[ratingCursor % RATINGS.length];
      ratingCursor++;
      const note = REVIEW_NOTES[noteCursor % REVIEW_NOTES.length];
      noteCursor++;

      await Review.create({
        bookingId: booking._id,
        bookerId: booker._id,
        courtListingId: court._id,
        rating,
        note,
      });
      reviewCount++;
      totalRating += rating;
    }

    const averageRating = Math.round((totalRating / numReviews) * 10) / 10;
    await CourtListing.findByIdAndUpdate(court._id, { averageRating, reviewCount: numReviews });
  }

  console.log(`${bookingCount} bookings created`);
  console.log(`${reviewCount} reviews created`);

  console.log('\nSeed complete!');
  console.log('\nDemo credentials (password: Demo1234!)');
  console.log('Owners : owner1@demo.com | owner2@demo.com | owner3@demo.com');
  console.log('Bookers: booker1@demo.com | booker2@demo.com | booker3@demo.com');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  mongoose.disconnect();
  process.exit(1);
});
