const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/book.model');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding...'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Book data
const books = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Set in the mid-1930s, it centers on one of the most widely read novels of all time.',
    genre: ['Fiction', 'Classic', 'Historical Fiction'],
    publishedYear: 1960,
    publisher: 'HarperCollins',
    language: 'English',
    pages: 336,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
    availableCopies: 5,
    totalCopies: 5,
    location: {
      shelf: 'A',
      section: '1'
    },
    averageRating: 4.3,
    ratingsCount: 87,
    featured: true
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    description: 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.',
    genre: ['Fiction', 'Classic', 'Dystopian'],
    publishedYear: 1949,
    publisher: 'Signet Classic',
    language: 'English',
    pages: 328,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg',
    availableCopies: 3,
    totalCopies: 3,
    location: {
      shelf: 'A',
      section: '2'
    },
    averageRating: 4.2,
    ratingsCount: 92,
    featured: true
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    description: 'The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted "gin was the national drink and sex the national obsession."',
    genre: ['Fiction', 'Classic', 'Literary Fiction'],
    publishedYear: 1925,
    publisher: 'Scribner',
    language: 'English',
    pages: 180,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg',
    availableCopies: 4,
    totalCopies: 4,
    location: {
      shelf: 'A',
      section: '3'
    },
    averageRating: 3.9,
    ratingsCount: 78,
    featured: true
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    description: 'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language.',
    genre: ['Fiction', 'Classic', 'Romance'],
    publishedYear: 1813,
    publisher: 'Penguin Classics',
    language: 'English',
    pages: 432,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg',
    availableCopies: 2,
    totalCopies: 2,
    location: {
      shelf: 'B',
      section: '1'
    },
    averageRating: 4.3,
    ratingsCount: 95,
    featured: true
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780547928227',
    description: 'Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep.',
    genre: ['Fantasy', 'Adventure', 'Classic'],
    publishedYear: 1937,
    publisher: 'Houghton Mifflin Harcourt',
    language: 'English',
    pages: 366,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg',
    availableCopies: 3,
    totalCopies: 3,
    location: {
      shelf: 'B',
      section: '2'
    },
    averageRating: 4.7,
    ratingsCount: 102,
    featured: false
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '9780316769488',
    description: 'The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield. Through circumstances that tend to preclude adult, secondhand description, he leaves his prep school in Pennsylvania and goes underground in New York City for three days.',
    genre: ['Fiction', 'Classic', 'Coming-of-Age'],
    publishedYear: 1951,
    publisher: 'Little, Brown and Company',
    language: 'English',
    pages: 277,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg',
    availableCopies: 2,
    totalCopies: 2,
    location: {
      shelf: 'B',
      section: '3'
    },
    averageRating: 3.8,
    ratingsCount: 68,
    featured: false
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    isbn: '9780618640157',
    description: 'One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them.',
    genre: ['Fantasy', 'Adventure', 'Classic'],
    publishedYear: 1954,
    publisher: 'Houghton Mifflin Harcourt',
    language: 'English',
    pages: 1178,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg',
    availableCopies: 1,
    totalCopies: 1,
    location: {
      shelf: 'C',
      section: '1'
    },
    averageRating: 4.9,
    ratingsCount: 115,
    featured: true
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    isbn: '9780590353427',
    description: 'Harry Potter has no idea how famous he is. That\'s because he\'s being raised by his miserable aunt and uncle who are terrified Harry will learn that he\'s really a wizard, just as his parents were.',
    genre: ['Fantasy', 'Young Adult', 'Magic'],
    publishedYear: 1997,
    publisher: 'Scholastic',
    language: 'English',
    pages: 309,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg',
    availableCopies: 4,
    totalCopies: 4,
    location: {
      shelf: 'C',
      section: '2'
    },
    averageRating: 4.8,
    ratingsCount: 132,
    featured: true
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    isbn: '9780061122415',
    description: 'Paulo Coelho\'s masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined.',
    genre: ['Fiction', 'Philosophy', 'Fantasy'],
    publishedYear: 1988,
    publisher: 'HarperOne',
    language: 'English',
    pages: 197,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg',
    availableCopies: 3,
    totalCopies: 3,
    location: {
      shelf: 'C',
      section: '3'
    },
    averageRating: 4.1,
    ratingsCount: 89,
    featured: false
  },
  {
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    isbn: '9780439023481',
    description: 'In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV.',
    genre: ['Young Adult', 'Dystopian', 'Science Fiction'],
    publishedYear: 2008,
    publisher: 'Scholastic Press',
    language: 'English',
    pages: 374,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg',
    availableCopies: 2,
    totalCopies: 2,
    location: {
      shelf: 'D',
      section: '1'
    },
    averageRating: 4.5,
    ratingsCount: 108,
    featured: false
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    isbn: '9780307474278',
    description: 'While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night. The elderly curator of the Louvre has been murdered inside the museum, his body covered in baffling symbols.',
    genre: ['Mystery', 'Thriller', 'Fiction'],
    publishedYear: 2003,
    publisher: 'Anchor',
    language: 'English',
    pages: 597,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1579621267i/968.jpg',
    availableCopies: 3,
    totalCopies: 3,
    location: {
      shelf: 'D',
      section: '2'
    },
    averageRating: 3.9,
    ratingsCount: 76,
    featured: false
  },
  {
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    isbn: '9781594631931',
    description: 'The unforgettable, heartbreaking story of the unlikely friendship between a wealthy boy and the son of his father\'s servant, The Kite Runner is a beautifully crafted novel set in a country that is in the process of being destroyed.',
    genre: ['Fiction', 'Historical Fiction', 'Contemporary'],
    publishedYear: 2003,
    publisher: 'Riverhead Books',
    language: 'English',
    pages: 371,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1579036753i/77203.jpg',
    availableCopies: 2,
    totalCopies: 2,
    location: {
      shelf: 'D',
      section: '3'
    },
    averageRating: 4.4,
    ratingsCount: 91,
    featured: false
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    isbn: '9780060850524',
    description: 'Brave New World is a dystopian novel by English author Aldous Huxley, written in 1931 and published in 1932. Largely set in a futuristic World State, inhabited by genetically modified citizens and an intelligence-based social hierarchy.',
    genre: ['Science Fiction', 'Dystopian', 'Classic'],
    publishedYear: 1932,
    publisher: 'Harper Perennial',
    language: 'English',
    pages: 288,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1575509280i/5129.jpg',
    availableCopies: 1,
    totalCopies: 1,
    location: {
      shelf: 'E',
      section: '1'
    },
    averageRating: 4.0,
    ratingsCount: 82,
    featured: false
  },
  {
    title: 'The Fault in Our Stars',
    author: 'John Green',
    isbn: '9780142424179',
    description: 'Despite the tumor-shrinking medical miracle that has bought her a few years, Hazel has never been anything but terminal, her final chapter inscribed upon diagnosis. But when a gorgeous plot twist named Augustus Waters suddenly appears at Cancer Kid Support Group, Hazel\'s story is about to be completely rewritten.',
    genre: ['Young Adult', 'Romance', 'Contemporary'],
    publishedYear: 2012,
    publisher: 'Dutton Books',
    language: 'English',
    pages: 313,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1360206420i/11870085.jpg',
    availableCopies: 4,
    totalCopies: 4,
    location: {
      shelf: 'E',
      section: '2'
    },
    averageRating: 4.2,
    ratingsCount: 97,
    featured: false
  },
  {
    title: 'The Shining',
    author: 'Stephen King',
    isbn: '9780307743657',
    description: 'Jack Torrance\'s new job at the Overlook Hotel is the perfect chance for a fresh start. As the off-season caretaker at the atmospheric old hotel, he\'ll have plenty of time to spend reconnecting with his family and working on his writing.',
    genre: ['Horror', 'Thriller', 'Fiction'],
    publishedYear: 1977,
    publisher: 'Anchor',
    language: 'English',
    pages: 447,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1353277730i/11588.jpg',
    availableCopies: 2,
    totalCopies: 2,
    location: {
      shelf: 'E',
      section: '3'
    },
    averageRating: 4.3,
    ratingsCount: 88,
    featured: false
  },
  {
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    isbn: '9780307454546',
    description: 'Harriet Vanger, a scion of one of Sweden\'s wealthiest families disappeared over forty years ago. All these years later, her aged uncle continues to seek the truth. He hires Mikael Blomkvist, a crusading journalist recently trapped by a libel conviction, to investigate.',
    genre: ['Mystery', 'Thriller', 'Crime'],
    publishedYear: 2005,
    publisher: 'Vintage Crime/Black Lizard',
    language: 'English',
    pages: 590,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327868566i/2429135.jpg',
    availableCopies: 1,
    totalCopies: 1,
    location: {
      shelf: 'F',
      section: '1'
    },
    averageRating: 4.1,
    ratingsCount: 79,
    featured: false
  },
  {
    title: 'The Road',
    author: 'Cormac McCarthy',
    isbn: '9780307387899',
    description: 'A father and his son walk alone through burned America. Nothing moves in the ravaged landscape save the ash on the wind. It is cold enough to crack stones, and when the snow falls it is gray.',
    genre: ['Fiction', 'Post-Apocalyptic', 'Dystopian'],
    publishedYear: 2006,
    publisher: 'Vintage',
    language: 'English',
    pages: 287,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1439197219i/6288.jpg',
    availableCopies: 2,
    totalCopies: 2,
    location: {
      shelf: 'F',
      section: '2'
    },
    averageRating: 4.0,
    ratingsCount: 74,
    featured: false
  },
  {
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    isbn: '9780307588371',
    description: 'On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne\'s fifth wedding anniversary. Presents are being wrapped and reservations are being made when Nick\'s clever and beautiful wife disappears.',
    genre: ['Mystery', 'Thriller', 'Fiction'],
    publishedYear: 2012,
    publisher: 'Crown Publishing Group',
    language: 'English',
    pages: 419,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1554086139i/19288043.jpg',
    availableCopies: 3,
    totalCopies: 3,
    location: {
      shelf: 'F',
      section: '3'
    },
    averageRating: 4.1,
    ratingsCount: 86,
    featured: false
  },
  {
    title: 'The Martian',
    author: 'Andy Weir',
    isbn: '9780553418026',
    description: 'Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. Now, he\'s sure he\'ll be the first person to die there. After a dust storm nearly kills him and forces his crew to evacuate while thinking him dead, Mark finds himself stranded and completely alone.',
    genre: ['Science Fiction', 'Adventure', 'Fiction'],
    publishedYear: 2011,
    publisher: 'Crown Publishing Group',
    language: 'English',
    pages: 369,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1413706054i/18007564.jpg',
    availableCopies: 2,
    totalCopies: 2,
    location: {
      shelf: 'G',
      section: '1'
    },
    averageRating: 4.5,
    ratingsCount: 93,
    featured: true
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    isbn: '9781250301697',
    description: 'Alicia Berenson\'s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London\'s most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.',
    genre: ['Thriller', 'Mystery', 'Fiction'],
    publishedYear: 2019,
    publisher: 'Celadon Books',
    language: 'English',
    pages: 325,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1582759969i/40097951.jpg',
    availableCopies: 3,
    totalCopies: 3,
    location: {
      shelf: 'G',
      section: '2'
    },
    averageRating: 4.2,
    ratingsCount: 89,
    featured: false
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    isbn: '9780399590504',
    description: 'Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when one of Tara\'s older brothers became violent.',
    genre: ['Memoir', 'Biography', 'Nonfiction'],
    publishedYear: 2018,
    publisher: 'Random House',
    language: 'English',
    pages: 334,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg',
    availableCopies: 2,
    totalCopies: 2,
    location: {
      shelf: 'G',
      section: '3'
    },
    averageRating: 4.5,
    ratingsCount: 96,
    featured: false
  },
  {
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    isbn: '9780735219090',
    description: 'For years, rumors of the "Marsh Girl" have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl.',
    genre: ['Fiction', 'Mystery', 'Historical Fiction'],
    publishedYear: 2018,
    publisher: 'G.P. Putnam\'s Sons',
    language: 'English',
    pages: 368,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1582135294i/36809135.jpg',
    availableCopies: 1,
    totalCopies: 1,
    location: {
      shelf: 'H',
      section: '1'
    },
    averageRating: 4.6,
    ratingsCount: 105,
    featured: true
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    description: 'In Sapiens, Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical – and sometimes devastating – breakthroughs of the Cognitive, Agricultural and Scientific Revolutions.',
    genre: ['Nonfiction', 'History', 'Science'],
    publishedYear: 2011,
    publisher: 'Harper',
    language: 'English',
    pages: 443,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1595674533i/23692271.jpg',
    availableCopies: 2,
    totalCopies: 2,
    location: {
      shelf: 'H',
      section: '2'
    },
    averageRating: 4.4,
    ratingsCount: 92,
    featured: false
  },
  {
    title: 'The Handmaid\'s Tale',
    author: 'Margaret Atwood',
    isbn: '9780385490818',
    description: 'Offred is a Handmaid in the Republic of Gilead. She may leave the home of the Commander and his wife once a day to walk to food markets whose signs are now pictures instead of words because women are no longer allowed to read.',
    genre: ['Fiction', 'Dystopian', 'Science Fiction'],
    publishedYear: 1985,
    publisher: 'Anchor',
    language: 'English',
    pages: 311,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1578028274i/38447.jpg',
    availableCopies: 3,
    totalCopies: 3,
    location: {
      shelf: 'H',
      section: '3'
    },
    averageRating: 4.1,
    ratingsCount: 83,
    featured: false
  },
  {
    title: 'The Book Thief',
    author: 'Markus Zusak',
    isbn: '9780375842207',
    description: 'It is 1939. Nazi Germany. The country is holding its breath. Death has never been busier, and will become busier still. Liesel Meminger is a foster girl living outside of Munich, who scratches out a meager existence for herself by stealing when she encounters something she can\'t resist–books.',
    genre: ['Historical Fiction', 'Fiction', 'Young Adult'],
    publishedYear: 2005,
    publisher: 'Alfred A. Knopf',
    language: 'English',
    pages: 552,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1522157426i/19063.jpg',
    availableCopies: 2,
    totalCopies: 2,
    location: {
      shelf: 'I',
      section: '1'
    },
    averageRating: 4.6,
    ratingsCount: 99,
    featured: true
  },
  {
    title: 'The Giver',
    author: 'Lois Lowry',
    isbn: '9780544336261',
    description: 'The Giver, the 1994 Newbery Medal winner, has become one of the most influential novels of our time. The haunting story centers on twelve-year-old Jonas, who lives in a seemingly ideal, if colorless, world of conformity and contentment.',
    genre: ['Young Adult', 'Dystopian', 'Science Fiction'],
    publishedYear: 1993,
    publisher: 'HMH Books for Young Readers',
    language: 'English',
    pages: 240,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1342493368i/3636.jpg',
    availableCopies: 4,
    totalCopies: 4,
    location: {
      shelf: 'I',
      section: '2'
    },
    averageRating: 4.1,
    ratingsCount: 81,
    featured: false
  },
  {
    title: 'The Night Circus',
    author: 'Erin Morgenstern',
    isbn: '9780307744432',
    description: 'The circus arrives without warning. No announcements precede it. It is simply there, when yesterday it was not. Within the black-and-white striped canvas tents is an utterly unique experience full of breathtaking amazements. It is called Le Cirque des Rêves, and it is only open at night.',
    genre: ['Fantasy', 'Fiction', 'Romance'],
    publishedYear: 2011,
    publisher: 'Anchor',
    language: 'English',
    pages: 516,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1387124618i/9361589.jpg',
    availableCopies: 1,
    totalCopies: 1,
    location: {
      shelf: 'I',
      section: '3'
    },
    averageRating: 4.3,
    ratingsCount: 87,
    featured: false
  }
];

// Import data function
const importData = async () => {
  try {
    await Book.deleteMany(); // Clear existing data
    await Book.insertMany(books);
    console.log('Data successfully imported!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Delete data function
const deleteData = async () => {
  try {
    await Book.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
};

// Process command line arguments
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('Please specify --import or --delete');
  process.exit();
}
