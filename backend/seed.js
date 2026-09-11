const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Show = require('./models/Show');
const Booking = require('./models/Booking');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/movie_booking');
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Error connecting to DB:', error.message);
    process.exit(1);
  }
};

const generateSeats = (rows = ['A', 'B', 'C', 'D', 'E', 'F'], seatsPerRow = 10) => {
  const seats = [];
  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        seatNumber: `${row}${i}`,
        row: row,
        number: i,
        status: 'AVAILABLE',
        lockedBy: null,
        lockedUntil: null,
      });
    }
  });
  return seats;
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await User.deleteMany();
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();

    console.log('Cleared existing data.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@moviebooking.com',
      password: 'admin123',
      role: 'admin',
    });

    const regularUser = await User.create({
      name: 'Rahul Sharma',
      email: 'user@moviebooking.com',
      password: 'user123',
      role: 'user',
    });

    console.log('Seeded Users: admin@moviebooking.com & user@moviebooking.com');

    // 2. Create Theatres
    const theatres = await Theatre.insertMany([
      {
        name: 'PVR Cinemas',
        location: 'Chandigarh',
        address: 'Elante Mall, Industrial Area Phase I',
        screens: [
          { name: 'Screen 1 (IMAX)', totalSeats: 60, rows: ['A', 'B', 'C', 'D', 'E', 'F'], seatsPerRow: 10 },
          { name: 'Screen 2 (Gold)', totalSeats: 50, rows: ['A', 'B', 'C', 'D', 'E'], seatsPerRow: 10 },
        ],
      },
      {
        name: 'Cinepolis Megaplex',
        location: 'Chandigarh',
        address: 'Sector 17 City Centre',
        screens: [
          { name: 'Screen 1', totalSeats: 60, rows: ['A', 'B', 'C', 'D', 'E', 'F'], seatsPerRow: 10 },
          { name: 'Screen 2 (4DX)', totalSeats: 60, rows: ['A', 'B', 'C', 'D', 'E', 'F'], seatsPerRow: 10 },
        ],
      },
      {
        name: 'INOX Multiplex',
        location: 'Mohali',
        address: 'CP67 Mall, Sector 67',
        screens: [
          { name: 'Screen 1', totalSeats: 60, rows: ['A', 'B', 'C', 'D', 'E', 'F'], seatsPerRow: 10 },
        ],
      },
    ]);

    console.log(`Seeded ${theatres.length} Theatres`);

    // 3. Create Movies
    const movies = await Movie.insertMany([
      {
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        language: 'English',
        duration: 181,
        releaseDate: new Date('2026-04-26'),
        poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80',
        rating: 9.2,
        director: 'Anthony Russo, Joe Russo',
        cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
        genre: ['Sci-Fi', 'Action', 'Thriller'],
        language: 'English',
        duration: 148,
        releaseDate: new Date('2026-07-16'),
        poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
        rating: 8.8,
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
      },
      {
        title: 'Interstellar',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        genre: ['Adventure', 'Drama', 'Sci-Fi'],
        language: 'English',
        duration: 169,
        releaseDate: new Date('2026-11-07'),
        poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=80',
        rating: 8.7,
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        genre: ['Action', 'Crime', 'Drama'],
        language: 'English',
        duration: 152,
        releaseDate: new Date('2026-07-18'),
        poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=80',
        rating: 9.0,
        director: 'Christopher Nolan',
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Gary Oldman'],
      },
      {
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
        genre: ['Animation', 'Action', 'Adventure'],
        language: 'English',
        duration: 140,
        releaseDate: new Date('2026-06-02'),
        poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1400&q=80',
        rating: 8.9,
        director: 'Joaquim Dos Santos, Kemp Powers',
        cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
      },
    ]);

    console.log(`Seeded ${movies.length} Movies`);

    // Helper to get formatted date string YYYY-MM-DD
    const formatDate = (offsetDays = 0) => {
      const d = new Date();
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };

    const dates = [formatDate(0), formatDate(1), formatDate(2)];

    // 4. Create Shows
    const showsToCreate = [];

    // Avengers shows
    const avengers = movies[0];
    const pvr = theatres[0];
    const cinepolis = theatres[1];

    dates.forEach((date) => {
      // PVR Screen 1 shows
      const seats1 = generateSeats(['A', 'B', 'C', 'D', 'E', 'F'], 10);
      // Pre-book A1 and A2 on today's show for demo purposes
      if (date === dates[0]) {
        seats1[0].status = 'BOOKED';
        seats1[0].bookedBy = regularUser._id;
        seats1[0].bookingCode = 'MVB-100201';
        seats1[1].status = 'BOOKED';
        seats1[1].bookedBy = regularUser._id;
        seats1[1].bookingCode = 'MVB-100201';
      }

      showsToCreate.push({
        movieId: avengers._id,
        theatreId: pvr._id,
        screen: 'Screen 1 (IMAX)',
        date,
        startTime: '14:30',
        price: 350,
        seats: seats1,
      });

      showsToCreate.push({
        movieId: avengers._id,
        theatreId: pvr._id,
        screen: 'Screen 1 (IMAX)',
        date,
        startTime: '18:30',
        price: 400,
        seats: generateSeats(['A', 'B', 'C', 'D', 'E', 'F'], 10),
      });

      showsToCreate.push({
        movieId: avengers._id,
        theatreId: cinepolis._id,
        screen: 'Screen 1',
        date,
        startTime: '21:00',
        price: 300,
        seats: generateSeats(['A', 'B', 'C', 'D', 'E', 'F'], 10),
      });

      // Inception shows
      showsToCreate.push({
        movieId: movies[1]._id,
        theatreId: pvr._id,
        screen: 'Screen 2 (Gold)',
        date,
        startTime: '16:00',
        price: 320,
        seats: generateSeats(['A', 'B', 'C', 'D', 'E'], 10),
      });

      // Interstellar shows
      showsToCreate.push({
        movieId: movies[2]._id,
        theatreId: cinepolis._id,
        screen: 'Screen 2 (4DX)',
        date,
        startTime: '19:45',
        price: 380,
        seats: generateSeats(['A', 'B', 'C', 'D', 'E', 'F'], 10),
      });

      // The Dark Knight shows
      showsToCreate.push({
        movieId: movies[3]._id,
        theatreId: theatres[2]._id,
        screen: 'Screen 1',
        date,
        startTime: '20:15',
        price: 280,
        seats: generateSeats(['A', 'B', 'C', 'D', 'E', 'F'], 10),
      });
    });

    const createdShows = await Show.insertMany(showsToCreate);
    console.log(`Seeded ${createdShows.length} Shows`);

    // 5. Create a demo booking for user
    const demoShow = createdShows[0];
    await Booking.create({
      userId: regularUser._id,
      showId: demoShow._id,
      seats: ['A1', 'A2'],
      totalAmount: demoShow.price * 2,
      bookingCode: 'MVB-100201',
      paymentMethod: 'PAY_AT_COUNTER',
      paymentStatus: 'PENDING',
      bookingStatus: 'CONFIRMED',
    });

    console.log('Seeded sample booking: MVB-100201');

    console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
    console.log('Admin login: admin@moviebooking.com / admin123');
    console.log('User login:  user@moviebooking.com  / user123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
