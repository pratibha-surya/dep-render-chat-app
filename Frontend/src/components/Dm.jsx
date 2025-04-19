import React from 'react'

const Dm = () => {
    const ll = "http://localhost:4000/uploads/bebe.jpg"
  return (
<div className="w-full max-w-[940px] fixed top-0 z-10 flex justify-between items-center py-2 px-4 bg-[#F0F2F5] shadow-md">
  <div className="flex gap-[10px] items-center">
    <img
      src={ll} // Concatenate the base URL with the profile image filename
      alt="Profile"
      className="ml-[13px] rounded-[50%] w-[50px] h-[50px] object-cover"
    />
  </div>
</div>
  )
}

export default Dm
