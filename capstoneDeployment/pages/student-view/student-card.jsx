import React, { useState } from 'react'
import Modal from 'react-modal'
import ClubPopUP from './clubPopUp'
import { FaHeart } from "react-icons/fa";

Modal.setAppElement('#__next')

export default function StudentCard(props) {
  const [isReadMore, setIsReadMore] = useState(true)
  const [modalIsOpen, setIsOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(
    //State to track if user has liked the image
    localStorage.getItem(String(props.data.name)) === "true" //sets the localStorage key to the index of the image
  );

  React.useEffect(() => {
    //retrieve saved likes from local storage when a page reloads
    localStorage.setItem(String(props.data.name), isLiked);
  }, [isLiked]);

  const handleLike = (event) => {
    //sets isLiked to the opposite of the current isLiked

    event.stopPropagation()
    setIsLiked(!isLiked);
  };

  const handleReadMore = (event) => {
    event.stopPropagation()
    setIsReadMore(!isReadMore)
  }

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  return (
    <div className="rounded-lg bg-white overflow-hidden m-2 text-slate-800 flex flex-col shadow-md hover:shadow-lg grow hover:animate-wiggle border border-gray-300 hover:border-gray-400">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="bg-white w-4/5 h-4/5 mx-auto my-auto rounded-lg shadow-xl flex items-center justify-center opacity-100"
        overlayClassName="fixed inset-0 flex justify-center items-center"
        portalClassName="opacity-100 bg-black"
      >
        <div className="w-full h-full flex flex-col items-center justify-center opacity-100 shadow-xl rounded-lg">
          <ClubPopUP clubName={props.data.name} clubId={props.data._id} />
          <button
            className="text-slate-800 py-2 w-full bg-white rounded-md font-bold hover:bg-slate-200"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
      </Modal>
      <div
        onClick={handleOpenModal}
        className="cursor-pointer h-full flex flex-col"
      >
        <div className='flex justify-between'>
          <div className='flex pl-4 pt-4'>
            <img
              className="h-14 w-14 rounded-full self-center"
              src={props.data.logoURL}
            ></img>
            <div>
              <h1 className="px-2 text-2xl font-bold cursor-pointer">
                {props.data.name}
              </h1>
              {props.data.department ? (
                <div className="py-1 mx-2 text-sm text-gray-900 rounded-xl font-semibold w-auto text-left">
                  {props.data.department}
                </div>
              ) : null}
            </div>
          </div>
          {!props.viewOnlyLiked
            ?
            (<div>
              {/* if state isLiked is true than the like button will fill red*/}
              <button
                onClick={handleLike}
                className={` flex sm:opacity-0 lg:opacity-100 justify-center p-2 mr-4 mt-4 text-black hover:text-red-400 ${isLiked && "text-red-600 text-4xl"
                  } bg-none`}
              >
                <FaHeart className="text-2xl" />
              </button>
            </div>) : null}
        </div>
        <div className="pr-6 pl-6 pt-2 pb-1 mb-3 flex-col flex h-full text-slate-500">
          <div className={`text-sm ${isReadMore && 'line-clamp-2'} ${props.viewOnlyLiked && 'line-clamp-none'}`}>
            {props.data.description}
          </div>
          {props.viewOnlyLiked ? null : <button
            onClick={handleReadMore}
            className="bg-none rounded text-sm font-bold hover:text-slate-800 text-left pt-1"
          >
            {isReadMore ? 'Read More...' : 'Read Less...'}
          </button>}

        </div>
      </div>
    </div>
  )
}
