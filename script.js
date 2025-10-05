// ===== FORM SUBMISSION FUNCTIONS =====

function submitTrifectaPopupForm(formSelector, buttonSelector, noteSelector) {
  $(formSelector).submit(function (event) {
    event.preventDefault();

    // Disable button and show loading state
    $(buttonSelector).text("Please Wait...");
    $(buttonSelector).attr("disabled", true);

    // Gather form data
    var formData = {
      name: $(formSelector + ' [name="name"]').val(),
      email: $(formSelector + ' [name="email"]').val(),
      phoneCode: $(formSelector + ' [name="phoneCode"]').val(),
      phoneNumber: $(formSelector + ' [name="phoneNumber"]').val(),
      propertyType: $(formSelector + ' [name="propertyType"]').val(),
      agreeToUpdates: $(formSelector + ' [name="agreeToUpdates"]').is(
        ":checked"
      )
        ? "yes"
        : "no",
      formType: "brochure_download",
    };

    $.ajax({
      type: "POST",
      url: "submit_lead.php",
      data: JSON.stringify(formData),
      contentType: "application/json",
      dataType: "json",
      success: function (response) {
        $(buttonSelector).removeAttr("disabled").text("Download Now");
        var result;

        if (response.message) {
          result =
            '<p style="color:green; font-weight: 600; font-size: 16px; width:100%">Request Sent Successfully! Check your email.</p>';
          $(noteSelector).delay(5000).fadeOut();
          $(formSelector)[0].reset();

          // Optional: Close popup after successful submission
          setTimeout(function () {
            closeBrochurePopup();
          }, 2000);
        } else {
          result =
            '<p style="color:red; font-weight: 600; font-size: 16px; width:100%">' +
            (response.error || "Unknown error occurred") +
            "</p>";
        }

        $(noteSelector).html(result).show();
      },
      error: function (xhr) {
        $(buttonSelector).removeAttr("disabled").text("Download Now");
        var errorMsg = "Error sending request!";

        try {
          var response = JSON.parse(xhr.responseText);
          if (response.error) {
            errorMsg = response.error;
          }
        } catch (e) {
          // Use default error message
        }

        $(noteSelector)
          .html(
            '<p style="color:red; font-weight: 600; font-size: 16px; width:100%">' +
              errorMsg +
              "</p>"
          )
          .show();
      },
    });

    return false;
  });
}

function submitRowhomesForm(formSelector, buttonSelector, noteSelector) {
  $(formSelector).submit(function (event) {
    event.preventDefault();

    // Disable button and show loading state
    var originalText = $(buttonSelector).text();
    $(buttonSelector).text("Please Wait...");
    $(buttonSelector).attr("disabled", true);

    // Gather form data
    var formData = {
      name: $(formSelector + ' [name="name"]').val(),
      email: $(formSelector + ' [name="email"]').val(),
      phoneCode: $(formSelector + ' [name="phoneCode"]').val(),
      phoneNumber: $(formSelector + ' [name="phoneNumber"]').val(),
      date: $(formSelector + ' [name="date"]').val(),
      time: $(formSelector + ' [name="time"]').val(),
      propertyType: "rowhomes",
      formType: "site_visit_booking",
    };

    $.ajax({
      type: "POST",
      url: "submit_lead.php",
      data: JSON.stringify(formData),
      contentType: "application/json",
      dataType: "json",
      success: function (response) {
        $(buttonSelector).removeAttr("disabled").text(originalText);
        var result;

        if (response.message) {
          result =
            '<p style="color:green; font-weight: 600; font-size: 16px; width:100%">Booking request sent successfully!</p>';
          $(noteSelector).delay(5000).fadeOut();
          $(formSelector)[0].reset();
        } else {
          result =
            '<p style="color:red; font-weight: 600; font-size: 16px; width:100%">' +
            (response.error || "Unknown error occurred") +
            "</p>";
        }

        $(noteSelector).html(result).show();
      },
      error: function (xhr) {
        $(buttonSelector).removeAttr("disabled").text(originalText);
        var errorMsg = "Error sending booking request!";

        try {
          var response = JSON.parse(xhr.responseText);
          if (response.error) {
            errorMsg = response.error;
          }
        } catch (e) {
          // Use default error message
        }

        $(noteSelector)
          .html(
            '<p style="color:red; font-weight: 600; font-size: 16px; width:100%">' +
              errorMsg +
              "</p>"
          )
          .show();
      },
    });

    return false;
  });
}

function submitVillasForm(formSelector, buttonSelector, noteSelector) {
  document
    .querySelector(formSelector)
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Disable button and show loading state
      const button = document.querySelector(buttonSelector);
      const originalText = button.textContent;
      button.textContent = "Please Wait...";
      button.disabled = true;

      // Gather form data
      const formData = {
        name: document.querySelector(formSelector + ' [name="name"]').value,
        email: document.querySelector(formSelector + ' [name="email"]').value,
        phoneCode: document.querySelector(formSelector + ' [name="phoneCode"]')
          .value,
        phoneNumber: document.querySelector(
          formSelector + ' [name="phoneNumber"]'
        ).value,
        date: document.querySelector(formSelector + ' [name="date"]').value,
        time: document.querySelector(formSelector + ' [name="time"]').value,
        propertyType: "villas",
        formType: "site_visit_booking",
      };

      // Send AJAX request
      fetch("submit_lead.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          button.disabled = false;
          button.textContent = originalText;

          const noteElement = document.querySelector(noteSelector);
          let result;

          if (data.message) {
            result =
              '<p style="color:green; font-weight: 600; font-size: 16px; width:100%">Booking request sent successfully!</p>';
            setTimeout(() => {
              noteElement.style.display = "none";
            }, 5000);
            document.querySelector(formSelector).reset();
          } else {
            result =
              '<p style="color:red; font-weight: 600; font-size: 16px; width:100%">' +
              (data.error || "Unknown error occurred") +
              "</p>";
          }

          noteElement.innerHTML = result;
          noteElement.style.display = "block";
        })
        .catch((error) => {
          button.disabled = false;
          button.textContent = originalText;

          const noteElement = document.querySelector(noteSelector);
          noteElement.innerHTML =
            '<p style="color:red; font-weight: 600; font-size: 16px; width:100%">Error sending booking request!</p>';
          noteElement.style.display = "block";
        });
    });
}

