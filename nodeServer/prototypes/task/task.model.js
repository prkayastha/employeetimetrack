class Task {
    constructor(info) {
        this.id = info.id || 0;
        this.taskDescription = info.taskDescription || null;
        this.projectId = info.projectId || null;
        this.assigneeUserId = info.assigneeUserId || null;
        this.createdAt = info.createdAt || null;
        this.updatedAt = info.updatedAt || null;
        this.version = info.version || 0;
    }
}

module.exports = Task;