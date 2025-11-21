import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const [error, setError] = useState(null);
  const [allCourse, setAllCourse] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState([]);
  const [userData, setuserData] = useState(null);

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  /* 🧮 FIND RATING */
  const findRating = (course) => {
    if (!course || !Array.isArray(course.courseRatings) || course.courseRatings.length === 0) {
      return 0;
    }
    const totalRating = course.courseRatings.reduce(
      (sum, rating) => sum + (rating?.rating || 0),
      0
    );
    return Math.floor(totalRating / course.courseRatings.length);
  };

  /* 🕒 CHAPTER DURATION */
  const chapterduration = (chapter) => {
    let time = 0;
    chapter.chapterContent?.forEach((lecture) => {
      time += lecture.lectureDuration || 0;
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  /* ⏱️ COURSE DURATION */
  const courseduration = (course) => {
    let time = 0;
    course.courseContent?.forEach((chapter) => {
      chapter.chapterContent?.forEach((lecture) => {
        time += lecture.lectureDuration || 0;
      });
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  /* 📚 TOTAL LECTURES */
  const totalnoLectures = (course) => {
    let totalLectures = 0;
    course.courseContent?.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  /* 🧾 FETCH ENROLLMENTS */
  const enrollment = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/enrolled-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsEnrolled(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message || "Failed to fetch enrollments");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* 👤 FETCH USER DATA */
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setuserData(res.data.user); // ✅ Correct setter
      } else {
        setError(res.data.message || "Failed to fetch user data");
      }
    } catch (err) {
      console.error("User fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch user data");
    }
  };

  /* 🔐 LOAD USER FROM CLERK */
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchUserData();
      enrollment();
    } else {
      setuserData(null);
      setIsEnrolled([]);
    }
  }, [isLoaded, isSignedIn]);

  /* 🎓 FETCH COURSES */
  const fetchCourses = async () => {
    try {
      const url = `${backendUrl}/api/course/all`;
      const response = await axios.get(url, { timeout: 10000 });
      const data = response?.data;

      if (data?.success) {
        const courses = data.course || data.courses || [];
        setAllCourse(courses);
      } else {
        toast.error(data?.message || "Failed to fetch courses");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unexpected error while fetching courses";
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* 🌍 CONTEXT VALUE */
  const value = {
    currency,
    allCourse,
    navigate,
    findRating,
    isEducator,
    setIsEducator,
    totalnoLectures,
    courseduration,
    chapterduration,
    isEnrolled,
    enrollment,
    backendUrl,
    userData,
    setuserData,
    getToken,
    fetchCourses,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
