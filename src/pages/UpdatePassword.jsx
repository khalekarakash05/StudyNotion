import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI';
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { Link } from 'react-router-dom';


const UpdatePassword = () => {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const dispatch = useDispatch();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    const {loading} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const {password, confirmPassword} = formData;

    const handleOnChange = (e) =>{
        e.preventDefault();
        setFormData((prev) => ({
            ...prev,
            [e.target.name] : e.target.value,
        }))
    }

    const handleOnSubmit = (e) =>{
        e.preventDefault();
        const token = location.pathname.split("/")[2];
        dispatch(resetPassword(password, confirmPassword, token, navigate));
    }


  return (
    <div className='text-white'>
        {
            loading? (
                <div>Loading...</div>
            ):(
                <div>
                    <h1>Choose  new password</h1>
                    <p>Almost done. Enter your new password and youre all set.</p>

                    <form action="" onSubmit={handleOnSubmit}>
                        <label htmlFor="">
                        <p>New password*</p>
                        <input type={showPassword ? "text" : "password"}
                        required
                        name='password'
                        value={password}
                        onChange={handleOnChange}
                        placeholder='Password'
                        className='w-full p-6 bg-richblack-600 text-richblack-5'
                         />
                         <span
                         onClick={()=> setShowPassword((prev)=>!prev)}
                         >
                            {
                                showPassword ? 
                                <AiFillEyeInvisible  fontSize={24}/> : 
                                <AiFillEye  fontSize={24}/>
                            }
                         </span>
                        </label>
                        
                        <label htmlFor="">
                        <p>Confirm new password*</p>
                        <input type={showConfirmPassword ? "text" : "password"}
                        required
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={handleOnChange}
                        placeholder='Confirm Password'
                        className='w-full p-6 bg-richblack-600 text-richblack-5'
                         />
                         <span
                         onClick={()=> setShowConfirmPassword((prev)=>!prev)}
                         >
                            {
                                setShowConfirmPassword ? 
                                <AiFillEyeInvisible  fontSize={24}/> : 
                                <AiFillEye  fontSize={24}/>
                            }
                         </span>
                        </label>


                        <button type='submit'>
                            Reset Password
                        </button>

                        <div>
                            <Link to="/login">
                                <p>Back to Login</p>
                            </Link>
                        </div>
                    </form>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword