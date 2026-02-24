// Codes By Visionnn

const ModalManager = {
    modalContainer: null,
    audioElement: null,
    isVisible: false,

    init() {
        this.createModalContainer();
        this.createAudioElement();
    },

    createModalContainer() {
        this.modalContainer = document.createElement('div');
        this.modalContainer.id = 'reminder-modal';
        this.modalContainer.style.display = 'none';
        this.modalContainer.style.position = 'fixed';
        this.modalContainer.style.inset = '0';
        this.modalContainer.style.zIndex = '9999';
        document.body.appendChild(this.modalContainer);
    },

    createAudioElement() {
        this.audioElement = document.createElement('audio');
        this.audioElement.src = '/static/sounds/stop.mp3';
        this.audioElement.preload = 'auto';
        document.body.appendChild(this.audioElement);
    },

    showModal(message = '⏰ Take A Break') {
        if (this.isVisible) return;

        this.modalContainer.innerHTML = `
            <div class="absolute inset-0 bg-[#0c1211]/60 backdrop-blur-[2px] transition-opacity duration-300"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-[420px] transform scale-100 opacity-100 transition-all duration-300 border border-white/10 flex flex-col items-center p-8 text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                    <div class="mb-6 relative">
                        <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150"></div>
                        <div class="relative bg-primary/10 p-4 rounded-full text-primary">
                            <span class="material-symbols-outlined text-[40px]">self_improvement</span>
                        </div>
                    </div>
                    <h2 class="text-[#121716] dark:text-white tracking-tight text-[28px] font-bold leading-tight mb-3">
                        ${message}
                    </h2>
                    <p class="text-[#595959] dark:text-gray-300 text-base font-normal leading-relaxed mb-8 px-2">
                        You've been in the zone! Great focus! Now, take a moment to look away, stretch your back, and hydrate.
                    </p>
                    <div class="flex flex-col w-full gap-3">
                        <button id="modal-close-btn" class="w-full cursor-pointer flex items-center justify-center rounded-xl h-12 px-6 bg-primary hover:bg-primary-dark transition-colors text-[#121716] text-base font-bold tracking-[0.015em] shadow-lg shadow-primary/20">
                            Got it, I'm taking a break
                        </button>
                    </div>
                    <div class="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 w-full">
                        <p class="text-[11px] text-text-muted dark:text-gray-500 uppercase tracking-widest font-bold">
                            Wellness Tip
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Looking at greenery for 20 seconds reduces eye strain.
                        </p>
                    </div>
                </div>
            </div>
        `;

        this.modalContainer.style.display = 'block';
        this.isVisible = true;

        const closeBtn = document.getElementById('modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideModal());
        }

        this.playSound();
    },

    hideModal() {
        if (!this.isVisible) return;

        this.modalContainer.style.display = 'none';
        this.isVisible = false;
        this.stopSound();
    },

    playSound() {
        if (this.audioElement) {
            this.audioElement.currentTime = 0;
            this.audioElement.play().catch(e => console.error('Failed to play sound:', e));
        }
    },

    stopSound() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
    }
};
