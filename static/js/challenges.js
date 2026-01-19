const ChallengeManager = {
    generateBtn: null,
    challengeTitle: null,
    challengeDescription: null,

    init() {
        this.generateBtn = document.getElementById('generate-challenge-btn');
        this.challengeTitle = document.getElementById('challenge-title');
        this.challengeDescription = document.getElementById('challenge-description');

        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', () => this.generateChallenge());
        }
    },

    async generateChallenge() {
        if (!this.generateBtn) return;

        const originalText = this.generateBtn.innerHTML;
        this.generateBtn.disabled = true;
        this.generateBtn.innerHTML = `
            <span class="material-symbols-outlined text-lg animate-spin">refresh</span>
            Generating...
        `;

        try {
            const response = await fetch('/challenge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.title && data.description) {
                if (this.challengeTitle) {
                    this.challengeTitle.textContent = data.title;
                }
                if (this.challengeDescription) {
                    this.challengeDescription.textContent = data.description;
                }
            } else {
                console.error('Invalid challenge data:', data);
                if (this.challengeTitle) {
                    this.challengeTitle.textContent = 'Error';
                }
                if (this.challengeDescription) {
                    this.challengeDescription.textContent = 'Could not load challenge data.';
                }
            }
        } catch (error) {
            console.error('Failed to generate challenge:', error);
            if (this.challengeTitle) {
                this.challengeTitle.textContent = 'Connection Error';
            }
            if (this.challengeDescription) {
                this.challengeDescription.textContent = 'Could not generate challenge. Please try again.';
            }
        } finally {
            this.generateBtn.disabled = false;
            this.generateBtn.innerHTML = originalText;
        }
    }
};
