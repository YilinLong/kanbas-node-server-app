import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";
import {findAllCourses} from "../Courses/dao.js";
// let currentUser = null;
export default function UserRoutes(app) {
    const createUser = (req, res) => { };
    const deleteUser = (req, res) => { };
    const findAllUsers = (req, res) => { };
    const findUserById = (req, res) => { };
    const updateUser = (req, res) =>{
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signup = (req, res) => {    const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    const signin = (req, res) => {    const { username, password } = req.body;
        const currentUser = dao.findUserByCredentials(username, password);
        // console.log("signin", currentUser);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
            // console.log("signin2", req.session["currentUser"]);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };
    const profile = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        res.json(currentUser);
    };
    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
             // console.log("findcourse", currentUser);
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
         console.log("course",courses);
        res.json(courses);
    };

    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = courseDao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };
    const findEnrollmentsForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        // console.log(userId);
        const enrollments = enrollmentsDao.findEnrollmentsForUser(userId);
        // console.log("enroll",enrollments);
        res.json(enrollments);
    };

    app.post("/api/courses/:courseId/modules", (req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = modulesDao.createModule(module);
        res.send(newModule);
    });
    app.post("/api/courses/:courseId/assignments", (req, res) => {
        const { assignmentId } = req.params;
        const assignment = {
            ...req.body,
            id: assignmentId,
        };
        const newAssignment = assignmentsDao.createAssignment(assignment);
        res.send(newAssignment);
    });

    // http://localhost:3000/#/Kanbas/Courses/RS102/Assignments/new

    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

    app.post("/api/users/signin", signin);
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
    //enrollments
    app.get("/api/users/:userId/enrollments", findEnrollmentsForEnrolledUser);

    const enroll = (req, res) => {
        const newEnrollment = enrollmentsDao.createEnrollment(req.body);
        res.json(newEnrollment);
    };
    app.post("/api/users/current/enrollments", enroll);
}
