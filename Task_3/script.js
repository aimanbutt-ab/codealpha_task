
const audio = document.getElementById("audio");

const cover = document.getElementById("cover");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");
const playlistContainer = document.getElementById("playlistContainer");
const songCount = document.getElementById("songCount");
const featuredPlay = document.getElementById("featuredPlay");

// Song collection
const songs = [
    {
        title: "Midnight Dreams",
        artist: "SoundHelix",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Summer Vibes",
        artist: "SoundHelix",
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Lost in Music",
        artist: "SoundHelix",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
];

let currentSong = 0;
let isPlaying = false;

// Format seconds into minutes and seconds
function formatTime(time) {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Load selected song
function loadSong(index) {
    currentSong = index;

    const song = songs[currentSong];

    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    cover.src = song.image;

    audio.src = song.audio;
    audio.load();

    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    progressFill.style.width = "0%";

    updatePlaylist();
}

// Play music
function playSong() {
    audio.play()
        .then(() => {
            isPlaying = true;
            playBtn.textContent = "Ⅱ";
            playBtn.setAttribute("aria-label", "Pause");
            updatePlaylist();
        })
        .catch(error => {
            console.log("Unable to play audio:", error);
        });
}

// Pause music
function pauseSong() {
    audio.pause();
    isPlaying = false;

    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play");

    updatePlaylist();
}

// Play / Pause button
playBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// Next song
function nextSong() {
    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong(currentSong);
    playSong();
}

// Previous song
function previousSong() {
    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);
    playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", previousSong);

// Update music progress
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {

        const progress =
            (audio.currentTime / audio.duration) * 100;

        progressFill.style.width = `${progress}%`;

        currentTime.textContent =
            formatTime(audio.currentTime);

        duration.textContent =
            formatTime(audio.duration);
    }
});

// Seek music by clicking progress bar
progressBar.addEventListener("click", event => {
    if (!audio.duration) return;

    const width = progressBar.clientWidth;
    const clickPosition =
        event.offsetX / width;

    audio.currentTime =
        clickPosition * audio.duration;
});

// Volume control
volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

// Automatically play next song when current ends
audio.addEventListener("ended", nextSong);

// Generate playlist
function createPlaylist() {

    playlistContainer.innerHTML = "";

    songCount.textContent = `${songs.length} Songs`;

    songs.forEach((song, index) => {

        const songItem = document.createElement("div");

        songItem.className = "song-item";

        songItem.innerHTML = `
            <span class="song-number">${String(index + 1).padStart(2, "0")}</span>

            <img class="song-thumb" src="${song.image}" alt="${song.title}">

            <div class="song-text">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>

            <span class="song-duration" id="songDuration${index}">--:--</span>

            <span class="playlist-play">
                ${index === currentSong && isPlaying ? "Ⅱ" : "▶"}
            </span>
        `;

        songItem.addEventListener("click", () => {
            loadSong(index);
            playSong();
        });

        playlistContainer.appendChild(songItem);

        // Read actual song duration
        const tempAudio = new Audio(song.audio);

        tempAudio.addEventListener("loadedmetadata", () => {
            const durationElement =
                document.getElementById(`songDuration${index}`);

            if (durationElement) {
                durationElement.textContent =
                    formatTime(tempAudio.duration);
            }
        });
    });

    updatePlaylist();
}

// Highlight currently playing song
function updatePlaylist() {

    const items =
        document.querySelectorAll(".song-item");

    items.forEach((item, index) => {

        item.classList.toggle(
            "active",
            index === currentSong
        );

        const icon = item.querySelector(".playlist-play");

        icon.textContent =
            index === currentSong && isPlaying ? "Ⅱ" : "▶";
    });
}

// Featured section play button
featuredPlay.addEventListener("click", () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// Initialize player
audio.volume = 0.7;

createPlaylist();
loadSong(0);
