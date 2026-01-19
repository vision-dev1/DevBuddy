const StorageManager = {
    saveTasks(tasks) {
        try {
            localStorage.setItem('devbuddy_tasks', JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save tasks:', e);
        }
    },

    loadTasks() {
        try {
            const tasks = localStorage.getItem('devbuddy_tasks');
            return tasks ? JSON.parse(tasks) : [];
        } catch (e) {
            console.error('Failed to load tasks:', e);
            return [];
        }
    },

    saveChat(messages) {
        try {
            localStorage.setItem('devbuddy_chat', JSON.stringify(messages));
        } catch (e) {
            console.error('Failed to save chat:', e);
        }
    },

    loadChat() {
        try {
            const chat = localStorage.getItem('devbuddy_chat');
            return chat ? JSON.parse(chat) : [];
        } catch (e) {
            console.error('Failed to load chat:', e);
            return [];
        }
    },

    clearChat() {
        try {
            localStorage.removeItem('devbuddy_chat');
        } catch (e) {
            console.error('Failed to clear chat:', e);
        }
    }
};
