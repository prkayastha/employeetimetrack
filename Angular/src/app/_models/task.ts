import { Role } from './role';

export class Task {
    id: string;
    role: Role;
    taskDescription: string;
    isDelete: string;
    createdAt: string;
    updatedAt: string;
    version: string;
    projectID: string;
}