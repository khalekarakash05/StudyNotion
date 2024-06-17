import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OtpInput from 'react-otp-input';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from '../services/operations/authAPI';
import { signUp } from '../services/operations/authAPI';

const VerifyEmail = () => {
//    const {loading} = useSelector((state)=> state.auth.loading);
//    const {signupData} = useSelector((state)=> state.auth.signupData);
    const {loading, signupData} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
   const [otp, setOtp] = useState('');
   const navigate = useNavigate();

   useEffect(() => {
        if(!signupData){
            navigate('/signup')
        }
   },[signupData, navigate])

   const onSubmitHandler = (e) => {

        console.log("signupData", signupData);
         e.preventDefault();
         const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            
         } = signupData;

         dispatch(signUp(accountType, firstName, lastName, email, password,
            confirmPassword, otp, navigate));
         
    }

  return (
    <div className='text-white flex items-center justify-center mt-[150px]' >
        {
            loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h1>Verify Email</h1>
                    <p>A verification code has been sent to you. Enter the code below</p>


                    <form action="" onSubmit={onSubmitHandler}>
                        <OtpInput
                        value={otp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        onChange={setOtp}
                        renderInput={(props) => <input {...props} 
                        className ="bg-richblack-800 text-white"/>}
                        
                        />

                        <button type='submit'>
                            Verify Email
                        </button>
                    </form>

                    <div>
                        <div>
                            <Link to={"/login"}>
                                <p>Back to Login</p>
                            </Link>
                        </div>

                        <button 
                        onClick={() => dispatch(sendOtp(signupData.email, navigate))}>
                            Resend it
                        </button>
                    </div>
                
                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail