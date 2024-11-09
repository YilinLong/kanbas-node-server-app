import * as enrollmentDao from "./dao.js";
export default function EnrollmentRoutes(app) {
    app.delete("/api/enrollments/:enrollmentId", (req, res) => {
        const { enrollmentId } = req.params;
        enrollmentDao.deleteEnrollment(enrollmentId);
        res.sendStatus(204);
    });

}
