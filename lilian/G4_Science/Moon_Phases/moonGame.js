(function () {
    const moonData = [
        {
            image: "Gemini_Generated_Image_d0d1yjd0d1yjd0d1.png",
            answers: {
                A: "Full Moon",
                B: "Waxing Gibbous",
                C: "First Quarter",
                D: "Waxing Crescent",
                E: "New Moon",
                F: "Waning Crescent",
                G: "Third Quarter",
                H: "Waning Gibbous"
            }
        },
        {
            image: "Gemini_Generated_Image_usffp3usffp3usff.png",
            answers: {
                A: "New Moon",
                B: "Waxing Crescent",
                C: "First Quarter",
                D: "Waxing Gibbous",
                E: "Full Moon",
                F: "Waning Gibbous",
                G: "Third Quarter",
                H: "Waning Crescent"
            }
        }
    ];

    const options = [
        "New Moon",
        "Waxing Crescent",
        "First Quarter",
        "Waxing Gibbous",
        "Full Moon",
        "Waning Gibbous",
        "Third Quarter",
        "Waning Crescent"
    ];

    class MoonGame {
        constructor() {
            this.currentGame = null;
            this.init();
        }

        init() {
            this.setupStars();
            this.startNewGame();
            this.bindEvents();
        }

        setupStars() {
            const starsContainer = document.getElementById('stars');
            if (!starsContainer) return;
            const count = 200;
            for (let i = 0; i < count; i++) {
                const star = document.createElement('div');
                star.style.position = 'absolute';
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.width = `${Math.random() * 3}px`;
                star.style.height = star.style.width;
                star.style.background = 'white';
                star.style.borderRadius = '50%';
                star.style.opacity = Math.random();
                star.style.boxShadow = `0 0 ${Math.random() * 10}px white`;
                starsContainer.appendChild(star);
            }
        }

        startNewGame() {
            this.currentGame = moonData[Math.floor(Math.random() * moonData.length)];

            const img = document.getElementById('moon-diagram');
            img.src = `images/${this.currentGame.image}`;

            const quizSection = document.getElementById('quiz-items');
            quizSection.innerHTML = '';

            const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            labels.forEach(label => {
                const item = document.createElement('div');
                item.className = 'question-item';

                item.innerHTML = `
                    <div class="label-circle">${label}</div>
                    <select id="select-${label}">
                        <option value="" disabled selected>Select Phase...</option>
                        ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                `;
                quizSection.appendChild(item);
            });

            document.getElementById('feedback').style.display = 'none';
            document.getElementById('submit-btn').textContent = 'Submit Answers';
        }

        bindEvents() {
            document.getElementById('submit-btn').addEventListener('click', () => {
                if (document.getElementById('feedback').style.display === 'block') {
                    this.startNewGame();
                } else {
                    this.checkAnswers();
                }
            });
        }

        checkAnswers() {
            let score = 0;
            const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            const results = [];

            labels.forEach(label => {
                const select = document.getElementById(`select-${label}`);
                const userAnswer = select.value;
                const correctAnswer = this.currentGame.answers[label];

                const isCorrect = userAnswer === correctAnswer;
                if (isCorrect) score += 2;

                results.push({
                    label,
                    isCorrect,
                    userAnswer,
                    correctAnswer
                });

                select.style.borderColor = isCorrect ? '#4ade80' : '#f87171';
            });

            this.displayFeedback(score, results);
        }

        displayFeedback(score, results) {
            const feedback = document.getElementById('feedback');
            const scoreText = document.getElementById('score-text');
            const summary = document.getElementById('summary-details');

            feedback.style.display = 'block';
            scoreText.innerHTML = `Score: <span class="${score === 16 ? 'correct' : 'incorrect'}">${score}</span> / 16`;

            summary.innerHTML = results.map(res => `
                <div>
                    <strong>${res.label}</strong>: 
                    <span class="${res.isCorrect ? 'correct' : 'incorrect'}">
                        ${res.isCorrect ? 'Correct!' : `False (${res.correctAnswer})`}
                    </span>
                </div>
            `).join('');

            document.getElementById('submit-btn').textContent = 'Play Again';
            feedback.scrollIntoView({ behavior: 'smooth' });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new MoonGame();
    });
})();
