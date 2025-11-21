import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/Appcontext";
import { assets } from "../../assets/assets/assets";
import Footer from "../../components/students/Fotter";
import Youtube from "react-youtube";
import humanizeDuration from "humanize-duration";
import Loading from "../../components/students/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import { getCourseId } from "../../../../server/controllers/courseContoller";


function CourseDetail() {
  const { id } = useParams();
  const [coursedata, setcoursedata] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isAlreadyEnrolled, setisAlreadyEnrolled] = useState(false);
  const [arrow, setarrow] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const {
    findRating,
    totalnoLectures,
    courseduration,
    chapterduration,
    currency,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const fetchdata = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
      if (data.success) {
        setcoursedata(data.coursedata || data.course);
      } else {
        toast.error(data.message || "Failed to fetch course");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updowm = (index) => {
    setarrow((prev) => ({ ...prev, [index]: !prev[index] }));
  };
const { id: courseId } = useParams();

const EnrollCourse = async () => {
    try {
        console.log("COURSE ID:", courseId);

        const token = await getToken();
        
        const response = await axios.post(
            `${backendUrl}/api/user/purchase`,
            { courseId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("🔥 Purchase API:", response.data);

        if (response.data.success && response.data.url) {
            window.location.href = response.data.url; // stripe checkout
        } else {
            alert(response.data.message || "Something went wrong while creating checkout.");
        }

    } catch (error) {
        console.error("❌ Enrollment failed:", error.response?.data || error.message);
        alert("Payment session could not be created.");
    }
};

  useEffect(() => {
    fetchdata();
  }, [id]);

  useEffect(() => {
    if (userData && coursedata) {
      setisAlreadyEnrolled(userData.enrolledCourses.includes(coursedata._id));
    }
  }, [userData, coursedata]);

  if (isLoading) return <Loading />;

  if (!coursedata) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <h2 className="text-2xl font-semibold mb-2">Course not found</h2>
        <p>We couldn't find the course you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 px-4 md:px-10 lg:px-20">
      {/* Grid layout for responsive design */}
      <div className="flex flex-col lg:flex-row gap-10 justify-between">
        
        {/* LEFT SECTION */}
        <div className="lg:w-2/3 w-full">
          <h2 className="font-semibold text-3xl sm:text-4xl mb-3">
            {coursedata.courseTitle}
          </h2>

          <p
            className="text-gray-600 pb-5 text-sm sm:text-base"
            dangerouslySetInnerHTML={{
              __html: coursedata.courseDescription.slice(0, 200),
            }}
          ></p>

          {/* Rating & Info */}
          <div className="flex flex-wrap gap-2 items-center text-sm sm:text-base">
            <p>{findRating(coursedata)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(findRating(coursedata))
                      ? assets.star
                      : assets.star_blank
                  }
                  className="w-4 h-4"
                  alt=""
                />
              ))}
            </div>
            <p className="text-blue-500">
              ({coursedata.courseRatings?.length || 0} ratings)
            </p>
            <p className="text-gray-500">
              {coursedata.enrolledStudents?.length || 0} Students
            </p>
          </div>

          <p className="mt-3 text-gray-700">
            Course By{" "}
            <span className="text-blue-600 underline font-medium">
              {coursedata.educator?.name || "Unknown Educator"}
            </span>
          </p>

          {/* Course Structure */}
          <h2 className="text-xl sm:text-2xl mb-4 font-semibold pt-6">
            Course Structure
          </h2>

          <div className="space-y-2">
            {coursedata.courseContent?.map((chapter, index) => (
              <div
                className="border border-gray-300 bg-white rounded-lg"
                key={index}
              >
                <div
                  onClick={() => updowm(index)}
                  className="flex px-4 py-3 select-none items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        arrow[index]
                          ? assets.down_arrow_icon_rotated
                          : assets.down_arrow_icon
                      }
                      alt=""
                      className="w-4 h-4"
                    />
                    <p className="font-medium text-sm sm:text-base">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {chapter.chapterContent.length} lectures –{" "}
                    {chapterduration(chapter)}
                  </p>
                </div>

                <div
                  className={`overflow-hidden ${
                    arrow[index] ? "max-h-96" : "max-h-0"
                  } transition-all duration-300`}
                >
                  <ul className="pl-6 pr-4 py-2 border-t border-gray-200">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li
                        className="text-gray-800 py-2 text-xs sm:text-sm"
                        key={i}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <img
                              src={assets.play_icon}
                              alt=""
                              className="w-4 h-4"
                            />
                            <p className="hover:underline cursor-pointer">
                              {lecture.lectureTitle}
                            </p>
                          </div>
                          <div className="flex gap-2 items-center">
                            {lecture.isPreviewFree && (
                              <p
                                onClick={() =>
                                  setPlayer({
                                    videoId: lecture.lectureUrl.split("/").pop(),
                                  })
                                }
                                className="text-blue-600 hover:underline font-semibold cursor-pointer"
                              >
                                Preview
                              </p>
                            )}
                            <p className="font-semibold text-gray-600">
                              {humanizeDuration(
                                lecture.lectureDuration * 60 * 1000,
                                { units: ["h", "m"] }
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Course Description */}
          <div className="pt-7">
            <h1 className="font-semibold text-xl sm:text-2xl mb-2">
              Course Description
            </h1>
            <p
              className="pt-3 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: coursedata.courseDescription,
              }}
            ></p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:w-1/3 w-full shadow-xl rounded-lg overflow-hidden">
          {player ? (
            <Youtube
              videoId={player.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img
              src={coursedata.courseThumbnail}
              alt={coursedata.courseTitle}
              className="w-full h-auto object-cover"
            />
          )}

          <div className="flex gap-2 p-4 items-center">
            <img
              src={assets.time_left_clock_icon}
              alt=""
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <p className="text-red-500 text-sm sm:text-base">
              <span className="font-semibold">5 days</span> left at this price
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center px-4">
            <p className="font-bold text-2xl sm:text-3xl">
              {currency}
              {(
                coursedata.coursePrice -
                (coursedata.discount * coursedata.coursePrice) / 100
              ).toFixed(2)}
            </p>
            <p className="line-through text-gray-500 text-lg sm:text-xl">
              {currency}
              {coursedata.coursePrice}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              {coursedata.discount}% off
            </p>
          </div>

          <div className="p-4">
            <button
              onClick={EnrollCourse}
              className="bg-blue-500 hover:bg-blue-600 transition text-white w-full font-semibold text-md px-5 py-3 rounded-md"
            >
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>
          </div>

          <div className="px-6 pb-6">
            <h2 className="font-semibold mb-2 text-gray-700">
              What's in this course?
            </h2>
            <ul className="list-disc pl-6 text-sm sm:text-base text-gray-600 space-y-1">
              <li>Lifetime access with free updates</li>
              <li>Hands-on project guidance</li>
              <li>Downloadable resources</li>
              <li>Quizzes to test your knowledge</li>
              <li>Certificate of completion</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CourseDetail;
