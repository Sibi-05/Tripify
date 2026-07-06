import React from 'react'

const ProfileImage = ({image,className}) => {
  return (
    <div className={`flex profileImage ${className}`} alt="">
      <img src={image} className='w-10 h-10 object-cover  rounded-full'/>
    </div>
  )
}

export default ProfileImage
