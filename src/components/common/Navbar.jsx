import React, { useEffect, useState } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link } from 'react-router-dom';
import {NavbarLinks} from "../../data/navbar-links";
import { matchPath } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropdown from '../core/Auth/ProfileDropdown';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {

    const {token} = useSelector((state)=> state.auth);
    const {user} = useSelector((state)=> state.profile);
    const {totalItems} = useSelector((state)=> state.cart); 

    const location = useLocation();


    const [subLinks, setSubLinks] = useState([]);

    const fetchSubLinks = async()=>{
        try {
            const response = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("printing sublinks result", response);
            setSubLinks(response.data.data);
            
        } catch (error) {
            console.log("Could not fetch the category list");
            console.error(error);
        }
    }

    useEffect(()=>{
        fetchSubLinks();
    },[])

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname)
    }
  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between '>

        {/* image */}
        <Link to={"/"}>
            <img src={logo} alt="logo" width={160} height={42} loading='lazy'/>
        </Link>

        {/* nav list */}
        <nav>
            <ul className='flex gap-x-6 text-richblack-25'>
                {
                    NavbarLinks.map((link, index)=>(
                         <li key={index}>
                            {
                            link?.title === "Catalog" ? (
                                <div className='relative flex items-center gap-2 group'>
                                    <p>{link.title}</p>
                                    <IoIosArrowDown />

                                    <div className='invisible absolute left-[50%] top-[50%]
                                    translate-x-[-50%] translate-y-[80%]
                                    flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                    opacity-0 transition-all duration-200 group-hover:visible
                                    group-hover:opacity-100 lg:w-[300px]'>


                                    <div className='absolute left-[50%] top-0 h-6 w-6 rotate-45
                                    rounded bg-richblack-5 translate-y-[-45%] translate-x-[80%]'>

                                    </div>
                                        {
                                            subLinks.length ? (
                                               
                                                    subLinks.map((subLink, index)=>(
                                                        <Link  to={`${subLink.name}`} key={index}>
                                                            <p>{subLink.name}</p>
                                                        </Link>
                                                    ))
                                               
                                            ) : (
                                                <div></div>
                                            )
                                        }
                                    </div>

                                    
                                </div>

                            )
                            :(
                                <Link to={link?.path}>
                                    <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                        {link.title}
                                        
                                    </p>
                                </Link>
                            )
                        }
                        </li>
                    ))
                }
            </ul>
        </nav>

        {/* Login/Signup/Dashboard */}
        <div className='flex gap-x-4 items-center'>
                {
                    user && user?.accountType != "Instructor" && (
                        <Link to="/dashboard/cart" className='relative'>
                            <AiOutlineShoppingCart />
                            {
                                totalItems > 0 && (
                                    <span>
                                        {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }

                {
                    token === null && (
                        <Link to="/login" className='border border-richblack-700
                        bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Log in
                        </Link>
                    )  
                }

                {
                    token === null && (
                        <Link to="/signup" className='border border-richblack-700
                        bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Sign Up
                        </Link>
                    ) 
                }
                {
                    token !== null && (
                        <ProfileDropdown /> 
                    )
                }
        </div>

        </div>
    </div>
  )
}

export default Navbar