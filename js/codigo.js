const tracks = [
    {
        title: "WEXECUTION",
        artist: "Santy!",
        img: "../img/Wega.png",
        audio: "../sounds/WEXECUTION.mp3"
    },
    {
        title: "WEGAFADENCE",
        artist: "GAMR",
        img: "../img/UltraIriosOldest.png",
        audio: "../sounds/WEGAFADENCE.mp3"
    },
    {
        title: "ENDURANCE",
        artist: "GAMR",
        img: "../img/Rorys_HD.png",
        audio: "../sounds/ENDURANCE.mp3"
    },
    {
        title: "Glervon Go!",
        artist: "Santy!",
        img: "../img/Glervon.png",
        audio: "../sounds/Glervon Go!.mp3"
    },
    {
        title: "BEAR5 ALERT",
        artist: "GAMR",
        img: "../img/Sapphire_bear_new-removebg-preview.png",
        audio: "../sounds/BEAR5 ALERT.mp3"
    },
    {
        title: "ENPHOSED",
        artist: "raleigh",
        img: "../img/Enphoso.png",
        audio: "../sounds/ENPHOSED.mp3"
    },
    {
        title: "Skibludi's Challenge",
        artist: "raleigh",
        img: "../img/Blud-removebg-preview.png",
        audio: "../sounds/Skibludis Challenge.mp3"
    }
];

const playlistContainer = document.getElementById('playlist');
const audioPlayer = document.getElementById('audio-player');
const npImg = document.getElementById('np-img');
const npTitle = document.getElementById('np-title');
const npArtist = document.getElementById('np-artist');

const btnRepeat = document.getElementById('btn-repeat');
const btnPrev = document.getElementById('btn-prev');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnNext = document.getElementById('btn-next');
const btnShuffle = document.getElementById('btn-shuffle');

const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const carouselTrack = document.getElementById('carousel-track');
const carouselPrevBtn = document.getElementById('carousel-prev');
const carouselNextBtn = document.getElementById('carousel-next');

let currentIndex = 0;
let carouselIndex = 0;
let isRepeating = false;
let isShuffle = false;

function renderCarousel() {
    carouselTrack.innerHTML = '';
    tracks.forEach((track, index) => {
        const card = document.createElement('div');
        card.classList.add('carousel-card');
        card.innerHTML = `
            <img class="carousel-card-img" src="${track.img}" alt="${track.title}">
            <div class="carousel-card-title">${track.title}</div>
            <div class="carousel-card-artist">${track.artist}</div>
        `;
        card.addEventListener('click', () => {
            loadAndPlayTrack(index);
        });
        carouselTrack.appendChild(card);
    });
}

const CARD_WIDTH = 165;

function updateCarouselPosition() {
    carouselTrack.style.transform = `translateX(-${carouselIndex * CARD_WIDTH}px)`;
}

carouselNextBtn.addEventListener('click', () => {
    const viewportWidth = document.querySelector('.carousel-viewport').offsetWidth;
    const visibleCards = Math.floor(viewportWidth / CARD_WIDTH);
    const maxIndex = tracks.length - visibleCards;

    if (carouselIndex < maxIndex && maxIndex > 0) {
        carouselIndex++;
    } else {
        carouselIndex = 0;
    }
    updateCarouselPosition();
});

carouselPrevBtn.addEventListener('click', () => {
    if (carouselIndex > 0) {
        carouselIndex--;
    } else {
        carouselIndex = tracks.length - 1;
    }
    updateCarouselPosition();
});

function renderPlaylist() {
    playlistContainer.innerHTML = '';
    
    tracks.forEach((track, index) => {
        const card = document.createElement('div');
        card.classList.add('track-card');
        if (index === currentIndex) card.classList.add('active-track');

        card.innerHTML = `
            <div class="track-thumb">
                <img src="${track.img}" alt="${track.title}">
            </div>
            <div class="track-details">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
        `;

        card.addEventListener('click', () => {
            loadAndPlayTrack(index);
        });

        playlistContainer.appendChild(card);
    });
}

function loadAndPlayTrack(index) {
    currentIndex = index;
    const track = tracks[currentIndex];

    npImg.src = track.img;
    npTitle.textContent = track.title;
    npArtist.textContent = track.artist;

    audioPlayer.src = track.audio;

    const cards = document.querySelectorAll('.track-card');
    cards.forEach((c, i) => {
        c.classList.toggle('active-track', i === currentIndex);
    });

    audioPlayer.play().then(() => {
        btnPlayPause.textContent = '⏸️ Pausa';
    }).catch(error => {
        console.warn('Ficheiro de áudio não encontrado ou reprodução automática bloqueada pelo navegador:', error);
    });
}

btnPlayPause.addEventListener('click', () => {
    if (!audioPlayer.src || audioPlayer.src.endsWith('/exemplo/site.html')) {
        loadAndPlayTrack(0);
        return;
    }

    if (audioPlayer.paused) {
        audioPlayer.play();
        btnPlayPause.textContent = '⏸️ Pausa';
    } else {
        audioPlayer.pause();
        btnPlayPause.textContent = '▶️ Play';
    }
});

btnRepeat.addEventListener('click', () => {
    isRepeating = !isRepeating;
    btnRepeat.classList.toggle('active', isRepeating);
});

btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle('active', isShuffle);
});

btnNext.addEventListener('click', () => {
    if (isRepeating) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        return;
    }

    if (isShuffle) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * tracks.length);
        } while (randomIndex === currentIndex && tracks.length > 1);
        loadAndPlayTrack(randomIndex);
    } else {
        const nextIndex = (currentIndex + 1) % tracks.length;
        loadAndPlayTrack(nextIndex);
    }
});

btnPrev.addEventListener('click', () => {
    if (isRepeating) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        return;
    }

    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadAndPlayTrack(prevIndex);
});

audioPlayer.addEventListener('ended', () => {
    if (isRepeating) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        btnNext.click();
    }
});

audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        durationEl.textContent = formatTime(audioPlayer.duration);
    }
});

progressBar.addEventListener('input', () => {
    if (audioPlayer.duration) {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
    }
});

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

renderCarousel();
renderPlaylist();