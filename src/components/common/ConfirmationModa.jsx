import React from 'react'
import IconBtn from './IconBtn'

const ConfirmationModa = ({modalData}) => {
    console.log("modalData", modalData)
  return (
    <div>
        <div>
            <p>
                {
                    modalData?.text1
                }
            </p>
            <p>
                {modalData?.text2}
            </p>

            <div className='flex gap-x-3'>
                <IconBtn
                   onClick={modalData?.btn1Handler}
                     text={modalData?.btn1Text}
                >
                </IconBtn>

                <button onClick={modalData?.btn2Handler}>
                    {modalData?.btn2Text}
                </button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmationModa