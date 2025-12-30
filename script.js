document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link, .logo, .btn-primary').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const offset = document.querySelector('.header').offsetHeight; // Height of the fixed header
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (document.querySelector('.nav-menu').classList.contains('active')) {
                    document.querySelector('.nav-menu').classList.remove('active');
                    document.querySelector('.hamburger').classList.remove('active');
                }
            }
        });
    });

    // Highlight active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const activateNavLink = () => {
        let current = '';
        const headerOffset = document.querySelector('.header').offsetHeight + 10; // Add buffer

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateNavLink);
    activateNavLink(); // Call on load to set initial active link

    // Sticky header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Dark mode toggle
    const themeToggle = document.getElementById('checkbox');
    const body = document.body;

    // Set initial theme based on localStorage or system preference
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
        themeToggle.checked = (currentTheme === 'dark');
    } else if (prefersDarkScheme.matches) {
        body.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    } else {
        body.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Project data for modal
    const projectsData = [
        {
            id: 1,
            title: "Customer Segmentation Using Machine Learning",
            tech: ["Python", "scikit-learn", "pandas", "matplotlib", "seaborn", "Optuna"],
            problem: "To identify distinct groups of customers within a dataset to enable targeted marketing strategies and personalized customer experiences.",
            approach: "Data from over 1,000 customer records was used. Initial steps involved thorough data cleaning to handle missing values and inconsistencies, followed by extensive Exploratory Data Analysis (EDA) to understand data distributions and relationships. Clustering techniques (e.g., K-Means) were applied to segment customers, and a Random Forest classifier was trained to predict segments. Hyperparameters were optimized using Optuna, incorporating both Grid Search and Bayesian Optimization techniques.",
            results: "Achieved 70% test accuracy in classifying new customers into segments. Feature importance analysis identified key drivers for customer behavior. The segmentation results were visualized using bar plots and heatmaps, providing clear insights into customer groups.",
            learnings: "Gained proficiency in customer segmentation methodologies, hyperparameter optimization with Optuna, and interpreting model insights for business applications.",
            github: "https://github.com/archana-brahma-example/customer-segmentation",
            visuals: ["https://via.placeholder.com/400x250/007bff/ffffff?text=Segmentation+Plot", "https://via.placeholder.com/400x250/28a745/ffffff?text=Feature+Importance"]
        },
        {
            id: 2,
            title: "Face Recognition Attendance System Using Machine Learning",
            tech: ["Python", "OpenCV", "MediaPipe", "scikit-learn", "Pandas", "NumPy", "Optuna"],
            problem: "To develop an automated, real-time attendance tracking system using facial recognition to eliminate manual processes and improve accuracy.",
            approach: "Implemented MediaPipe Face Mesh to extract 478 unique facial landmarks from video frames. These landmarks served as features for training a Random Forest Classifier to recognize individual faces. The system includes real-time login/logout tracking, recording details such as Name, Time, Duration, and On-Time/Late status. Data preprocessing and normalization were crucial steps to ensure robust feature extraction. Optuna was utilized for advanced hyperparameter tuning to enhance model performance and recognition accuracy.",
            results: "Successfully built a functional real-time attendance system. Achieved high accuracy in face recognition under varied conditions. The system automated attendance logging, significantly reducing administrative overhead and human error.",
            learnings: "Deepened understanding of real-time computer vision applications, facial landmark detection, and integrating ML models for practical, interactive systems.",
            github: "https://github.com/archana-brahma-example/face-recognition-attendance",
            visuals: ["https://via.placeholder.com/400x250/6f42c1/ffffff?text=Face+Detection+Screenshot", "https://via.placeholder.com/400x250/fd7e14/ffffff?text=Attendance+Log+Example"]
        },
        {
            id: 3,
            title: "Credit Score Analysis Using Machine Learning",
            tech: ["Python", "scikit-learn", "pandas", "matplotlib", "seaborn"],
            problem: "To predict customer credit scores accurately based on financial and demographic data, aiding financial institutions in risk assessment.",
            approach: "Leveraged a comprehensive dataset of financial and demographic information. Performed extensive Exploratory Data Analysis (EDA) to uncover patterns and relationships within the data. Data preprocessing included handling categorical variables through label encoding and creating new, informative features through feature engineering. Multiple machine learning models (e.g., Logistic Regression, Gradient Boosting, SVM) were trained and evaluated. The best-performing model was selected and saved along with its preprocessing pipeline for future deployment.",
            results: "Developed a robust ML model capable of predicting credit scores with high precision and recall. The model provides insights into the factors influencing creditworthiness, allowing for more informed decision-making in lending processes.",
            learnings: "Enhanced skills in financial data analysis, model selection, pipeline development, and interpreting complex features in risk prediction models.",
            github: "https://github.com/archana-brahma-example/credit-score-analysis",
            visuals: ["https://via.placeholder.com/400x250/dc3545/ffffff?text=Credit+Score+Distribution", "https://via.placeholder.com/400x250/ffc107/ffffff?text=Model+Performance"]
        }
    ];

    // Project Modal functionality
    const projectModal = document.getElementById('project-modal');
    const closeButton = document.querySelector('.close-button');
    const projectDetailButtons = document.querySelectorAll('.btn-project-detail');

    projectDetailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const projectId = e.target.closest('.project-card').dataset.projectId;
            const project = projectsData.find(p => p.id == projectId);

            if (project) {
                document.getElementById('modal-project-title').textContent = project.title;
                
                const techStackContainer = document.getElementById('modal-project-tech');
                techStackContainer.innerHTML = '';
                project.tech.forEach(tech => {
                    const span = document.createElement('span');
                    span.textContent = tech;
                    techStackContainer.appendChild(span);
                });

                document.getElementById('modal-problem-statement').textContent = project.problem;
                document.getElementById('modal-approach').textContent = project.approach;
                document.getElementById('modal-results').textContent = project.results;
                document.getElementById('modal-learnings').textContent = project.learnings;
                
                document.getElementById('modal-github-link').href = project.github;

                const visualsContainer = document.getElementById('modal-project-visuals');
                visualsContainer.innerHTML = '';
                project.visuals.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = `Screenshot for ${project.title}`;
                    visualsContainer.appendChild(img);
                });

                projectModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling body when modal is open
            }
        });
    });

    closeButton.addEventListener('click', () => {
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore body scroll
    });

    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore body scroll
        }
    });

    // Contact form submission (placeholder)
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, you would send this data to a backend server or a service like Formspree.
        // For this example, we'll just simulate a submission.

        formMessage.textContent = 'Sending message...';
        formMessage.className = 'form-message'; // Reset classes

        setTimeout(() => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (name && email && subject && message) {
                console.log('Form Submitted:', { name, email, subject, message });
                formMessage.textContent = 'Thank you for your message! I will get back to you shortly.';
                formMessage.classList.add('success');
                contactForm.reset();
            } else {
                formMessage.textContent = 'Please fill in all fields.';
                formMessage.classList.add('error');
            }
        }, 1500); // Simulate network request
    });

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});