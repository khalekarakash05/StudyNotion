import React, { useEffect } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {apiConnector} from "../../services/apiconnector"
import {contactusEndpoints} from "../../services/apis";
import countryCode from "../../data/countrycode.json";

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors , isSubmitSuccessful},
    } = useForm();

    const submitContactForm = async(data) => {
        console.log("Logging data", data);
        try {
            setLoading(true);
            const response = await apiConnector("POST", contactusEndpoints.CONTACTUS_API, data)
            console.log("logging res", response);
            setLoading(false);

        } catch (error) {
            console.log("error", error.message);
            setLoading(false);
        }
    }


    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                email: "",
                firstName: "",
                lastName: "",
                message: "",
                dropdown: "",
                phoneNumber: "",
            });
        }
    }, [isSubmitSuccessful, reset]);


  return (
    <form onSubmit={handleSubmit(submitContactForm)} action="">
        <div className='flex flex-col gap-14'>
            {/* names */}
        <div className='flex gap-5'>
            {/* first Name */}
            <div className='flex flex-col'>
                <label htmlFor='firstName'>First Name</label>
                <input type="text" 
                       name='firstName'
                       id='firstName'
                       placeholder='Enter first name'
                       {...register("firstName" ,{required:true})}
                       className='text-black' />
                {
                    errors.firstName ?
                    (<span>Please Enter your First Name</span>) : (<div></div>)
                }
            </div>

            {/* last Name */}
            <div className='flex flex-col'>
                <label htmlFor='lastName'>Last Name</label>
                <input type="text" 
                       name='lastName'
                       id='lastName'
                       placeholder='Enter Last name'
                       {...register("lastName")}
                       className='text-black' />
            </div>

        </div>

        {/* email */}
        <div className='flex flex-col'>
                <label htmlFor="email">Email Address</label>
                <input type="email"
                       name='email'
                       id='email'
                       placeholder='Enter email Address'
                       {...register("email", {required: true})}
                       className='text-black' />
                {
                    errors.email ?
                    (<span>Please Enter your Email Address</span>) : (<div></div>)
                }
            </div>

            {/* phone number */}
            <div className='flex flex-col '>
                <label htmlFor="phoneNumber">Phone Number</label>
                <div className='flex flex-row gap-5 text-black'>

                    {/* dropdown */}
                    <div className='flex flex-col gap-2 w-[50px]'>
                        <select name="dropdown" id="dropdown"
                        {...register("dropdown", {required: true})}>
                            {
                                countryCode.map((country, index)=> {
                                    return (
                                        <option key={index} value={country.code}
                                       >
                                            {country.code} - {country.country}
                                        </option>
                                    )
                                }) 
                            }
                        </select>
                    </div>

                    {/* phone number */}
                    {/* <div className='flex w-[90%] flex-col gap-2'>
                        <input type="number"
                        id='phoneNumber'
                        name='phoneNumber'
                        placeholder='12345 67890' 
                        {...register("phoneNumber", {
                            required: {value: true, message: "Phone number is required"} ,
                            maxLength: {value:10, message: "Phone number should be 10 digits"},
                            minLength: {value:10, message: "Phone number should be 10 digits"},
                        })}/>
                    </div> */}
                    <div className='flex w-[90%] flex-col gap-2'>
                            <input type="text"
                                id='phoneNumber'
                                name='phoneNumber'
                                placeholder='12345 67890'
                                {...register("phoneNumber", {
                                    required: { value: true, message: "Phone number is required" },
                                    maxLength: { value: 10, message: "Phone number should be 10 digits" },
                                    minLength: { value: 10, message: "Phone number should be 10 digits" },
                                    pattern: { value: /^[0-9]+$/, message: "Phone number should contain only digits" }
                                })} />
                    </div>
                </div>

                {
                    errors.phoneNumber ?
                    (<span>{errors.phoneNumber.message}</span>) : (<div></div>)
                }
            </div>

            {/* message */}
            <div className='flex flex-col'>
                <label htmlFor="message">Message</label>
                <textarea 
                name="message" 
                id="message"
                cols="30"
                rows="7"
                placeholder='Enter your message here'
                {...register("message", {required: true})}
                className='text-black'></textarea>
                {
                    errors.message ?
                    (<span>Please Enter your Message</span>) : (<div></div>)
                }
            </div>


            <button type='submit'
            className='text-center text-[13px] px-6 py-3 rounded-md font-bold
            bg-yellow-50 text-black hover:scale-95 duration-200 transition-all'>
                     {loading ? 'Sending...' : 'Send Message'}
            </button>
        </div>
    </form>
  )
}

export default ContactUsForm