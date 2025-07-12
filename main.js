// Define the AngularJS module
angular.module('portfolioApp', [])

// Define the main controller
.controller('PortfolioController', ['$scope', function($scope) {
    // Navigation menu toggle
    $scope.toggleMenu = function() {
        const nav = document.getElementById('nav-menu');
        nav.classList.toggle('show');
    };

    // Close menu when a link is clicked
    $scope.closeMenu = function() {
        const navMenu = document.getElementById('nav-menu');
        navMenu.classList.remove('show');
    };

    // Form data model
    $scope.formData = {
        name: '',
        email: '',
        message: ''
    };

    // Form validation and submission
    $scope.submitForm = function() {
        // Validation regex
        const nameRegex = /^[A-Za-z\s]{2,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Reset errors
        $scope.formErrors = {};

        // Validate fields
        if (!$scope.formData.name) {
            $scope.formErrors.name = 'Name is required.';
        } else if (!nameRegex.test($scope.formData.name)) {
            $scope.formErrors.name = 'Please enter a valid name (letters and spaces, min 2 characters).';
        }

        if (!$scope.formData.email) {
            $scope.formErrors.email = 'Email is required.';
        } else if (!emailRegex.test($scope.formData.email)) {
            $scope.formErrors.email = 'Please enter a valid email address.';
        }

        if (!$scope.formData.message) {
            $scope.formErrors.message = 'Message is required.';
        } else if ($scope.formData.message.length < 10) {
            $scope.formErrors.message = 'Message must be at least 10 characters long.';
        }

        // If no errors, proceed with submission
        if (Object.keys($scope.formErrors).length === 0) {
            console.log('Form is valid:', $scope.formData);
            alert('Form submitted successfully!');
            $scope.formData = { name: '', email: '', message: '' }; // Reset form
        }
    };

    // Scroll-based active link
    function scrollActive() {
        const scrollDown = window.scrollY;
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight,
                sectionTop = current.offsetTop - 58,
                sectionId = current.getAttribute('id'),
                sectionsClass = document.querySelector(`.nav__menu a[href*=${sectionId}]`);
            if (sectionsClass) {
                if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                    sectionsClass.classList.add('active-link');
                } else {
                    sectionsClass.classList.remove('active-link');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);

    // Initialize ScrollReveal
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 2000,
        delay: 200
    });

    sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text', {});
    sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img', { delay: 400 });
    sr.reveal('.home__social-icon', { interval: 200 });
    sr.reveal('.skills__data, .work__img, .contact__input', { interval: 200 });
}]);