document.addEventListener('DOMContentLoaded', function() {
    fetch('Data/projects.json')  // Ensure the path to your JSON file is correct
        .then(response => response.json())
        .then(data => {
            data.forEach(item => createCarouselSlide(item));
            initializeCarousels();  // This initializes carousels after slides are created
        })
        .catch(error => console.error('Error loading the projects:', error));
});

function createCarouselSlide(item) {

    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageContainer.dataset.title = item.title;  // Store the title
    imageContainer.dataset.description = item.description;  // Store the description
    imageContainer.dataset.overlayImageSrc = item.overlayImageSrc;
    imageContainer.dataset.imageSrc = item.imageSrc;
    imageContainer.dataset.projectLink = item.projectLink;
    imageContainer.dataset.genre = item.genre;
    imageContainer.dataset.role = item.role;
    imageContainer.dataset.engine = item.engine;
    imageContainer.dataset.background = item.background;
    imageContainer.dataset.screenshots = JSON.stringify(item.screenshots || []);
    imageContainer.dataset.logo = item.logo;
    imageContainer.dataset.video = item.video;
    imageContainer.dataset.year = item.year;
    imageContainer.dataset.youtube = item.youtube;
 
    const carouselId = item.carousel.toLowerCase() + '-carousel';  // Adjust this ID as needed
    const carousel = document.getElementById(carouselId);
    const carouselSlide = carousel.querySelector('.carousel-slide');

    // Add main image
    const img = document.createElement('img');
    img.className = 'carousel-image';
    img.src = item.imageSrc;
    imageContainer.appendChild(img);

    // Per-slide preview removed; previews now play in the hero area

    // Add overlay text
    const overlayText = document.createElement('div');
    overlayText.className = 'overlay-text';
    overlayText.textContent = item.role;
    imageContainer.appendChild(overlayText);

    // Add overlay image
    const overlayImg = document.createElement('img');
    overlayImg.className = 'overlay-image';
    overlayImg.style.transform = 'scale(0.5)';
    overlayImg.src = 'Images/PlayButton.png';
    imageContainer.appendChild(overlayImg);

    console.log("Creating slide for:", item.title);
    console.log("Overlay text content:", overlayText.textContent);
    
    // Optionally add a link
    if (item.link) {
        const link = document.createElement('a');
        link.href = item.link;
        link.appendChild(imageContainer);  // Wrap image container in a link
        carouselSlide.appendChild(link);
    } else {
        carouselSlide.appendChild(imageContainer);
    }
}

function getProjectLinkLabel(link) {
    if (!link) return 'View Project';

    const normalizedLink = String(link).toLowerCase();

    if (normalizedLink.includes('youtube.com') || normalizedLink.includes('youtu.be')) {
        return 'View on YouTube';
    }
    if (normalizedLink.includes('steampowered.com') || normalizedLink.includes('steamcommunity.com')) {
        return 'View on Steam';
    }
    if (normalizedLink.includes('github.com')) {
        return 'View on GitHub';
    }
    if (normalizedLink.includes('itch.io')) {
        return 'View on itch.io';
    }

    return 'View Project';
}

function hasProjectLink(link) {
    if (link === null || link === undefined) return false;
    const normalizedLink = String(link).trim();
    return normalizedLink !== '' && normalizedLink.toLowerCase() !== 'undefined';
}

function initializeCarousels() {
    document.querySelectorAll('.carousel-container').forEach(carousel => {

        const carouselId = carousel.id;

        // the first carousel is the selected carousel
        if (carouselsCreated == 0)
            selectedCarouselId = carouselId;

        // initialize all the slides and select the first slide
        initializeCarousel(carouselId);
        setupClickListeners(carouselId);
        updateActiveSlideDisplay(carouselId);
    });
}

// Function to change the slide
let currentSlideIndex = 0;
let slidesData = []; 

function changeSlide(direction) {
    currentSlideIndex += direction;
    if (currentSlideIndex >= slidesData.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slidesData.length - 1;
    }
    updateSubActiveSlideDisplay();
}

