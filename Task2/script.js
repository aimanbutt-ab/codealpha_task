
const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const imageCaption = document.getElementById("imageCaption");
const imageCounter = document.getElementById("imageCounter");

const closeBtn = document.getElementById("closeBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let visibleImages = [];
let currentIndex = 0;

// Update images according to selected category
function updateGallery() {
    visibleImages = [];

    galleryItems.forEach(item => {
        if (!item.classList.contains("hide")) {
            visibleImages.push(item);
        }
    });
}

// Category filtering
filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedCategory = button.dataset.filter;

        galleryItems.forEach(item => {
            const category = item.dataset.category;

            if (selectedCategory === "all" ||
                category === selectedCategory) {
                item.classList.remove("hide");
            } else {
                item.classList.add("hide");
            }
        });

        updateGallery();
    });
});

// Open lightbox
function openLightbox(index) {
    updateGallery();

    currentIndex = index;
    showImage();

    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
}

// Display selected image
function showImage() {
    const selectedItem = visibleImages[currentIndex];

    const image = selectedItem.querySelector("img");
    const title = selectedItem.querySelector("h3");

    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    imageCaption.textContent = title.textContent;

    imageCounter.textContent =
        `${currentIndex + 1} / ${visibleImages.length}`;
}

// Gallery image click
galleryItems.forEach(item => {
    item.addEventListener("click", () => {

        updateGallery();

        const index = visibleImages.indexOf(item);
        openLightbox(index);
    });
});

// Next image
nextBtn.addEventListener("click", () => {
    currentIndex++;

    if (currentIndex >= visibleImages.length) {
        currentIndex = 0;
    }

    showImage();
});

// Previous image
prevBtn.addEventListener("click", () => {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = visibleImages.length - 1;
    }

    showImage();
});

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
}

closeBtn.addEventListener("click", closeLightbox);

// Close by clicking outside the image
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener("keydown", (event) => {

    if (!lightbox.classList.contains("show")) return;

    if (event.key === "ArrowRight") {
        nextBtn.click();
    }

    if (event.key === "ArrowLeft") {
        prevBtn.click();
    }

    if (event.key === "Escape") {
        closeLightbox();
    }
});

// Initial gallery setup
updateGallery();
