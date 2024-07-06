import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import IconBtn from '../../common/IconBtn';
// import { setCourse } from '../../../slices/courseSlice';
import { useState } from 'react';
import CoursesTable from './InstructorCourses/CoursesTable';
import {VscAdd} from 'react-icons/vsc'

const MyCourses = () => {
    const {token} = useSelector((state)=> state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const result = await fetchInstructorCourses(token);
            if(result){
                    setCourses(result);
            }
        }
        fetchCourses();
    }, [])
    

  return (
    <div className = "text-white">
        <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
            <IconBtn text="Add Course"
            onClick={()=>navigate("/dashboard/add-course")}
            >
                <VscAdd />
            </IconBtn>
        </div>
        {courses && <CoursesTable courses = {courses} setCourses = {setCourses}></CoursesTable>}
    </div>
  )
}

export default MyCourses