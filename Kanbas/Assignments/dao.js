import Database from "../Database/index.js";
export function findAssignmentForCourse(courseId) {
    const { assignments } = Database;
    // console.log(`Assignments for course ${courseId}`, assignments.filter((assignment) => assignment.course === courseId));
    return assignments.filter((assignment) => assignment.course === courseId);
}
export function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: Date.now().toString() };
    Database.assignments = [...Database.assignments, newAssignment];
    console.log("newAssignment",newAssignment);
    return newAssignment;
}
export function deleteAssignment(assignmentId) {
    const { assignments } = Database;
    Database.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
}
export function updateAssignment(assignmentId, assignmentUpdates) {
    const { assignments } = Database;
    const assignment = assignments.find((assignment) => assignment._id === assignmentId);
    Object.assign(assignment, assignmentUpdates);
    return assignment;
}