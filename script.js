document.addEventListener('DOMContentLoaded', function () {
    // Menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    body.appendChild(overlay);

    // Toggle menu function
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        sideMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
    }

    // Event listeners for menu
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        const menuLinks = document.querySelectorAll('.menu-items a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu();
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }
});

// Memory Game Logic
let hasFlippedCard = false;
let lockBoard = true; // Start with locked board
let firstCard, secondCard;
let attempts = 0;
let matchedPairs = 0;

// Card images array (8 pairs)
const cardImages = [
    'images/Paturain logo memory card.png',
    'images/Frankrijk memory card.png',
    'images/Provence memory card.png',
    'images/Zout memory card.png',
    'images/room memory card.png',
    'images/Melk memory card.png',
    'images/Paturain naturel light memory card.png',
    'images/Paturain naturel memory card.png'
];

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const memoryGrid = document.querySelector('.memory-grid');
    if (!memoryGrid) return;

    // Initialize the game immediately
    initializeGame();

    // Show name input modal
    const nameModal = document.getElementById('nameModal');
    nameModal.style.display = 'flex';

    // Handle name input and game start
    const startButton = document.getElementById('startGame');
    const nameInput = document.getElementById('nameInput');

    startButton.addEventListener('click', () => {
        const playerName = nameInput.value.trim();
        if (playerName !== '') {
            // Hide modal and unlock the game
            nameModal.style.display = 'none';
            document.getElementById('playerName').textContent = playerName;
            lockBoard = false; // Unlock the board after name entry
        } else {
            alert('Vul alsjeblieft je naam in om te beginnen.');
        }
    });

    // Allow Enter key to submit name
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startButton.click();
        }
    });
});

function initializeGame() {
    const grid = document.querySelector('.memory-grid');
    if (!grid) return;

    // Reset game state
    hasFlippedCard = false;
    lockBoard = true; // Start with locked board until name is entered
    firstCard = null;
    secondCard = null;
    attempts = 0;
    matchedPairs = 0;
    document.getElementById('attempts').textContent = '0';

    // Clear existing cards
    grid.innerHTML = '';

    // Create pairs of cards
    const cards = [];
    [...cardImages, ...cardImages].forEach((img, index) => {
        const card = createCard(img, index);
        cards.push(card);
    });

    // Shuffle and append cards
    shuffleArray(cards);
    cards.forEach(card => grid.appendChild(card));
}

function createCard(img, index) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.cardIndex = index;

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back" style="background-image: url('${img}')"></div>
        </div>
    `;

    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        // First card flipped
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second card flipped
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    attempts++;
    document.getElementById('attempts').textContent = attempts;

    const isMatch = firstCard.querySelector('.card-back').style.backgroundImage ===
        secondCard.querySelector('.card-back').style.backgroundImage;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedPairs++;

    if (matchedPairs === cardImages.length) {
        setTimeout(() => {
            showWinModal();
        }, 500);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showWinModal() {
    const modal = document.getElementById('winModal');
    document.getElementById('finalAttempts').textContent = attempts;
    modal.style.display = 'flex';

    const goToFormButton = document.getElementById('goToForm');
    goToFormButton.addEventListener('click', () => {
        // Store the data before redirecting
        localStorage.setItem('winnerCode', document.getElementById('playerName').textContent);
        localStorage.setItem('winnerAttempts', attempts);
        window.location.href = 'winner-form.html';
    });
}

// Winner form functionality
document.addEventListener('DOMContentLoaded', () => {
    const winnerForm = document.getElementById('winnerForm');
    if (winnerForm) {
        // Auto-fill the code and attempts
        const codeInput = document.getElementById('code');
        const attemptsInput = document.getElementById('attempts');

        codeInput.value = localStorage.getItem('winnerCode') || '';
        attemptsInput.value = localStorage.getItem('winnerAttempts') || '';

        winnerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show thank you modal
            const thankYouModal = document.getElementById('thankYouModal');
            thankYouModal.style.display = 'flex';
            setTimeout(() => {
                thankYouModal.classList.add('active');
            }, 10);

            // Handle close button
            const closeButton = document.getElementById('closeThankYou');
            closeButton.addEventListener('click', () => {
                thankYouModal.classList.remove('active');
                setTimeout(() => {
                    // Clear the stored data
                    localStorage.removeItem('winnerCode');
                    localStorage.removeItem('winnerAttempts');

                    // Redirect back to the homepage
                    window.location.href = 'index.html';
                }, 300);
            });
        });
    }
}); 