import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/Appcontext";
import Fotter from "../../components/students/Fotter";
import { Line } from "rc-progress";
import { toast } from "react-toastify";
import axios from "axios"; // ✅ Missing import added

function Enrollment() {
  const {
    isEnrolled,
    courseduration,
    navigate,
    userData,
    backendUrl,
    fetchCourses,
    getToken,
  } = useContext(AppContext);

  const [progress, setProgress] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      console.log("Token:", token);

      const tempProgressArray = await Promise.all(
        isEnrolled.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { course: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const totalLectures = course.courseContent.reduce(
            (acc, chapter) => acc + (chapter.chapterContent?.length || 0),
            0
          );
          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;
          return { totalLectures, lectureCompleted };
        })
      );
      setProgress(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ run when user has enrolled courses
  useEffect(() => {
    if (isEnrolled && isEnrolled.length > 0) {
      getCourseProgress();
    }
  }, [isEnrolled]);

  // ✅ refetch courses after login
  useEffect(() => {
    if (userData) {
      fetchCourses();
    }
  }, [userData]);

  // ✅ safety redirect for not logged in users
  useEffect(() => {
    if (!userData) {
      toast.error("Please login first");
      navigate("/my-enrollment");
    }
  }, [userData]);

  return (
    <div>
      <div className="md:px-32 px-8">
        <h1 className="text-2xl pt-15 pb-5 font-semibold">My Enrollments</h1>
        <table className="md:table-auto table-fixed w-full overflow-hidden border mt-2">
          <thead className="text-gray-900 border-b border-gray-300 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-2 py-3 font-semibold truncate">Course</th>
              <th className="px-2 py-3 font-semibold truncate">Duration</th>
              <th className="px-2 py-3 font-semibold truncate">Status</th>
              <th className="px-2 py-3 font-semibold truncate">Completed</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {isEnrolled.map((course, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                  <img
                    src={course.courseThumbnail}
                    alt=""
                    className="w-14 sm:w-24 md:w-28"
                  />
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                    <Line
                      strokeWidth={1}
                      percent={
                        progress[index] &&
                        (progress[index].lectureCompleted /
                          progress[index].totalLectures) *
                          100
                      }
                    />
                  </div>
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {courseduration(course)}
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {progress[index] &&
                    `${progress[index].lectureCompleted}/${progress[index].totalLectures}`}{" "}
                  Lectures
                </td>
                <td className="px-4 py-3 max-sm:text-right">
                  <button
                    onClick={() => navigate("/Player/" + course._id)}
                    className="bg-blue-500 cursor-pointer text-white"
                  >
                    {progress[index] &&
                    progress[index].lectureCompleted /
                      progress[index].totalLectures ===
                      1
                      ? "Completed"
                      : "On Going"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Fotter />
    </div>
  );
}

export default Enrollment;
