const { Book, addBook, findBookByTitle, getFilteredBooks, findBookById } = require('../models/bookModel');


// Create book:
const createBook = (req, res) => {
    const {title, author, year, price, genres} = req.body;

    // Validations checks:

    const existingBook = findBookByTitle(title)
    if (existingBook){
        return res.status(409).json({ errorMessage: `Error: Book with the title [${title}] already exists in the system` })
    }

    if (year < 1940 || year > 2100){
        return res.status(409).json({ errorMessage: `Error: Can't create new Book that its year [${year}] is not in the accepted range [1940 -> 2100]` });
    }

    if (price < 0){
        return res.status(409).json({ errorMessage: `Error: Can't create new Book with negative price` });
    }

    // Create new book:

    const newBook = new Book(title, author, year, price, genres)
    addBook(newBook)

    // Respond with the new book's ID
    res.status(200).json({ result: newBook.id });

}

// get totla books:

const getTotalBooks = (req, res) => {
    const filters = {
        author: req.query.author,
        priceBiggerThan: req.query['price-bigger-than'] ? parseFloat(req.query['price-bigger-than']) : null,
        priceLessThan: req.query['price-less-than'] ? parseFloat(req.query['price-less-than']) : null,
        yearBiggerThan: req.query['year-bigger-than'] ? parseInt(req.query['year-bigger-than']) : null,
        yearLessThan: req.query['year-less-than'] ? parseInt(req.query['year-less-than']) : null,
        genres: req.query.genres
    }

    if (filters.genres){
        const validGenres = ["SCI_FI", "NOVEL", "HISTORY", "MANGA", "ROMANCE", "PROFESSIONAL"];
        const genresArray = filters.genres.split(',');
        for (const genre of genresArray) {
            if (!validGenres.includes(genre)) {
                return res.status(400).json({ errorMessage: `Error: Invalid genre [${genre}]` });
            }
        }
    }

    const filteredBooks = getFilteredBooks(filters);
    res.status(200).json({result: filteredBooks.length})
}

// Get books:
const getBooks = (req, res) => {
    const filters = {
        author: req.query.author,
        priceBiggerThan: req.query['price-bigger-than'] ? parseFloat(req.query['price-bigger-than']) : null,
        priceLessThan: req.query['price-less-than'] ? parseFloat(req.query['price-less-than']) : null,
        yearBiggerThan: req.query['year-bigger-than'] ? parseInt(req.query['year-bigger-than']) : null,
        yearLessThan: req.query['year-less-than'] ? parseInt(req.query['year-less-than']) : null,
        genres: req.query.genres
    };

    if (filters.genres) {
        const validGenres = ["SCI_FI", "NOVEL", "HISTORY", "MANGA", "ROMANCE", "PROFESSIONAL"];
        const genresArray = filters.genres.split(',');
        for (const genre of genresArray) {
            if (!validGenres.includes(genre)) {
                return res.status(400).json({ errorMessage: `Error: Invalid genre [${genre}]` });
            }
        }
    }

    let filteredBooks = getFilteredBooks(filters);

    // Sort the books by title (case insensitive)
    filteredBooks = filteredBooks.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

    res.status(200).json(filteredBooks);
};

//Get single book data:
const getBookById = (req, res) => {
    const bookId = parseInt(req.query.id)
    const book = findBookById(bookId)

    if (!book){
        return res.status(404).json({
            errorMessage: `Error: no such Book with id ${bookId}`
        })
    }

    res.status(200).json(book)
}


module.exports = {
    createBook,
    getTotalBooks,
    getBooks,
    getBookById
};