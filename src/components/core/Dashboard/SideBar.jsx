import React from 'react'
// import { sidebarLinks} from "../../../data/dashboard-links";
import {sidebarLinks} from "../../../data/dashboard-links"
// import  {logout} from "../../../services/operations/authAPI"
import { useSelector } from 'react-redux';
import SideBarLink from './SideBarLink';
import { useDispatch  } from 'react-redux';
import { VscSignOut } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ConformationModal from "../../common/ConfirmationModa"
import { logout } from '../../../services/operations/authAPI';

const SideBar = ({modalData}) => {
    const {user, loading: profileLoading} = useSelector((state) => state.profile);
    const {loading: authLoading} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [confrimationModal, setConfirmationModal] = useState(null);
    const navigate = useNavigate();


    if(profileLoading || authLoading){
        return (
            <div className='mt-10'>
                Loading...
            </div>
        )
    }

  return (
    <div>
        <div className='flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700
        h-[calc[100vh-3.5rem]] bg-richblack-800 py-10'>

          <div className='flex flex-col'>
              {
                sidebarLinks.map((link) => {
                  if(link.type && user?.accountType !== link.type){
                    return null;
                  }

                  return (
                    <SideBarLink 
                      key={link.id} 
                      link={link}
                      iconName={link.icon}
                    ></SideBarLink>
                  )
                })
              }
          </div>


          <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600
          '>

            <div className='flex flex-col'></div>
                <SideBarLink
                link={{name:"Settings", path:"/dashboard/settings"}}
                iconName="VscSettingsGear"
                >

                </SideBarLink>

                <button
                onClick={()=> setConfirmationModal({
                    text1:"Are you sure ?",
                    text2: "You will be logged out",
                    btn1Text: "Logout",
                    btn2Text: "Cancel",
                    btn1Handler: () => dispatch(logout(navigate)),
                  
                    btn2Handler: () => setConfirmationModal(null)
                })}
                className='text-sm font-medium text-richblack-300'
                >

                  <div className='flex items-center gap-x-2'>
                      <VscSignOut className='text-lg'></VscSignOut>
                      <span>Logout</span>
                  </div>

                </button>
          </div>

        </div>

        {confrimationModal && ( 
            <ConformationModal modalData={confrimationModal}></ConformationModal>
        )}
    </div>
  )
}

export default SideBar