// Function to update the display based on the current slide
function updateSubActiveSlideDisplay() {
    const slide = slidesData[currentSlideIndex];
    if (!slide) return;

    document.getElementById('mainImage').src = slide.imageSrc;
    document.getElementById('slideTitle').textContent = slide.title;
    document.getElementById('slideDescription').textContent = slide.description;
}

function updateActiveSlideDisplay(carouselId) {
    
    // update the upper container
    const upperContainer = document.querySelector('.game-container');
    upperContainer.style.transition = 'opacity 0s ease-in-out';
    upperContainer.style.opacity = '0';
    setTimeout(() => {
        upperContainer.style.transition = 'opacity 0.5s ease-in-out';
        upperContainer.style.opacity = '1';
    }, 200);
    
    const carousel = document.getElementById(carouselId);
    const activeSlide = carousel.querySelector('.image-container.active');  // Assumes you have 'active' class set on the active slide
    if (!activeSlide) return;  // If there's no active slide, do nothing

    const title = activeSlide.dataset.title;  // Assuming you store the title in data attributes
    const description = activeSlide.dataset.description;  // Assuming description is also stored

    const titleElement = document.querySelector('.game-text-container h1');
    const descriptionElement = document.querySelector('.game-text-container .game-description');
    
    titleElement.textContent = title;

    if (activeSlide) {

        const title = activeSlide.dataset.title;
        const description = activeSlide.dataset.description;
        const year = activeSlide.dataset.year;
        const engine = activeSlide.dataset.engine;

        const titleElement = document.querySelector('.game-text-container h1');
        const descriptionElement = document.querySelector('.game-text-container .game-description');
        const imageOverlayElement = document.querySelector('.game-text-container .slide-icon');
        const primaryHeroImage = document.querySelector('.hero-image-primary');
        const secondaryHeroImage = document.querySelector('.hero-image-secondary');
        const mainSlideElement = document.getElementById('mainImage');
        const linkElement = document.querySelector('.game-text-container .game-text-link');
        const roleElement = document.querySelector('.game-text-container .game-text-role');

        titleElement.textContent = title;
        descriptionElement.textContent = description;
        imageOverlayElement.src = activeSlide.dataset.overlayImageSrc;
        roleElement.textContent = activeSlide.dataset.role+" - "+activeSlide.dataset.genre;

        // append a year if it exists
        if (year != 'undefined')
        {
            roleElement.textContent += " ("+year+")";
        }

        if (engine && engine !== 'undefined' && String(engine).trim() !== '') {
            roleElement.textContent += ", " + engine;
        }
        
        // add a link to the official project page
        const projectLink = activeSlide.dataset.projectLink;
        if (hasProjectLink(projectLink)) {
            linkElement.href = projectLink;
            linkElement.textContent = getProjectLinkLabel(projectLink);
            linkElement.style.display = 'inline-block';
        } else {
            linkElement.removeAttribute('href');
            linkElement.textContent = '';
            linkElement.style.display = 'none';
        }

        // set the slide image based on whether we have a logo or background
        const screenshotList = JSON.parse(activeSlide.dataset.screenshots || '[]').filter(Boolean);
        const initialHeroImage = screenshotList[0] || activeSlide.dataset.background || activeSlide.dataset.imageSrc;

        if (initialHeroImage) {
            if (primaryHeroImage) primaryHeroImage.src = initialHeroImage;
            if (secondaryHeroImage) secondaryHeroImage.src = initialHeroImage;
        }

        if (mainSlideElement) {
            mainSlideElement.dataset.activeImage = 'primary';
            mainSlideElement.classList.remove('is-crossfading');
            mainSlideElement.classList.remove('is-previewing');
            mainSlideElement.classList.remove('yt-visible');
        }

        if (typeof activeHeroImageSlot !== 'undefined') {
            activeHeroImageSlot = 'primary';
        }

        // add a youtube link if it exists


    } else {
        console.error("No active slide found.");
    }

    descriptionElement.textContent = description;
}
