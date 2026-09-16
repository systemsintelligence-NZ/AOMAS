const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const videoOpenButton = document.querySelector("[data-video-open]");
const videoModal = document.querySelector("[data-video-modal]");
const videoPlayer = document.querySelector("[data-video-player]");
const videoStatus = document.querySelector("[data-video-status]");
const videoCloseButtons = Array.from(document.querySelectorAll("[data-video-close]"));

const galleryData = {
  deck: [
    {
      src: "Media/boat_deck_1.jpg",
      alt: "Finished AOMAS deck with grey flooring and storage",
      kicker: "Deck fitout",
      title: "Storage, seating and flooring that work hard"
    },
    {
      src: "Media/boat_deck_4.jpg",
      alt: "Finished AOMAS deck with warm teak flooring",
      kicker: "Deck finish",
      title: "Warm flooring with clean fishing space"
    },
    {
      src: "Media/big_boat_deck.jpg",
      alt: "Wide AOMAS deck showing seating and fishing space",
      kicker: "Open deck",
      title: "Room for gear, people and the good chilly bin"
    },
    {
      src: "Media/boat_deck_2.jpg",
      alt: "AOMAS deck storage and fitted flooring detail",
      kicker: "Deck storage",
      title: "Everything gets a sensible home"
    }
  ],
  cabin: [
    {
      src: "Media/boat_cabin_1.jpg",
      alt: "AOMAS cabin view through to the rear deck",
      kicker: "Cabin view",
      title: "Shelter, seating and light from every angle"
    },
    {
      src: "Media/boat_cabin_2.jpg",
      alt: "AOMAS cabin seating with access to compact amenities",
      kicker: "Cabin comfort",
      title: "A proper place to sit when the weather gets cheeky"
    },
    {
      src: "Media/boat_cabin_3.jpg",
      alt: "AOMAS cabin lined interior with helm seating",
      kicker: "Interior finish",
      title: "Soft lining, tidy trim and practical access"
    },
    {
      src: "Media/boat_closed_cabin.jpg",
      alt: "AOMAS closed cabin boat profile",
      kicker: "Closed cabin",
      title: "More shelter for longer days on the water"
    }
  ],
  water: [
    {
      src: "Media/boat_in_water.jpg",
      alt: "AOMAS boat sitting in clear calm water near the beach",
      kicker: "On the water",
      title: "The reward after all the careful choices"
    },
    {
      src: "Media/boat_hull_complete.jpg",
      alt: "Completed AOMAS aluminium hull with cabin",
      kicker: "Finished hull",
      title: "Clean lines with serious utility underneath"
    }
  ],
  trailer: [
    {
      src: "Media/boat_on_trailer.jpg",
      alt: "AOMAS boat loaded on trailer",
      kicker: "Tow ready",
      title: "Ready for the ramp when the weather behaves"
    },
    {
      src: "Media/trailer_no_boat.jpg",
      alt: "Boat trailer ready for an AOMAS custom boat",
      kicker: "Trailer setup",
      title: "The trailer matters too"
    },
    {
      src: "Media/trailer_no_boat_2.jpg",
      alt: "AOMAS boat trailer from the rear",
      kicker: "Launch support",
      title: "Built to make launch day less dramatic"
    }
  ]
};

let currentGroup = "deck";
let currentIndex = 0;

const galleryImage = document.querySelector("[data-gallery-image]");
const galleryStage = document.querySelector(".gallery-stage");
const galleryKicker = document.querySelector("[data-gallery-kicker]");
const galleryTitle = document.querySelector("[data-gallery-title]");
const galleryCount = document.querySelector("[data-gallery-count]");
const galleryTabs = Array.from(document.querySelectorAll("[data-gallery-group]"));
const previousButton = document.querySelector("[data-gallery-prev]");
const nextButton = document.querySelector("[data-gallery-next]");
let videoTrigger = null;

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMenu() {
  if (!header || !menuToggle) return;
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function updateGallery(group = currentGroup, index = currentIndex) {
  const items = galleryData[group];
  const item = items[index];
  if (!item || !galleryImage) return;

  currentGroup = group;
  currentIndex = index;
  galleryStage.classList.add("is-changing");

  const preload = new Image();
  preload.src = item.src;
  preload.onload = () => {
    galleryImage.src = item.src;
    galleryImage.alt = item.alt;
    galleryKicker.textContent = item.kicker;
    galleryTitle.textContent = item.title;
    galleryCount.textContent = `${index + 1} of ${items.length}`;
    window.setTimeout(() => galleryStage.classList.remove("is-changing"), 90);
  };

  galleryTabs.forEach((tab) => {
    const isActive = tab.dataset.galleryGroup === group;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
}

function stepGallery(direction) {
  const items = galleryData[currentGroup];
  const nextIndex = (currentIndex + direction + items.length) % items.length;
  updateGallery(currentGroup, nextIndex);
}

function openVideoTour(event) {
  if (!videoModal || !videoPlayer) return;

  event?.preventDefault();
  videoTrigger = document.activeElement;
  videoModal.hidden = false;
  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("video-open");
  videoPlayer.currentTime = 0;
  if (videoStatus) videoStatus.textContent = "";
  const playRequest = videoPlayer.play();
  if (playRequest) {
    playRequest.catch(() => {
      if (videoStatus) videoStatus.textContent = "Press play to start the video.";
    });
  }
  videoModal.querySelector("[data-video-close]")?.focus();
}

function closeVideoTour() {
  if (!videoModal || !videoPlayer) return;

  videoPlayer.pause();
  if (videoStatus) videoStatus.textContent = "";
  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden", "true");
  videoModal.hidden = true;
  document.body.classList.remove("video-open");

  if (videoTrigger instanceof HTMLElement) {
    videoTrigger.focus();
  }
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  header?.classList.toggle("menu-active", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

galleryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    updateGallery(tab.dataset.galleryGroup, 0);
  });
});

previousButton?.addEventListener("click", () => stepGallery(-1));
nextButton?.addEventListener("click", () => stepGallery(1));
videoOpenButton?.addEventListener("click", openVideoTour);
videoCloseButtons.forEach((button) => button.addEventListener("click", closeVideoTour));

galleryStage?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") stepGallery(-1);
  if (event.key === "ArrowRight") stepGallery(1);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && videoModal?.classList.contains("is-open")) {
    closeVideoTour();
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
