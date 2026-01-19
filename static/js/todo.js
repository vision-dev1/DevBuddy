const TodoManager = {
    tasks: [],
    taskInput: null,
    taskTimeInput: null,
    addTaskBtn: null,
    activeTaskCard: null,

    init() {
        this.taskInput = document.getElementById('task-input');
        this.taskTimeInput = document.getElementById('task-time-input');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.activeTaskCard = document.querySelector('.lg\\:col-span-4 .bg-surface.rounded-2xl.shadow-soft.border.border-primary\\/20');

        if (this.addTaskBtn) {
            this.addTaskBtn.addEventListener('click', () => this.addTask());
        }

        if (this.taskInput) {
            this.taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addTask();
            });
        }

        if (this.taskTimeInput) {
            this.taskTimeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addTask();
            });
        }

        this.loadTasks();
    },

    addTask() {
        if (!this.taskInput) return;

        const taskName = this.taskInput.value.trim();
        if (!taskName) {
            alert('Please enter a task name');
            return;
        }

        let duration = 25;
        if (this.taskTimeInput && this.taskTimeInput.value) {
            const timeValue = parseInt(this.taskTimeInput.value);
            if (isNaN(timeValue) || timeValue <= 0) {
                alert('Please enter a valid time (positive number)');
                return;
            }
            if (timeValue > 120) {
                alert('Maximum time is 120 minutes');
                return;
            }
            duration = timeValue;
        }

        const task = {
            id: Date.now(),
            name: taskName,
            duration: duration,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.taskInput.value = '';
        if (this.taskTimeInput) {
            this.taskTimeInput.value = '';
        }

        this.setActiveTask(task);
    },

    setActiveTask(task) {
        if (!this.activeTaskCard) return;

        const titleEl = this.activeTaskCard.querySelector('h3');
        if (titleEl) {
            titleEl.textContent = task.name;
        }

        TimerManager.start(task.duration);
    },

    loadTasks() {
        this.tasks = StorageManager.loadTasks();
    },

    saveTasks() {
        StorageManager.saveTasks(this.tasks);
    },

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            this.saveTasks();
        }
    }
};
