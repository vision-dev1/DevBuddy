const TimerManager = {
    timeRemaining: 0,
    isRunning: false,
    isPaused: false,
    intervalId: null,
    timerDisplay: null,
    pauseBtn: null,
    completeBtn: null,
    startTime: null,
    duration: 0,

    init() {
        this.timerDisplay = document.getElementById('timer-display');
        this.pauseBtn = document.getElementById('timer-pause-btn');
        this.completeBtn = document.getElementById('timer-complete-btn');

        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.togglePause());
        }

        if (this.completeBtn) {
            this.completeBtn.addEventListener('click', () => this.complete());
        }
    },

    start(minutes) {
        this.stop();
        this.duration = minutes * 60;
        this.timeRemaining = this.duration;
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.updateDisplay();
        this.tick();
    },

    tick() {
        if (!this.isRunning || this.isPaused) return;

        this.intervalId = setInterval(() => {
            if (this.isPaused) return;

            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.timeRemaining = Math.max(0, this.duration - elapsed);

            this.updateDisplay();

            if (this.timeRemaining <= 0) {
                this.onTimerComplete();
            }
        }, 1000);
    },

    togglePause() {
        if (!this.isRunning) return;

        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            clearInterval(this.intervalId);
            if (this.pauseBtn) {
                const icon = this.pauseBtn.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = 'play_arrow';
            }
        } else {
            this.duration = this.timeRemaining;
            this.startTime = Date.now();
            this.tick();
            if (this.pauseBtn) {
                const icon = this.pauseBtn.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = 'pause';
            }
        }
    },

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },

    complete() {
        this.stop();
        this.timeRemaining = 0;
        this.updateDisplay();
    },

    reset() {
        this.stop();
        this.timeRemaining = 0;
        this.updateDisplay();
    },

    updateDisplay() {
        if (!this.timerDisplay) return;

        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.timerDisplay.textContent = display;
    },

    onTimerComplete() {
        this.stop();
        ModalManager.showModal('⏰ Take A Break');
    }
};
