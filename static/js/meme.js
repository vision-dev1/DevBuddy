const MemeManager = {
    memeQueue: [],
    isFetching: false,

    init() {
        const memeButton = document.getElementById('get-meme-btn');
        if (memeButton) {
            memeButton.addEventListener('click', () => this.fetchAndDisplayMeme());
        }
    },

    async fetchAndDisplayMeme() {
        const memeContainer = document.getElementById('meme-container');
        const memeImage = document.getElementById('meme-image');
        const errorMessage = document.getElementById('meme-error');

        if (errorMessage) {
            errorMessage.style.display = 'none';
        }

        if (this.memeQueue.length === 0) {
            try {
                await this.fetchMemeBatch();

                if (this.memeQueue.length === 0) {
                    this.showError();
                    return;
                }
            } catch (error) {
                console.error('Error fetching memes:', error);
                this.showError();
                return;
            }
        }

        const meme = this.memeQueue.shift();

        if (memeImage) {
            memeImage.src = meme.url;
            memeImage.alt = meme.title || 'Meme';
        }

        if (memeContainer) {
            memeContainer.style.display = 'block';
        }

        if (this.memeQueue.length <= 2 && !this.isFetching) {
            this.fetchMemeBatch().catch(err => {
                console.error('Background prefetch failed:', err);
            });
        }
    },

    async fetchMemeBatch() {
        if (this.isFetching) {
            return;
        }

        this.isFetching = true;

        try {
            const response = await fetch('https://meme-api.com/gimme/14?nsfw=false');

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            const newMemes = data.memes.filter(meme => meme.nsfw === false);

            this.memeQueue.push(...newMemes);
        } finally {
            this.isFetching = false;
        }
    },

    showError() {
        const errorMessage = document.getElementById('meme-error');
        const memeContainer = document.getElementById('meme-container');

        if (memeContainer) {
            memeContainer.style.display = 'none';
        }

        if (errorMessage) {
            errorMessage.textContent = 'Could not load a meme. Try again.';
            errorMessage.style.display = 'block';
        }
    }
};
