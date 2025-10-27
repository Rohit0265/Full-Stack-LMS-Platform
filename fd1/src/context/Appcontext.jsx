import { createContext, useEffect,useState } from 'react';
import { dummyCourses } from '../assets/assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from "humanize-duration";
import {useAuth,useUser} from "@clerk/clerk-react"

export const AppContext = createContext();

export const AppContextProvider = (props)=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();

    const {getToken} = useAuth();
    const {user}=useUser();

    //fucntion rating find karne ke liye

    const findRating = (course)=>{
        if(course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0;
    
        course.courseRatings.forEach(rating => {
                totalRating += rating.rating
            });
        return (totalRating / course.courseRatings.length);
        
    }

    //time dduraartion for lectires finding

    const chapterduration = (chapter)=> {
        let time =0;
        chapter.chapterContent.map((lecture)=>{
            time += lecture.lectureDuration;
        })
        return humanizeDuration(time * 60 * 1000 ,{units : ["h" , "m"]} )
    }

    // calaculate course duration

    
    const courseduration = (course)=> {
        let time =0;
        course.courseContent.map((chapter)=>{
            chapter.chapterContent.map((lecture)=>[
                time += lecture.lectureDuration
            ])
        })
        return humanizeDuration(time * 60 * 1000 ,{units : ["h" , "m"]} )
    }

    // calculting total no. of lectures

    const totalnoLectures = (course)=>{
            let totalLectures = 0;
            course.courseContent.forEach(chapter => {
                if(Array.isArray(chapter.chapterContent)){
                    totalLectures += chapter.chapterContent.length;
                }
            })
            return totalLectures;
    }

    const [allCourse,setAllCourse] = useState([]);
    
    const [isEducator,seIsEducator] = useState([]);

    const [isEnrolled,setIsEnrolled] = useState([]);
    

    const enrollment = async ()=>{
        setIsEnrolled(dummyCourses)
    }

    const fetchCourses = async ()=>{
         setAllCourse(dummyCourses)
    }
    useEffect(()=>{
        fetchCourses()
        enrollment()
    },[])
    const logToken = async ()=>{
        console.log(await getToken());
    }
    useEffect(()=>{
        if(user){
            logToken();
        }

    },[user]);

    const value = {
            currency,allCourse,navigate,findRating,isEducator,seIsEducator,totalnoLectures,courseduration,chapterduration,isEnrolled,enrollment
    }
    return(

        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )


}

