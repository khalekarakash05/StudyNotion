import React from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link } from 'react-router-dom';
import {NavbarLinks} from "../../data/navbar-links";
import { matchPath } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const Navbar = () => {

    const location = useLocation();

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
                            link?.title === "Catalog" ? (<div></div>)
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

        </div>
    </div>
  )
}

export default Navbar