// Initialize the form

// Initialize all forms when document is ready
$(document).ready(function () {
  // Brochure popup form
  submitTrifectaPopupForm(
    "#brochureDownloadForm",
    "#brochureDownloadForm button[type='submit']",
    "#brochureDownloadForm .form-note"
  );

  // Rowhomes booking form (villaments)
  submitRowhomesForm(
    "#villamentsForm",
    "#villamentsForm button[type='submit']",
    "#villamentsForm .booking-form-note"
  );

  // Villas booking form initialization
  submitVillasForm(
    "#villasForm",
    "#villasForm button[type='submit']",
    "#villasForm .booking-form-note"
  );

  // submitVillasForm('#villasForm', '.booking-submit-btn', '.booking-form-note');
});

// navbar section

// Scroll Effect
let lastScroll = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  let currentScroll = window.pageYOffset;

  if (currentScroll < lastScroll && currentScroll > 100) {
    navbar.classList.add("expanded");
  } else {
    navbar.classList.remove("expanded");
  }

  lastScroll = currentScroll;
});

// Mobile Menu Toggle
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  menu.classList.toggle("active");
});

// Close menu when clicking on a link
const menuLinks = menu.querySelectorAll("a");
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    menu.classList.remove("active");
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove("active");
    menu.classList.remove("active");
  }
});

// hero section
class PropertySlider {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 2;
    this.autoSlideInterval = null;
    this.autoSlideDelay = 8000; // 8 seconds

    this.init();
  }

  init() {
    this.bindEvents();
    this.startAutoSlide();
    this.setupFormHandlers();
  }

  bindEvents() {
    // Arrow navigation
    document.getElementById("nextSlide").addEventListener("click", () => {
      this.nextSlide();
    });

    document.getElementById("prevSlide").addEventListener("click", () => {
      this.prevSlide();
    });

    // Indicator navigation
    const indicators = document.querySelectorAll(".indicator");
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        this.goToSlide(index + 1);
      });
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.prevSlide();
      } else if (e.key === "ArrowRight") {
        this.nextSlide();
      }
    });

    // Pause auto-slide on hover
    const sliderContainer = document.querySelector(".slider-container");
    sliderContainer.addEventListener("mouseenter", () => {
      this.stopAutoSlide();
    });

    sliderContainer.addEventListener("mouseleave", () => {
      this.startAutoSlide();
    });

    // Touch/swipe support for mobile
    this.setupTouchEvents();
  }

  setupTouchEvents() {
    let startX = 0;
    let endX = 0;
    const slider = document.querySelector(".slider-container");

    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      this.handleSwipe();
    });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = startX - endX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swiped left - next slide
          this.nextSlide();
        } else {
          // Swiped right - previous slide
          this.prevSlide();
        }
      }
    };

    this.handleSwipe = handleSwipe;
  }

  nextSlide() {
    const nextSlideNum =
      this.currentSlide >= this.totalSlides ? 1 : this.currentSlide + 1;
    this.goToSlide(nextSlideNum);
  }

  prevSlide() {
    const prevSlideNum =
      this.currentSlide <= 1 ? this.totalSlides : this.currentSlide - 1;
    this.goToSlide(prevSlideNum);
  }

  goToSlide(slideNumber) {
    if (slideNumber === this.currentSlide) return;

    // Remove active class from current slide and indicator
    document
      .querySelector(`.slide[data-slide="${this.currentSlide}"]`)
      .classList.remove("active");
    document
      .querySelector(`.indicator[data-slide="${this.currentSlide}"]`)
      .classList.remove("active");

    // Add active class to new slide and indicator
    document
      .querySelector(`.slide[data-slide="${slideNumber}"]`)
      .classList.add("active");
    document
      .querySelector(`.indicator[data-slide="${slideNumber}"]`)
      .classList.add("active");

    this.currentSlide = slideNumber;
    this.restartAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoSlideDelay);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  restartAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  setupFormHandlers() {
    // Form 1 - Consultation Form Handler
    const form1 = document.getElementById("consultationForm1");
    form1.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleConsultationFormSubmit(form1, "consultation");
    });

    // Form 2 - Pricing Form Handler
    const form2 = document.getElementById("consultationForm2");
    form2.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handlePricingFormSubmit(form2, "pricing");
    });
  }

  handleConsultationFormSubmit(form, formType) {
    const formData = new FormData(form);
    const data = {
      name: form.querySelector('input[type="text"]').value,
      email: form.querySelector('input[type="email"]').value,
      phone: form.querySelector('input[type="tel"]').value,
      countryCode: form.querySelector(".country-code").value,
      whatsappConsent: form.querySelector('input[type="checkbox"]').checked,
      interest: form.querySelector("select").value,
      formType: formType,
      timestamp: new Date().toISOString(),
    };

    // Show success message
    this.showFormSuccess(form, "Thank you! We'll contact you within 24 hours.");

    // Here you can add your email functionality in the future
    console.log("Consultation Form Data:", data);

    // Reset form after 3 seconds
    setTimeout(() => {
      form.reset();
      form.querySelector('input[type="checkbox"]').checked = true;
    }, 3000);
  }

  handlePricingFormSubmit(form, formType) {
    const data = {
      name: form.querySelector('input[type="text"]').value,
      email: form.querySelector('input[type="email"]').value,
      phone: form.querySelector('input[type="tel"]').value,
      countryCode: form.querySelector(".country-code").value,
      smsConsent: form.querySelector('input[type="checkbox"]').checked,
      propertyType: form.querySelector("select").value,
      formType: formType,
      timestamp: new Date().toISOString(),
    };

    // Show success message
    this.showFormSuccess(form, "Pricing details sent to your email!");

    // Here you can add your email functionality in the future
    console.log("Pricing Form Data:", data);

    // Reset form after 3 seconds
    setTimeout(() => {
      form.reset();
      form.querySelector('input[type="checkbox"]').checked = true;
    }, 3000);
  }

  showFormSuccess(form, message) {
    const submitBtn = form.querySelector(".btn-form");
    const originalText = submitBtn.textContent;
    const originalColor = submitBtn.style.backgroundColor;

    submitBtn.textContent = message;
    submitBtn.style.backgroundColor = "#4ade80";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.backgroundColor = originalColor;
      submitBtn.disabled = false;
    }, 3000);
  }
}

