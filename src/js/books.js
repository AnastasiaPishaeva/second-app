import '../css/books.css';
import '../css/style.css';
class BookLibrary {
    constructor() {
        this.apiBaseUrl = 'https://openlibrary.org';
        this.currentPage = 1;
        this.booksPerPage = 12;
        this.currentSearchQuery = '';
        this.initializeEventListeners();
        this.loadInitialBooks();
    }

    initializeEventListeners() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.addEventListener('click', () => {
            this.loadMoreBooks();
        });
    }

    async loadInitialBooks() {
        this.showLoading();
        this.currentPage = 1;
        this.currentSearchQuery = '';

        try {
            const books = await this.getTrendingBooks();
            this.displayBooks(books, 'Popular books');
        } catch (error) {
            console.error('Error loading initial books:', error);
            this.showError('Book loading error. Please try again.');
        }
    }

    async performSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();
        
        if (!query) {
            alert('Please enter a search query.');
            return;
        }

        this.currentSearchQuery = query;
        this.currentPage = 1;
        
        this.showLoading();
        
        try {
            const books = await this.searchBooks(query, 1);
            this.displayBooks(books, `Search results:: "${query}"`);
        } catch (error) {
            console.error('Error searching books:', error);
            this.showError('Search error. Try again.');
        }
    }

    async loadMoreBooks() {
        this.currentPage++;
        const loading = document.getElementById('loading');
        loading.style.display = 'flex';

        try {
            let books;

            if (this.currentSearchQuery) {
                books = await this.searchBooks(this.currentSearchQuery, this.currentPage);
            } else {
                books = await this.getTrendingBooks(this.currentPage);
            }

            this.appendBooks(books);
        } catch (error) {
            console.error('Error loading more books:', error);
            this.showError('Error loading additional books.');
        } finally {
            loading.style.display = 'none';
        }
    }

    async searchBooks(query, page = 1) {
        const offset = (page - 1) * this.booksPerPage;
        const url = `${this.apiBaseUrl}/search.json?q=${encodeURIComponent(query)}&limit=${this.booksPerPage}&offset=${offset}&fields=key,title,author_name,first_publish_year,subject,cover_i,isbn,number_of_pages_median,ratings_average,description`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.docs && data.docs.length > 0) {
            return data.docs;
        } else {
            throw new Error('No books found');
        }
    }


    async getTrendingBooks(page = 1) {
        const popularTerms = ['bestseller', 'popular', 'classic', 'award'];
        const randomTerm = popularTerms[Math.floor(Math.random() * popularTerms.length)];
        return await this.searchBooks(randomTerm, page);
    }

    async getRandomBooks() {
        const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        return await this.searchBooks(randomLetter, 1);
    }

    async getBookDetails(workKey) {
        const url = `${this.apiBaseUrl}${workKey}.json`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.covers && data.covers.length > 0) {
            data.cover_i = data.covers[0];
        }

        return data;
    }

    showLoading() {
        const loading = document.getElementById('loading');
        const booksGallery = document.getElementById('booksGallery');
        
        loading.style.display = 'flex';
        booksGallery.style.display = 'none';
    }

    displayBooks(books, categoryTitle) {
        const loading = document.getElementById('loading');
        const booksGallery = document.getElementById('booksGallery');
        const categoryTitleElement = document.getElementById('categoryTitle');
        const booksGrid = document.getElementById('booksGrid');

        categoryTitleElement.textContent = categoryTitle;
        booksGrid.innerHTML = '';

        books.forEach(book => {
            this.addBookCard(book, booksGrid);
        });

        loading.style.display = 'none';
        booksGallery.style.display = 'block';
        booksGallery.style.opacity = '0';
        booksGallery.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            booksGallery.style.transition = 'all 0.5s ease';
            booksGallery.style.opacity = '1';
            booksGallery.style.transform = 'translateY(0)';
        }, 100);
    }

    appendBooks(books) {
        const booksGrid = document.getElementById('booksGrid');
        
        books.forEach(book => {
            this.addBookCard(book, booksGrid);
        });
    }

    addBookCard(book, container) {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        const title = book.title || 'Unknown book';
        const author = book.author_name ? book.author_name[0] : (book.authors ? book.authors[0].name : 'Unknown author');
        const year = book.first_publish_year || book.publish_date || '';
        const subjects = book.subject ? book.subject.slice(0, 3) : [];
        const description = book.description ? (typeof book.description === 'string' ? book.description : book.description.value || '') : '';
        const rating = book.ratings_average || 0;
        const pages = book.number_of_pages_median || '';
        let coverUrl = '';
        if (book.cover_i) {
            coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
        } else if (book.isbn && book.isbn[0]) {
            coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`;
        }

        bookCard.innerHTML = `
            <img src="${coverUrl}" alt="${title}" class="book-cover" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEgxODBWMjgwSDIwVjIwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNMzAgNDBIMTcwVjI3MEgzMFY0MFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LXNpemU9IjE0Ij5ObyBDb3ZlcjwvdGV4dD4KPC9zdmc+'">
            <div class="book-info">
                <div class="book-title">${this.truncateText(title, 60)}</div>
                <div class="book-author">${this.truncateText(author, 40)}</div>
                ${year ? `<div class="book-year">${year}${pages ? ` • ${pages} стр.` : ''}</div>` : ''}
                ${subjects.length > 0 ? `
                    <div class="book-subjects">
                        ${subjects.map(subject => `<span class="subject-tag">${this.truncateText(subject, 15)}</span>`).join('')}
                    </div>
                ` : ''}
                ${description ? `<div class="book-description">${this.truncateText(description, 120)}</div>` : ''}
                ${rating > 0 ? `
                    <div class="book-rating">
                        ${rating.toFixed(1)}/5
                    </div>
                ` : ''}
            </div>
        `;

        container.appendChild(bookCard);
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    showError(message) {
        const loading = document.getElementById('loading');
        const booksGallery = document.getElementById('booksGallery');
        const booksGrid = document.getElementById('booksGrid');
        
        loading.style.display = 'none';
        booksGallery.style.display = 'block';
        
        booksGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #FF6B6B;">
                <h3>${message}</h3>
                <p>Try selecting a different category or searching in a different way</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BookLibrary();
});
