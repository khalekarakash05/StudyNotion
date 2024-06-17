import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';

const MyProfile = () => {

    const user  = useSelector((state) => state.profile.user);
    console.log("user",user.additionDetails?.gender)
    const navigate = useNavigate();

  return (
    <div className='text-white'>
        <div>
            <h1>My Profile</h1>
        </div>


        {/* section 1 */}

        <div>
            <div>
                <img src={user.image} alt={`profile-${user?.firstName}`} 
                className='aspect-square w-[78px] rounded-full object-cover'
                />

                <div>
                    <p>
                        {user?.firstName + " " + user?.lastName}
                    </p>
                    <p>
                        {user?.email}
                    </p>
                </div>
            </div>

            <IconBtn
            text="Edit"
            onClick={() => navigate('/dashboard/settings')}
            ></IconBtn>
        </div>


        {/* section 2 */}

        <div>
            <div>
                <p>
                    About
                </p>
                <IconBtn
                text={"Edit"}
                onClick={() => navigate('/dashboard/settings')}
                ></IconBtn>
            </div>
            <p>{user?.additionDetails?.about ? user?.additionDetails?.about: "Write Something about Yourself"}</p>
        </div>

        {/* section 3 */}

        <div>
            <div>
                <p>
                    Personal Details
                </p>
                <IconBtn
                text={"Edit"}
                onClick={() => navigate('/dashboard/settings')}
                ></IconBtn>
            </div>

            <div>
                <div>
                    <p>
                        First Name
                    </p>
                    <p>
                        {user?.firstName}
                    </p>
                </div>

                <div>
                    <p>Email</p>
                    <p>{user?.email}</p>
                </div>

                <div>
                    <p>Gender</p>
                    <p>{user?.additionDetails?.gender ?? "Add Gender"}</p>
                </div>

                <div>
                    <p>Last Name</p>
                    <p>{user?.lastName}</p>
                </div>


                <div>
                    <p>Phone Number</p>
                    <p>{user?.additionDetails?.contactNumber ?? "Add Contact Number"}</p>
                </div>

                <div>
                    <p>Date of Birth</p>
                    <p>{user?.additionDetails?.dateOfBirth ?? "Add Date of Birth"}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MyProfile