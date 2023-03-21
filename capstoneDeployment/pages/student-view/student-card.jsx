import React, { useState } from 'react'
import Modal from 'react-modal'
import ClubPopUP from './clubPopUp'
import LikeButton from './student-like-button'

Modal.setAppElement('#__next')

export default function StudentCard({ data, index }) {
  const [isReadMore, setIsReadMore] = useState(true)
  const [modalIsOpen, setIsOpen] = useState(false)

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
        className="bg-white w-4/5 h-4/5 mx-auto my-auto rounded-lg shadow-lg flex items-center justify-center opacity-100"
        overlayClassName="fixed inset-0 flex justify-center items-center"
        portalClassName="opacity-100 bg-black"
      >
        <div className="w-full h-full flex flex-col items-center justify-center opacity-100 shadow-xl rounded-lg ">
          <ClubPopUP clubName={data.name} clubId={data._id} />
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
          <div>
            <h1 className="px-2 text-2xl font-bold cursor-pointer">
              {data.name}
            </h1>
            {data.department ? (
              <div className="py-1 mx-2 mt-1 text-sm text-gray-900 bg-slate-100 rounded-xl font-semibold w-24 text-center">
                {data.department}
              </div>
            ) : null}
          </div>
          <LikeButton name={data.name}></LikeButton>
        </div>

        <div className="px-2 pt-2 mb-3 flex-col flex h-full text-slate-500">
          <div className={`text-sm ${isReadMore && 'line-clamp-3'}`}>
            {data.description}
          </div>
          <button
            onClick={handleReadMore}
            className="bg-none rounded text-sm font-bold hover:text-slate-800 text-left pt-1"
          >
            {isReadMore ? 'Read More...' : 'Read Less...'}
          </button>
        </div>
      </div>
    </div>
  )
}
