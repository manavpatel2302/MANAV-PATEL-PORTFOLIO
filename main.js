// Define the AngularJS module
angular
  .module("portfolioApp", [])

  // Define the main controller
  .controller("PortfolioController", [
    "$scope",
    "$http",
    "$window",
    function($scope, $http, $window) {
      // Navigation menu toggle
      $scope.toggleMenu = function() {
        const nav = document.getElementById("nav-menu");
        nav.classList.toggle("show");
      };

      // Close menu when a link is clicked
      $scope.closeMenu = function() {
        const navMenu = document.getElementById("nav-menu");
        navMenu.classList.remove("show");
      };

      // Form data model
      $scope.formData = {
        name: "",
        email: "",
        message: "",
      };

      $scope.formErrors = {};
      $scope.isSubmitting = false;
      $scope.showThankYou = false;

      // Function to close the thank you popup
      $scope.closePopup = function() {
        $scope.showThankYou = false;
        // Hide Bootstrap modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("thankYouModal")
        );
        if (modal) {
          modal.hide();
        }
      };

      // Form validation and submission
      $scope.submitForm = function() {
        // Validation regex
        const nameRegex = /^[A-Za-z\s]{2,}$/;
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

        // Reset errors
        $scope.formErrors = {};

        // Validate fields
        if (!$scope.formData.name) {
          $scope.formErrors.name = "Name is required.";
        } else if (!nameRegex.test($scope.formData.name)) {
          $scope.formErrors.name = "Name must be at least 2 characters long and contain only letters and spaces.";
        }
        if (!$scope.formData.email) {
          $scope.formErrors.email = "Email is required.";
        } else if (!emailRegex.test($scope.formData.email)) {
          $scope.formErrors.email = "Please enter a valid email address.";
        }
        if (!$scope.formData.message) {
          $scope.formErrors.message = "Message is required.";
        }

        // Check if there are any validation errors
        if (Object.keys($scope.formErrors).length > 0) {
          return; // Stop form submission
        }

        // Set submitting state
        $scope.isSubmitting = true;

        const googleScriptUrl = "https://script.google.com/macros/s/AKfycbwx5vJv3gZbj9JsGx5dZVDhfQH5nU8NseH9D2b7N1lQFhX3de3WqEaYla0Chtxy0Ryoeg/exec";

        const requestData = {
          name: $scope.formData.name,
          email: $scope.formData.email,
          message: $scope.formData.message,
          submittedAt: new Date().toISOString(),
          timestamp: new Date().toLocaleString(),
          userAgent: navigator.userAgent,
          platform: navigator.platform,
        };

        // Serialize the data to a JSON string
        const payload = JSON.stringify(requestData);

        // Make the HTTP POST request
        $http.post(googleScriptUrl, payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(function(response) {
            // Success callback
            $scope.isSubmitting = false;
            $scope.showThankYou = true;
            if (!$scope.$$phase) {
              $scope.$apply();
            }
            const modalElement = document.getElementById("thankYouModal");
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
            $scope.formData = {}; // Clear form
            $scope.formErrors = {};
          })
          .catch(function(error) {
            // Error callback
            $scope.isSubmitting = false;
            console.error("Error submitting form:", error);
            $window.alert("Failed to send message. Please try again later.");
          })
          .finally(function() {
            $scope.isSubmitting = false;
          });
      };
    },
  ]);

// This script is responsible for managing the website's dynamic behavior,
// such as navigation toggles, form validation, and data submission
// to a Google Apps Script endpoint.
document.addEventListener("DOMContentLoaded", function() {
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");

  // Show menu
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  // Hide menu
  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  const navLink = document.querySelectorAll(".nav__link");

  function linkAction() {
    const navMenu = document.getElementById("nav-menu");
    navMenu.classList.remove("show-menu");
  }
  navLink.forEach((n) => n.addEventListener("click", linkAction));

  // Change header background on scroll
  function scrollHeader() {
    const nav = document.getElementById("header");
    if (this.scrollY >= 200) nav.classList.add("scroll-header");
    else nav.classList.remove("scroll-header");
  }
  window.addEventListener("scroll", scrollHeader);

  // Active link on scroll
  function scrollActive() {
    const sections = document.querySelectorAll("section[id]");
    const scrollDown = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight,
        sectionTop = current.offsetTop - 58,
        sectionId = current.getAttribute("id"),
        sectionsClass = document.querySelector(
          `.nav__menu a[href*=${sectionId}]`
        );
      if (sectionsClass) {
        if (
          scrollDown > sectionTop &&
          scrollDown <= sectionTop + sectionHeight
        ) {
          sectionsClass.classList.add("active-link");
        } else {
          sectionsClass.classList.remove("active-link");
        }
      }
    });
  }
  window.addEventListener("scroll", scrollActive);

  // Initialize ScrollReveal
  const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 2000,
    delay: 200,
  });
  sr.reveal(
    ".home__data, .about__img, .skills__subtitle, .skills__text", {}
  );
  sr.reveal(".home__img, .about__subtitle, .about__text, .skills__img", {
    delay: 400,
  });
  sr.reveal(".home__social-icon", {
    interval: 200
  });
  sr.reveal(".skills__data, .work__img, .contact__input", {
    interval: 200,
  });
});