// Initialize the slider when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PropertySlider();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// master plan script
function mpShowPlan(planType) {
  // Update button states
  const buttons = document.querySelectorAll(".mp-toggle-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("mp-active");
  });
  event.target.classList.add("mp-active");

  // Hide all plans
  const plans = document.querySelectorAll(".mp-plan-view");
  plans.forEach((plan) => {
    plan.classList.remove("mp-active");
  });

  // Show selected plan
  document.getElementById(`mp-${planType}`).classList.add("mp-active");
}

// Floor plan data
const floorPlansData = {
  north: {
    slides: [
      [
        {
          image: "./images/plan-17.webp",
          title: "East Facing - 3328 SQFT",
        },
        {
          image: "./images/plan-18.webp",
          title: "West Facing - 3367 SQFT",
        },
        {
          image: "./images/plan-19.webp",
          title: "West Facing - 2632 SQFT",
        },
      ],
      [
        {
          image: "./images/plan-20.webp",
          title: "West Facing - 2915 SQFT",
        },
        {
          image: "./images/plan-21.webp",
          title: "West Facing - 3125 SQFT",
        },
        // {
        //   image:
        //     "./images/plan-17.webp",
        //   title: "North Facing - 3700 SQFT",
        // },
      ],
    ],
    tableData: [
      {
        type: "4BHK",
        sba: "3328 Sqft",
        price: "Call for Price",
        // availability: "Limited",
      },
      {
        type: "4BHK",
        sba: "3367 Sqft",
        price: "Call for Price",
        // availability: "Limited",
      },
    ],
  },
  east: {
    slides: [
      [
        {
          image: "./images/plan-22.webp",
          title: "East Facing - 3419 SQFT",
        },
        {
          image: "./images/plan-23.webp",
          title: "East Facing - 4043 SQFT",
        },
        {
          image: "./images/plan-24.webp",
          title: "East Facing - 4523 SQFT",
        },
      ],
      [
        {
          image: "./images/plan-25.webp",
          title: "West Facing - 2632 SQFT",
        },
        {
          image: "./images/plan-26.webp",
          title: "East Facing - 3065 SQFT",
        },
        // {
        //   image:
        //     "./images/plan-17.webp",
        //   title: "East Facing - 3700 SQFT",
        // },
      ],
    ],
    tableData: [
      {
        type: "4BHK",
        sba: "2632 Sqft",
        price: "Call for price",
        // availability: "Limited",
      },
      {
        type: "4BHK",
        sba: "2914 Sqft",
        price: "Call for price",
        // availability: "Limited",
      },
      {
        type: "4BHK",
        sba: "3065 Sqft",
        price: "Call for price",
        // availability: "Limited",
      },
      {
        type: "4BHK",
        sba: "3712 Sqft",
        price: "Call for price",
        // availability: "Limited",
      },
      {
        type: "4BHK",
        sba: "3934 Sqft",
        price: "Call for price",
        // availability: "Limited",
      },
    ],
  },
};

let floorPlanCurrentFacing = "north";
let floorPlanCurrentSlide = 0;

function initializeFloorPlanSlider() {
  renderFloorPlanSlider();
  renderFloorPlanTable();
  updateFloorPlanIndicators();
}

function renderFloorPlanSlider() {
  const slider = document.getElementById("floorPlanSlider");
  const slides = floorPlansData[floorPlanCurrentFacing].slides;

  slider.innerHTML = slides
    .map(
      (slide) =>
        `<div class="floor-plan-slide">
                    ${slide
                      .map(
                        (plan) =>
                          `<div class="floor-plan-card">
                            <img src="${plan.image}" alt="${plan.title}" class="floor-plan-image">
                            <div class="floor-plan-info">
                                <h3 class="floor-plan-title">${plan.title}</h3>
                            </div>
                        </div>`
                      )
                      .join("")}
                </div>`
    )
    .join("");

  updateFloorPlanSliderPosition();
}

function renderFloorPlanTable() {
  const tableContent = document.getElementById("tableContent");
  const tableData = floorPlansData[floorPlanCurrentFacing].tableData;

  tableContent.innerHTML = tableData
    .map(
      (row) =>
        `<div class="table-row">
                    <div class="table-cell" data-label="Type">${row.type}</div>
                    <div class="table-cell" data-label="SBA">${row.sba}</div>
                    <a href="#" class="table-cell" data-label="Price" onclick="openBrochurePopup(); return false;">${row.price}</a>
                </div>`
    )
    .join("");
}

function updateFloorPlanIndicators() {
  const indicatorsContainer = document.getElementById("floorPlanIndicators");
  const totalSlides = floorPlansData[floorPlanCurrentFacing].slides.length;

  indicatorsContainer.innerHTML = Array.from(
    { length: totalSlides },
    (_, i) =>
      `<div class="floor-plan-indicator ${
        i === floorPlanCurrentSlide ? "active" : ""
      }" onclick="goToFloorPlanSlide(${i})"></div>`
  ).join("");
}

function updateFloorPlanSliderPosition() {
  const slider = document.getElementById("floorPlanSlider");
  slider.style.transform = `translateX(-${floorPlanCurrentSlide * 100}%)`;
}

