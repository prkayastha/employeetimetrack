class Project {

    constructor(data) {
        this.id = data.id || 0;
        this.projectName= data.projectName || null;
        this.createdByUserId = data.createdByUserId || 0;
        this.projectOwnerUserId = data.projectOwnerUserId || 0;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
        this.version = data.version || 0;
    }
}

module.exports = Project;