document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.memory-grid');
    const attemptsCounter = document.querySelector('.attempts-counter p');
    const modal = document.querySelector('.modal');
    const modalButton = document.querySelector('.modal-button');
    const nameInput = document.querySelector('#nameInput');
    let attempts = 0;
    let flippedCards = [];
    let matchedPairs = 0;
    let playerName = '';
    let isProcessing = false;

    // Card images array
    const cardImages = [
        'images/Paturain logo memory card.png',
        'images/Frankrijk memory card.png',
        'images/Provence memory card.png',
        'images/Zout memory card.png',
        'images/room memory card.png',
        'images/Melk memory card.png'
    ];

    // Duplicate cards for pairs and shuffle
    let cards = [...cardImages, ...cardImages]
        .sort(() => Math.random() - 0.5);

    // Create cards and add to grid
    cards.forEach((img, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.setAttribute('data-card-index', index);

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.style.backgroundImage = `url(${img})`;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        card.addEventListener('click', () => flipCard(card));
        grid.appendChild(card);
    });

    // Update attempts counter
    function updateAttempts() {
        attempts++;
        attemptsCounter.textContent = `Aantal pogingen: ${attempts}`;
    }

    // Flip card function
    function flipCard(card) {
        if (isProcessing || flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            isProcessing = true;
            updateAttempts();
            checkMatch();
        }
    }

    // Check for match
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const img1 = card1.querySelector('.card-back').style.backgroundImage;
        const img2 = card2.querySelector('.card-back').style.backgroundImage;

        if (img1 === img2) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;

            if (matchedPairs === cardImages.length) {
                setTimeout(showWinModal, 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }

        setTimeout(() => {
            flippedCards = [];
            isProcessing = false;
        }, 1000);
    }

    // Show win modal
    function showWinModal() {
        modal.style.display = 'flex';
    }

    // Modal button click handler
    modalButton.addEventListener('click', () => {
        playerName = nameInput.value.trim();
        if (playerName) {
            window.location.href = `winner.html?name=${encodeURIComponent(playerName)}&attempts=${attempts}`;
        }
    });
});

// For winner.html page
if (document.querySelector('.winner-page')) {
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get('name');
    const attempts = urlParams.get('attempts');

    if (playerName && attempts) {
        document.getElementById('playerName').value = playerName;
        document.getElementById('attempts').value = attempts;
    }
} 