function floorPlanPreviousSlide() {
  const totalSlides = floorPlansData[floorPlanCurrentFacing].slides.length;
  floorPlanCurrentSlide =
    floorPlanCurrentSlide === 0 ? totalSlides - 1 : floorPlanCurrentSlide - 1;
  updateFloorPlanSliderPosition();
  updateFloorPlanIndicators();
}

function floorPlanNextSlide() {
  const totalSlides = floorPlansData[floorPlanCurrentFacing].slides.length;
  floorPlanCurrentSlide =
    floorPlanCurrentSlide === totalSlides - 1 ? 0 : floorPlanCurrentSlide + 1;
  updateFloorPlanSliderPosition();
  updateFloorPlanIndicators();
}

function goToFloorPlanSlide(index) {
  floorPlanCurrentSlide = index;
  updateFloorPlanSliderPosition();
  updateFloorPlanIndicators();
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  initializeFloorPlanSlider();

  // Facing button listeners
  document.querySelectorAll(".facing-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      document
        .querySelectorAll(".facing-btn")
        .forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Update current facing
      floorPlanCurrentFacing = this.dataset.facing;
      floorPlanCurrentSlide = 0;

      // Re-render slider and table
      initializeFloorPlanSlider();
    });
  });
});

// Auto-slide functionality (optional) - Removed to avoid conflicts
// setInterval(() => {
//     floorPlanNextSlide();
// }, 5000);

// Touch/swipe support for mobile
let floorPlanStartX = 0;
let floorPlanCurrentX = 0;
let floorPlanIsDragging = false;

document
  .getElementById("floorPlanSlider")
  .addEventListener("touchstart", (e) => {
    floorPlanStartX = e.touches[0].clientX;
    floorPlanIsDragging = true;
  });

document
  .getElementById("floorPlanSlider")
  .addEventListener("touchmove", (e) => {
    if (!floorPlanIsDragging) return;
    floorPlanCurrentX = e.touches[0].clientX;
  });

document.getElementById("floorPlanSlider").addEventListener("touchend", () => {
  if (!floorPlanIsDragging) return;
  floorPlanIsDragging = false;

  const diff = floorPlanStartX - floorPlanCurrentX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      floorPlanNextSlide();
    } else {
      floorPlanPreviousSlide();
    }
  }
});

// galary section

// Interior showcase data
const galleryInteriorData = {
  north: [
    {
      image: "./LP Gallery Villa Images/TVER Villa Phase 1.jpg",
      title: "Modern Row Home Exterior",
      description:
        "Contemporary row home design with elegant architecture and premium finishes.",
    },
    {
      image: "./LP Gallery Villa Images/TVER Villa Phase 2.jpeg",
      title: "Living Space",
      description:
        "Spacious and modern living area with natural lighting and contemporary furnishing.",
    },
    {
      image: "./LP Gallery Villa Images/TVER Villa Phase 3.jpeg",
      title: "Master Bedroom",
      description:
        "Luxurious master suite with panoramic views and premium finishes.",
    },
    {
      image: "./LP Gallery Villa Images/TVER Villa Live Image 01.jpg",
      title: "East Facing Perspective",
      description:
        "Beautiful east-facing elevation showcasing modern architectural design.",
    },
    {
      image: "./LP Gallery Villa Images/TVER Villa Live Image 02.jpg",
      title: "Row Home Facade",
      description: "Elegant facade design perfect for modern family living.",
    },
    {
      image: "./LP Gallery Villa Images/TVER Villa Live Ph 2  Image 01.jpg",
      title: "Modern Kitchen",
      description:
        "State-of-the-art kitchen with high-end appliances and sleek design.",
    },
  ],
  east: [
    {
      image: "./LP Gallery Row House Images/Row House Phase 1.jpeg",
      title: "Luxury Villa Exterior",
      description:
        "Expansive villa with floor-to-ceiling windows and premium materials.",
    },
    {
      image: "./LP Gallery Row House Images/Row House Phase 2.jpeg",
      title: "Villa Living Area",
      description:
        "Professional-grade living space with island seating and top-tier finishes.",
    },
    {
      image: "./LP Gallery Row House Images/Row House Phase 3.jpeg",
      title: "Phase 2 Villa",
      description:
        "Serene villa retreat with walk-in spaces and private balcony access.",
    },
    {
      image: "./LP Gallery Row House Images/TVER Row Homes Live image 01.jpg",
      title: "Phase 1 Villa",
      description:
        "Stylish villa area perfect for relaxation and family gatherings.",
    },
    {
      image: "./LP Gallery Row House Images/TVER Row Homes Live image 02.jpg",
      title: "Phase 2 Villa Design",
      description:
        "Modern villa design with contemporary architecture and premium amenities.",
    },
    {
      image: "./LP Gallery Row House Images/TVER Row Homes Live image 03.jpg",
      title: "Phase 3 Villa",
      description:
        "Latest phase villa with cutting-edge design and luxury features.",
    },
  ],
  clubhouse: [
    {
      image: "./LP Gallery Clubhouse Images/01 Club-Verdant-Side.jpeg",
      title: "Club Verdant Aerial View",
      description:
        "Grand aerial view of Club Verdant with sophisticated design and welcoming ambiance for residents.",
    },
    {
      image: "./LP Gallery Clubhouse Images/2-PARK-VIEW-8-scaled.jpeg ",
      title: "Club Verdant Exterior",
      description:
        "Modern clubhouse exterior with contemporary architecture and premium finishes.",
    },
    {
      image: "./Clubhouse Images/03 Club-Verdant-Swimming-Pool.jpeg",
      title: "Swimming Pool",
      description:
        "Olympic-sized pool with temperature control and lounging areas.",
    },
    {
      image: "./LP Gallery Clubhouse Images/04 Entrance.jpeg",
      title: "Clubhouse Entrance",
      description:
        "Elegant entrance design with modern landscaping and welcoming atmosphere.",
    },
    {
      image: "./LP Gallery Clubhouse Images/05 Club-Verdant-Aerial.jpeg",
      title: "Children's Play Area",
      description:
        "Dedicated play area for children with modern equipment and safety features.",
    },
    {
      image: "./LP Gallery Clubhouse Images/06 PARK-VIEW-3-scaled.jpeg",
      title: "Meditation Area",
      description:
        "Peaceful meditation space for relaxation and mindfulness activities.",
    },
    {
      image: "./LP Gallery Clubhouse Images/07 PARK-VIEW-5-scaled.jpeg",
      title: "Tennis Court",
      description:
        "Professional tennis court with premium surface and lighting.",
    },
    {
      image: "./LP Gallery Clubhouse Images/08 PARK-VIEW-4-scaled.jpeg",
      title: "Villa Terrace",
      description:
        "Beautiful terrace area with panoramic views and outdoor seating.",
    },
    {
      image: "./LP Gallery Clubhouse Images/09 PARK-VIEW-10-scaled.jpeg",
      title: "Park View 1",
      description: "Stunning park view showcasing the lush green surroundings.",
    },
    {
      image: "./LP Gallery Clubhouse Images/10 PARK-VIEW-12-scaled.jpeg",
      title: "Park View 2",
      description:
        "Another beautiful park view with well-maintained landscaping.",
    },
    {
      image: "./LP Gallery Clubhouse Images/11 PARK-VIEW-13-scaled.jpeg",
      title: "Park View 3",
      description:
        "Scenic park view with modern amenities and recreational facilities.",
    },
    {
      image: "./LP Gallery Clubhouse Images/12 PARK-VIEW-14-scaled.jpeg",
      title: "Park View 4",
      description: "Expansive park view with walking trails and green spaces.",
    },
    {
      image: "./LP Gallery Clubhouse Images/13 PARK-VIEW-1-scaled.jpeg",
      title: "Park View 5",
      description:
        "Beautiful park landscape with modern recreational facilities.",
    },
    {
      image: "./LP Gallery Clubhouse Images/14 PARK-VIEW-6-scaled.jpeg",
      title: "Park View 6",
      description: "Scenic park area with premium landscaping and amenities.",
    },
    {
      image: "./LP Gallery Clubhouse Images/15 PARK-GYM-VIEW-18-scaled.jpeg",
      title: "Park View 7",
      description:
        "Modern park design with contemporary features and green spaces.",
    },
    {
      image: "./LP Gallery Clubhouse Images/16 PARK-VIEW-16-scaled.jpeg",
      title: "Park View 8",
      description:
        "Beautiful park view with recreational facilities and walking paths.",
    },
    {
      image: "./LP Gallery Clubhouse Images/17 PARK-VIEW-20-scaled.jpeg",
      title: "Park View 9",
      description:
        "Scenic park landscape with modern amenities and green spaces.",
    },
    {
      image: "./LP Gallery Clubhouse Images/18 Childrens-Play-Area.jpeg",
      title: "Park Gym View",
      description:
        "Outdoor gym area with modern equipment and park surroundings.",
    },
    {
      image: "./LP Gallery Clubhouse Images/19 Meditation-Area.jpeg",
      title: "Park View 10",
      description:
        "Beautiful park area with recreational facilities and landscaping.",
    },
    {
      image: "./LP Gallery Clubhouse Images/20 Tennis-Court.jpeg",
      title: "Park View 11",
      description:
        "Modern park design with contemporary features and green spaces.",
    },
    {
      image: "./LP Gallery Clubhouse Images/21 Villa-Terrace.jpeg",
      title: "Park View 11",
      description:
        "Modern park design with contemporary features and green spaces.",
    },
  ],
};

let galleryCurrentFace = "north";
let galleryCurrentSlideIndex = 0;
let galleryIsTransitioning = false;

function initializeGalleryCarousel() {
  renderGallerySlides();
  renderGalleryPagination();
  updateGalleryProgressBar();
}

function renderGallerySlides() {
  const track = document.getElementById("galleryCarouselTrack");
  const slides = galleryInteriorData[galleryCurrentFace];

  track.innerHTML = slides
    .map(
      (slide) =>
        `<div class="gallery-carousel-slide">
                    <img src="${slide.image}" alt="${slide.title}" class="gallery-slide-image">
                    <div class="gallery-slide-overlay"></div>
                </div>`
    )
    .join("");

  updateGalleryCarouselPosition();
}

function renderGalleryPagination() {
  const pagination = document.getElementById("galleryCarouselPagination");
  const slides = galleryInteriorData[galleryCurrentFace];

  pagination.innerHTML = slides
    .map(
      (_, index) =>
        `<div class="gallery-pagination-dot ${
          index === galleryCurrentSlideIndex ? "gallery-active" : ""
        }" onclick="goToGallerySlide(${index})"></div>`
    )
    .join("");
}

function updateGalleryCarouselPosition() {
  const track = document.getElementById("galleryCarouselTrack");
  track.style.transform = `translateX(-${galleryCurrentSlideIndex * 100}%)`;
}

