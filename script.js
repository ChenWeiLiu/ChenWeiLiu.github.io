// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll-based animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.about-card, .project-card, .contact-link');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Load initial file
    loadFile('blocks.js');
});

// Add parallax effect to floating cards
window.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.floating-card');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    cards.forEach((card, index) => {
        const speed = (index + 1) * 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;

        card.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== File Loading Functionality =====
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/ChenWeiLiu/blockly-duino-xiaobai/main/';

// Load file from GitHub
async function loadFile(filename) {
    const loading = document.getElementById('loading');
    const codeContent = document.getElementById('code-content');
    const codeDisplay = document.getElementById('code-display');
    const currentFileName = document.getElementById('current-file-name');
    const viewGithubBtn = document.getElementById('view-github');

    // Show loading
    loading.classList.remove('hidden');
    codeDisplay.style.opacity = '0';

    try {
        const response = await fetch(GITHUB_RAW_BASE + filename);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const content = await response.text();

        // Update content
        codeContent.textContent = content;
        currentFileName.textContent = filename;

        // Update GitHub link
        viewGithubBtn.href = `https://github.com/ChenWeiLiu/blockly-duino-xiaobai/blob/main/${filename}`;

        // Hide loading and show content
        setTimeout(() => {
            loading.classList.add('hidden');
            codeDisplay.style.opacity = '1';
        }, 300);

    } catch (error) {
        console.error('Error loading file:', error);
        codeContent.textContent = `載入檔案時發生錯誤：${error.message}\n\n請確認檔案存在於 GitHub 倉庫中。`;

        setTimeout(() => {
            loading.classList.add('hidden');
            codeDisplay.style.opacity = '1';
        }, 300);
    }
}

// File button click handlers
document.addEventListener('DOMContentLoaded', () => {
    const fileButtons = document.querySelectorAll('.file-btn');

    fileButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            fileButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Load the file
            const filename = button.getAttribute('data-file');
            loadFile(filename);
        });
    });

    // Copy button handler
    const copyBtn = document.getElementById('copy-code');
    copyBtn.addEventListener('click', async () => {
        const codeContent = document.getElementById('code-content');
        const text = codeContent.textContent;

        try {
            await navigator.clipboard.writeText(text);

            // Visual feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ 已複製';
            copyBtn.style.background = 'rgba(99, 102, 241, 0.2)';
            copyBtn.style.borderColor = 'var(--primary-color)';
            copyBtn.style.color = 'var(--primary-light)';

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = 'transparent';
                copyBtn.style.borderColor = 'var(--border-color)';
                copyBtn.style.color = 'var(--text-secondary)';
            }, 2000);

        } catch (error) {
            console.error('Failed to copy:', error);
            copyBtn.textContent = '✗ 複製失敗';

            setTimeout(() => {
                copyBtn.textContent = '📋 複製';
            }, 2000);
        }
    });
});

