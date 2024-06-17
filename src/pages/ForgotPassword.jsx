import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPasswordResetToken } from '../services/operations/authAPI';

const ForgotPassword = () => {

    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    // const loading = useSelector((state) => state.auth);
    const loading = useSelector((state)=> state.auth.loading)
    const dispatch = useDispatch();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent))
    }


  return (
    <div className='text-white flex items-center justify-center'>
        {
            loading ? (<div>Loading...</div> ): (<div>
                <h1>
                    {
                        !emailSent ?  "Reset your Password":"Check your Email"
                    }
                </h1>

                <p>
                    {
                        !emailSent ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery" 
                        : `We have sent the reset email to ${email}`
                    }
                </p>

                <form action="" onSubmit={handleOnSubmit}>
                    {
                        !emailSent &&(
                            <label htmlFor="">
                                <p>Email Address*</p>
                                <input type="email"
                                name='email'
                                value={email} 
                                onChange= {(e)=> setEmail(e.target.value)}
                                placeholder='Enter Your Email Address'
                                className='w-full p-6 bg-richblack-600 text-richblack-5'/>
                            </label>
                        )
                    }


                        <button type='submit'>
                            {
                                !emailSent ? "Reset Password" : "Resend Email"
                            }
                        </button>
                </form>

                <div>
                    <Link to="/login">
                            <p>
                                Back to Login
                            </p>
                    </Link>
                </div>

            </div>)
        }
    </div>
  )
}

export default ForgotPassword