function updateGalleryProgressBar() {
  const progressBar = document.getElementById("galleryProgressBar");
  const slides = galleryInteriorData[galleryCurrentFace];
  const progress = ((galleryCurrentSlideIndex + 1) / slides.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function updateGalleryPagination() {
  const dots = document.querySelectorAll(".gallery-pagination-dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("gallery-active", index === galleryCurrentSlideIndex);
  });
}

function galleryPreviousSlide() {
  if (galleryIsTransitioning) return;
  galleryIsTransitioning = true;

  const slides = galleryInteriorData[galleryCurrentFace];
  galleryCurrentSlideIndex =
    galleryCurrentSlideIndex === 0
      ? slides.length - 1
      : galleryCurrentSlideIndex - 1;

  updateGalleryCarouselPosition();
  updateGalleryPagination();
  updateGalleryProgressBar();

  setTimeout(() => {
    galleryIsTransitioning = false;
  }, 800);
}

function galleryNextSlide() {
  if (galleryIsTransitioning) return;
  galleryIsTransitioning = true;

  const slides = galleryInteriorData[galleryCurrentFace];
  galleryCurrentSlideIndex =
    galleryCurrentSlideIndex === slides.length - 1
      ? 0
      : galleryCurrentSlideIndex + 1;

  updateGalleryCarouselPosition();
  updateGalleryPagination();
  updateGalleryProgressBar();

  setTimeout(() => {
    galleryIsTransitioning = false;
  }, 800);
}

function goToGallerySlide(index) {
  if (galleryIsTransitioning || index === galleryCurrentSlideIndex) return;
  galleryIsTransitioning = true;

  galleryCurrentSlideIndex = index;
  updateGalleryCarouselPosition();
  updateGalleryPagination();
  updateGalleryProgressBar();

  setTimeout(() => {
    galleryIsTransitioning = false;
  }, 800);
}

// Face toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  initializeGalleryCarousel();

  document.querySelectorAll(".gallery-face-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (this.classList.contains("gallery-active") || galleryIsTransitioning)
        return;

      // Remove active class from all buttons
      document
        .querySelectorAll(".gallery-face-btn")
        .forEach((b) => b.classList.remove("gallery-active"));

      // Add active class to clicked button
      this.classList.add("gallery-active");

      // Update current face
      galleryCurrentFace = this.dataset.galleryFace;
      galleryCurrentSlideIndex = 0;

      // Re-render carousel
      initializeGalleryCarousel();
    });
  });
});

// Keyboard navigation for gallery
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft" && e.ctrlKey) {
    galleryPreviousSlide();
  } else if (e.key === "ArrowRight" && e.ctrlKey) {
    galleryNextSlide();
  }
});

// Touch/swipe support for gallery
let galleryTouchStartX = 0;
let galleryTouchEndX = 0;

document
  .getElementById("galleryCarouselTrack")
  .addEventListener("touchstart", (e) => {
    galleryTouchStartX = e.changedTouches[0].screenX;
  });

document
  .getElementById("galleryCarouselTrack")
  .addEventListener("touchend", (e) => {
    galleryTouchEndX = e.changedTouches[0].screenX;
    handleGallerySwipe();
  });

function handleGallerySwipe() {
  const swipeThreshold = 50;
  const diff = galleryTouchStartX - galleryTouchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      galleryNextSlide(); // Swipe left - next slide
    } else {
      galleryPreviousSlide(); // Swipe right - previous slide
    }
  }
}

// location advantags
function laToggleSection(header) {
  const currentSection = header.parentElement;
  const currentContent = currentSection.querySelector(".la-amenity-content");
  const currentIcon = header.querySelector(".la-dropdown-icon");

  // Close all other sections
  const allSections = document.querySelectorAll(".la-amenity-section");
  allSections.forEach((section) => {
    if (section !== currentSection) {
      section.querySelector(".la-amenity-header").classList.remove("la-active");
      section
        .querySelector(".la-amenity-content")
        .classList.remove("la-active");
      section.querySelector(".la-dropdown-icon").classList.remove("la-rotated");
    }
  });

  // Toggle current section
  if (currentContent.classList.contains("la-active")) {
    header.classList.remove("la-active");
    currentContent.classList.remove("la-active");
    currentIcon.classList.remove("la-rotated");
  } else {
    header.classList.add("la-active");
    currentContent.classList.add("la-active");
    currentIcon.classList.add("la-rotated");
  }
}

