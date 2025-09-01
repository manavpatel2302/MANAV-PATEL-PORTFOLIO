// Define the AngularJS module
angular
  .module("portfolioApp", [])

  // Define the main controller
  .controller("PortfolioController", [
    "$scope",
    "$http",
    function ($scope, $http) {
      // Navigation menu toggle
      $scope.toggleMenu = function () {
        const nav = document.getElementById("nav-menu");
        nav.classList.toggle("show");
      };

      // Close menu when a link is clicked
      $scope.closeMenu = function () {
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

      // Form validation and submission
      $scope.submitForm = function () {
        // Validation regex
        const nameRegex = /^[A-Za-z\s]{2,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Reset errors
        $scope.formErrors = {};

        // Validate fields
        if (!$scope.formData.name) {
          $scope.formErrors.name = "Name is required.";
        } else if (!nameRegex.test($scope.formData.name)) {
          $scope.formErrors.name =
            "Please enter a valid name (letters and spaces, min 2 characters).";
        }

        if (!$scope.formData.email) {
          $scope.formErrors.email = "Email is required.";
        } else if (!emailRegex.test($scope.formData.email)) {
          $scope.formErrors.email = "Please enter a valid email address.";
        }

        if (!$scope.formData.message) {
          $scope.formErrors.message = "Message is required.";
        } else if ($scope.formData.message.length < 10) {
          $scope.formErrors.message =
            "Message must be at least 10 characters long.";
        }

        // If no errors, proceed with submission
        if (Object.keys($scope.formErrors).length === 0) {
          $scope.isSubmitting = true;
          const payload = {
            name: $scope.formData.name,
            email: $scope.formData.email,
            message: $scope.formData.message,
            submittedAt: new Date().toISOString(),
            timestamp: new Date().toLocaleString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
          };

          // First, save to localStorage as backup
          try {
            const existingData = JSON.parse(
              localStorage.getItem("contactFormData") || "[]"
            );
            existingData.push(payload);
            localStorage.setItem(
              "contactFormData",
              JSON.stringify(existingData)
            );
          } catch (e) {
            // ignore localStorage errors
          }

          // Google Apps Script endpoint for saving to Google Sheets
          // You'll need to replace this with your actual deployed script URL
          const googleScriptUrl =
            "https://script.google.com/macros/s/AKfycbyLMl39BacuKZUzMLz6LyLcu4-HSw9SO9VvDWLdciWB9-gscD9o_GPY-XKofmvXu49WHw/exec";

          // Try to send to Google Sheets
          $http
            .post(googleScriptUrl, payload, {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 15000,
            })
            .then(function (response) {
              // Show thank you modal using Bootstrap
              $scope.showThankYou = true;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
              // Trigger Bootstrap modal
              const modalElement = document.getElementById("thankYouModal");
              if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
              }
              // Reset form
              $scope.formData = { name: "", email: "", message: "" };
              // Reset errors
              $scope.formErrors = {};
            })
            .catch(function (error) {
              // Show thank you modal even if Google Sheets fails
              // Data is still saved locally as backup
              $scope.showThankYou = true;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
              // Trigger Bootstrap modal
              const modalElement = document.getElementById("thankYouModal");
              if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
              }
              // Reset form
              $scope.formData = { name: "", email: "", message: "" };
              // Reset errors
              $scope.formErrors = {};
            })
            .finally(function () {
              $scope.isSubmitting = false;
            });
        }
      };

      // Close the thank you popup
      $scope.closePopup = function () {
        $scope.showThankYou = false;
        // Hide Bootstrap modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("thankYouModal")
        );
        if (modal) {
          modal.hide();
        }
      };

      //

      // Scroll-based active link
      function scrollActive() {
        const scrollDown = window.scrollY;
        const sections = document.querySelectorAll("section[id]");
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
        ".home__data, .about__img, .skills__subtitle, .skills__text",
        {}
      );
      sr.reveal(".home__img, .about__subtitle, .about__text, .skills__img", {
        delay: 400,
      });
      sr.reveal(".home__social-icon", { interval: 200 });
      sr.reveal(".skills__data, .work__img, .contact__input", {
        interval: 200,
      });
    },
  ]);
