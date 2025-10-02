const BASE_URL = 'http://localhost:3000';
const currentUser = { id: 1, username: 'pouros' };

document.addEventListener("DOMContentLoaded", function() {
    fetchBooks();
});

function fetchBooks() {
    fetch(`${BASE_URL}/books`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
    })
    .then(books => {
        const list = document.getElementById('list');
        list.innerHTML = '';
        books.forEach(book => {
            const li = document.createElement('li');
            li.textContent = book.title;
            li.addEventListener('click', () => showBook(book.id));
            list.appendChild(li);
        });
    })
    .catch(error => {
        alert('Failed to fetch books: ' + error.message);
    });
}

function showBook(bookId) {
    fetch(`${BASE_URL}/books/${bookId}`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
    })
    .then(book => {
        const panel = document.getElementById('show-panel');
        panel.innerHTML = `
            <img src="${book.img_url}" alt="${book.title}">
            <p>${book.description}</p>
            <ul id="users-list">
                ${book.users.map(user => `<li>${user.username}</li>`).join('')}
            </ul>
            <button id="like-btn">${book.users.some(u => u.id === currentUser.id) ? 'Unlike' : 'Like'}</button>
        `;
        document.getElementById('like-btn').addEventListener('click', () => toggleLike(book));
    })
    .catch(error => {
        alert('Failed to fetch book details: ' + error.message);
    });
}

function toggleLike(book) {
    const isLiked = book.users.some(u => u.id === currentUser.id);
    let newUsers;
    if (isLiked) {
        newUsers = book.users.filter(u => u.id !== currentUser.id);
    } else {
        newUsers = [...book.users, currentUser];
    }
    fetch(`${BASE_URL}/books/${book.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users: newUsers })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
    })
    .then(updatedBook => {
        showBook(updatedBook.id); // refresh the panel
    })
    .catch(error => {
        alert('Failed to update like status: ' + error.message);
    });
}