// booking section
function showProperty(event, type) {
  // Update button states
  const buttons = document.querySelectorAll(".booking-toggle-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  // Hide all property sections
  const sections = document.querySelectorAll(".booking-property-section");
  sections.forEach((section) => section.classList.remove("active"));

  // Show selected property section
  document.getElementById(type + "-section").classList.add("active");
}

function submitVillamentsForm(event) {
  event.preventDefault();
  const formData = {
    propertyType: "villaments",
    name: document.getElementById("villaments-name").value,
    email: document.getElementById("villaments-email").value,
    countryCode: document.getElementById("villaments-country-code").value,
    phone: document.getElementById("villaments-phone").value,
    date: document.getElementById("villaments-date").value,
    time: document.getElementById("villaments-time").value,
    location: "Bengaluru Central",
  };
  console.log("Villaments Form Data:", formData);
  showSuccessMessage("Villaments visit scheduled successfully!");
  document.getElementById("villamentsForm").reset();
  document.getElementById("villaments-date").value = "2025-09-26";
}

function submitVillasForm(event) {
  event.preventDefault();
  const formData = {
    propertyType: "villas",
    name: document.getElementById("villas-name").value,
    email: document.getElementById("villas-email").value,
    countryCode: document.getElementById("villas-country-code").value,
    phone: document.getElementById("villas-phone").value,
    date: document.getElementById("villas-date").value,
    time: document.getElementById("villas-time").value,
    location: "Whitefield Tech Park",
  };
  console.log("Villas Form Data:", formData);
  showSuccessMessage("Villas visit scheduled successfully!");
  document.getElementById("villasForm").reset();
  document.getElementById("villas-date").value = "2025-09-26";
}

function showSuccessMessage(message) {
  const popup = document.getElementById("successPopup");
  const popupMessage = document.getElementById("popupMessage");
  popupMessage.innerHTML = "✓ " + message;
  popup.classList.add("show");
  setTimeout(() => {
    closePopup();
  }, 4000);
}

function closePopup() {
  const popup = document.getElementById("successPopup");
  popup.classList.remove("show");
}

// Set minimum date to today for both forms
const today = new Date().toISOString().split("T")[0];
document.getElementById("villaments-date").setAttribute("min", today);
document.getElementById("villas-date").setAttribute("min", today);
// ============================================
// PROPERTY SHOWCASE SECTION (VILLAS & VILLAMENTS)
// ============================================

const propData = {
  villaments: {
    title: "Verde En Resplandor – Phase 3 Row Houses in Whitefield",
    description:
      "Step into a world where luxury embraces nature. With spacious layouts, elegant finishes, and serene surroundings, every home is a private sanctuary designed for those who seek sophistication and tranquility in equal measure.",
    features: [
      { label: "", icon: "./icons/plot.svg", value: "100+ Amenities" },
      {
        label: "",
        icon: "./icons/nature.svg",
        value: "50,000 Sqft Multistorey Clubhouse",
      },
      {
        label: "",
        icon: "./icons/maximize.svg",
        value: "60 % Open Green Space",
      },
      {
        label: "",
        icon: "./icons/gate.svg",
        value: "27 Lush Parks for Leisure & Recreation",
      },
    ],
    details: {
      top: [
        { category: "", icon: "", title: "Indoor Temperature Controlled pool" },
        { category: "", icon: "", title: "Olympic Sized Swimming pool" },
        {
          category: "",
          icon: "",
          title: "Provisioned with Ev Charging Points",
        },
        { category: "", icon: "", title: "Rooftop Solar Systems" },
      ],
      bottom: [{ category: "", icon: "", title: "The Club Verdent" }],
    },
  },
  villas: {
    title:
      "Trifecta Verde En Resplandor Villas – Phase 3 | 4 BHK Luxury Villas in Whitefield",
    description:
      "Experience the perfect harmony of luxury, elegance, and nature. Nestled in Budigere, Whitefield, these 4 BHK villas redefine upscale living with spacious layouts, modern aesthetics, lush gardens, and serene outdoor spaces — a private sanctuary for a truly elevated lifestyle.",
    features: [
      { label: "", icon: "./icons/plot.svg", value: "100+ Amenities" },
      {
        label: "",
        icon: "./icons/nature.svg",
        value: "50,000 Sqft Multistorey Clubhouse",
      },
      {
        label: "",
        icon: "./icons/maximize.svg",
        value: "60 % Open Green Space",
      },
      {
        label: "",
        icon: "./icons/gate.svg",
        value: "27 Lush Parks for Leisure & Recreation",
      },
    ],
    details: {
      top: [
        { category: "", icon: "", title: "Indoor Temperature Controlled pool" },
        { category: "", icon: "", title: "Olympic Sized Swimming pool" },
        {
          category: "",
          icon: "",
          title: "Provisioned with Ev Charging Points",
        },
        { category: "", icon: "", title: "Rooftop Solar Systems" },
      ],
      bottom: [{ category: "", icon: "", title: "The Club Verdent" }],
    },
  },
};

let propCurrentType = "villas"; // Changed to match HTML active button
let propDetailsVisible = false;

function propShowContent(type) {
  // Update button states
  document.querySelectorAll(".prop-toggle-btn").forEach((btn) => {
    btn.classList.remove("prop-active");
  });
  event.target.classList.add("prop-active");

  propCurrentType = type;
  propRenderContent();
}

function propRenderContent() {
  const data = propData[propCurrentType];
  const contentArea = document.getElementById("prop-content-area");

  if (!contentArea) return; // Safety check

  const detailsHTML = propDetailsVisible
    ? `
      <div class="prop-details-section prop-active">
        <div class="prop-details-grid">
          ${data.details.top
            .map(
              (item) => `
              <div class="prop-detail-item">
                <div class="prop-detail-category">${item.category}</div>
                <div class="prop-detail-icon">${item.icon}</div>
                <div class="prop-detail-title">${item.title}</div>
              </div>
            `
            )
            .join("")}
        </div>
        <div class="prop-details-grid-bottom">
          ${data.details.bottom
            .map(
              (item) => `
              <div class="prop-detail-item">
                <div class="prop-detail-category">${item.category}</div>
                <div class="prop-detail-icon">${item.icon}</div>
                <div class="prop-detail-title">${item.title}</div>
              </div>
            `
            )
            .join("")}
        </div>
      </div>
    `
    : "";

  contentArea.innerHTML = `
    <h1 class="prop-main-title">${data.title}</h1>
    
    <p class="prop-description">${data.description}</p>
    
    <div class="prop-features-grid">
      ${data.features
        .map(
          (feature) => `
          <div class="prop-feature">
            <div class="prop-feature-label">${feature.label}</div>
            <img src='${feature.icon}' class="prop-feature-icon special-icons" alt="feature icon">
            <div class="prop-feature-value">${feature.value}</div>
          </div>
        `
        )
        .join("")}
    </div>
    
    <button class="prop-view-btn" onclick="propToggleDetails()">
      ${propDetailsVisible ? "HIDE EXCLUSIVES" : "VIEW ALL EXCLUSIVES"}
    </button>
    
    ${detailsHTML}
  `;
}

function propToggleDetails() {
  propDetailsVisible = !propDetailsVisible;
  propRenderContent();

  if (propDetailsVisible) {
    // Smooth scroll to details
    setTimeout(() => {
      const detailsSection = document.querySelector(".prop-details-section");
      if (detailsSection) {
        detailsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }
}

// Initialize property section on page load
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("prop-content-area")) {
    propRenderContent();
  }
});

// Open Brochure Popup
function openBrochurePopup() {
  const popup = document.getElementById("brochurePopup");
  popup.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

// Close Brochure Popup
function closeBrochurePopup() {
  const popup = document.getElementById("brochurePopup");
  popup.classList.remove("active");
  document.body.style.overflow = ""; // Restore scrolling
}

// Close popup when clicking outside
document
  .getElementById("brochurePopup")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      closeBrochurePopup();
    }
  });

// Close popup with Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeBrochurePopup();
  }
});

// Handle Form Submissionf
function handleBrochureSubmit(event) {
  event.preventDefault();

  const form = document.getElementById("brochureDownloadForm");
  const formData = {
    name: form.querySelector('input[type="text"]').value,
    email: form.querySelector('input[type="email"]').value,
    phone: form.querySelector('input[type="tel"]').value,
    countryCode: form.querySelector(".country-code").value,
    propertyType: form.querySelector("select").value,
    agreeToUpdates: form.querySelector('input[type="checkbox"]').checked,
    timestamp: new Date().toISOString(),
    formType: "brochure_download",
  };

  // Log the data (you can send this to your backend later)
  console.log("Brochure Download Form Data:", formData);

  // Show success message
  const submitBtn = form.querySelector(".btn-form");
  const originalText = submitBtn.textContent;

  submitBtn.textContent = " submitting...";
  submitBtn.style.backgroundColor = "#4ade80";
  submitBtn.disabled = true;

  // Simulate download and reset
  setTimeout(() => {
    submitBtn.textContent = "✓  Successful!";

    setTimeout(() => {
      closeBrochurePopup();
      form.reset();
      form.querySelector('input[type="checkbox"]').checked = true;
      submitBtn.textContent = originalText;
      submitBtn.style.backgroundColor = "#ff6b35";
      submitBtn.disabled = false;
    }, 2000);
  }, 1500);
}

