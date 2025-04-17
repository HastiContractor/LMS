const Course = require("../models/Course");
const Progress = require("../models/Progress");
const Certificate = require("../models/Certificate");
const Lesson = require("../models/Lesson");

exports.getInstructorDashboardReport = async (req, res) => {
  const { instructorId } = req.params;

  try {
    // 1) Get all courses created by instructor
    const courses = await Course.find({ instructor: instructorId }).populate(
      "students"
    );

    const courseReports = await Promise.all(
      courses.map(async (course) => {
        const lessons = await Lesson.find({ course: course._id }).select("_id");
        const lessonIds = lessons.map((lesson) => lesson._id);
        const lessonCount = lessonIds.length;

        const studentIds = course.students.map((student) => student._id);
        const studentCount = studentIds.length;

        console.log("lessonIds:", lessonIds);
        console.log("studentIds:", studentIds);

        // 2) Get all progress documents at once (optimize)
        const allProgress = await Progress.find({
          user: { $in: studentIds },
          lesson: { $in: lessonIds },
          completed: true,
        });

        // 3) Group progress by user
        const progressByUser = {};
        allProgress.forEach((p) => {
          const userId = p.user.toString();
          if (!progressByUser[userId]) progressByUser[userId] = 0;
          progressByUser[userId]++;
        });

        // 4) Calculate total completed lessons
        const totalCompletedLessons = Object.values(progressByUser).reduce(
          (acc, count) => acc + count,
          0
        );

        const averageCompletionRate =
          studentCount && lessonCount
            ? (
                (totalCompletedLessons / (studentCount * lessonCount)) *
                100
              ).toFixed(2)
            : "0.00";

        // 5) Certificates
        const certificateIssued = await Certificate.countDocuments({
          course: course._id,
        });

        console.log({
          course: course.title,
          studentCount,
          lessonCount,
          totalCompletedLessons,
          progressByUser,
        });

        return {
          courseTitle: course.title,
          totalStudents: studentCount,
          totalLessons: lessonCount,
          averageCompletionRate,
          certificateIssued,
        };
      })
    );

    res.json({ reports: courseReports });
  } catch (error) {
    console.error("Error generating instructor report: ", error);
    res.status(500).json({ error: "Error generating report" });
  }
};