// Create fullscreen modal HTML
const fullscreenModal = document.createElement("div");
fullscreenModal.id = "fullscreenModal";
fullscreenModal.innerHTML = `
  <style>
    #fullscreenModal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.18);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(10px)
    }
    
    #fullscreenModal.active {
      display: flex;
    }
    
    #fullscreenModal img {
      max-width: 95%;
      max-height: 95%;
      object-fit: contain;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
      background: white;
    }
    
    #fullscreenModal .close-btn {
      position: absolute;
      top: 20px;
      right: 30px;
      color: #103c3b;
      font-size: 50px;
      font-weight: bold;
      cursor: pointer;
      background: white;
      border: none;
      z-index: 10000;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      line-height: 1;
    }
    
    #fullscreenModal .close-btn:hover {
      background: #d4933e;
      color: white;
      transform: scale(1.1);
    }
  </style>
  <button class="close-btn" onclick="closeFullscreen()">&times;</button>
  <img id="fullscreenImage" src="" alt="Floor Plan">
`;
document.body.appendChild(fullscreenModal);

// Function to open fullscreen
function openFullscreen(imageSrc) {
  const modal = document.getElementById("fullscreenModal");
  const img = document.getElementById("fullscreenImage");
  img.src = imageSrc;
  modal.classList.add("active");
}

// Function to close fullscreen
function closeFullscreen() {
  const modal = document.getElementById("fullscreenModal");
  modal.classList.remove("active");
}

// Close on background click
document
  .getElementById("fullscreenModal")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      closeFullscreen();
    }
  });

// Close on ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeFullscreen();
  }
});

// Update renderFloorPlanSlider to add click handlers
function renderFloorPlanSlider() {
  const slider = document.getElementById("floorPlanSlider");
  const slides = floorPlansData[floorPlanCurrentFacing].slides;

  slider.innerHTML = slides
    .map(
      (slide) =>
        `<div class="floor-plan-slide">
                    ${slide
                      .map(
                        (plan) =>
                          `<div class="floor-plan-card">
                            <img src="${plan.image}" alt="${plan.title}" class="floor-plan-image" onclick="openFullscreen('${plan.image}')">
                            <div class="floor-plan-info">
                                <h3 class="floor-plan-title">${plan.title}</h3>
                            </div>
                        </div>`
                      )
                      .join("")}
                </div>`
    )
    .join("");

  updateFloorPlanSliderPosition();
}

function showPhase(phaseNumber) {
  // Remove active class from all buttons
  const buttons = document.querySelectorAll(".phase-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Add active class to clicked button
  buttons[phaseNumber - 1].classList.add("active");

  // Hide all phase contents
  const phases = document.querySelectorAll(".phase-content");
  phases.forEach((phase) => phase.classList.remove("active"));

  // Show selected phase
  document.getElementById("phase" + phaseNumber).classList.add("active");
}

//code added

// Wrap everything in IIFE to avoid conflicts
(function () {
  // Only run if elements exist
  const mpImg = document.getElementById("masterplanImage");
  const mpOverlay = document.getElementById("fullscreenOverlay");
  const mpFullscreenImg = document.getElementById("fullscreenImage2");
  const mpCloseBtn = document.getElementById("closeBtn");

  // Exit if elements not found
  if (!mpImg || !mpOverlay || !mpFullscreenImg || !mpCloseBtn) {
    return;
  }

  // Open fullscreen
  function openMpFullscreen() {
    mpFullscreenImg.src = mpImg.src;
    mpOverlay.classList.add("active");
    document.body.classList.add("mp-no-scroll");
  }

  // Close fullscreen
  function closeMpFullscreen() {
    mpOverlay.classList.remove("active");
    document.body.classList.remove("mp-no-scroll");
  }

  // Image click
  mpImg.addEventListener("click", openMpFullscreen);

  // Close button click
  mpCloseBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    closeMpFullscreen();
  });

  // Overlay click
  mpOverlay.addEventListener("click", function (e) {
    if (e.target === mpOverlay) {
      closeMpFullscreen();
    }
  });

  // ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mpOverlay.classList.contains("active")) {
      closeMpFullscreen();
    }
  });
})();


 // Location Map Fullscreen Handler - Only for location map
        (function() {
            const laImg = document.getElementById('locationMapImage');
            const laOverlay = document.getElementById('laFullscreenOverlay');
            const laFullscreenImg = document.getElementById('laFullscreenImage');
            const laCloseBtn = document.getElementById('laCloseBtn');

            // Exit if elements not found
            if (!laImg || !laOverlay || !laFullscreenImg || !laCloseBtn) {
                return;
            }

            // Open fullscreen
            function openLaFullscreen() {
                laFullscreenImg.src = laImg.src;
                laOverlay.classList.add('active');
                document.body.classList.add('la-no-scroll');
            }

            // Close fullscreen
            function closeLaFullscreen() {
                laOverlay.classList.remove('active');
                document.body.classList.remove('la-no-scroll');
            }

            // Image click
            laImg.addEventListener('click', openLaFullscreen);

            // Close button click
            laCloseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeLaFullscreen();
            });

            // Overlay click
            laOverlay.addEventListener('click', function(e) {
                if (e.target === laOverlay) {
                    closeLaFullscreen();
                }
            });

            // ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && laOverlay.classList.contains('active')) {
                    closeLaFullscreen();
                }
            });
        })();