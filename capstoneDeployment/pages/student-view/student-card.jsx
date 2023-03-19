import React, { useState } from 'react';
import Modal from 'react-modal';
import ClubPopUP from './clubPopUp';

Modal.setAppElement('#__next');

export default function StudentCard(props) {
  const [isReadMore, setIsReadMore] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);

  const handleReadMore = () => {
    setIsReadMore(!isReadMore);
  }

  const handleOpenModal = () => {
    setIsOpen(true);
  }

  const handleCloseModal = () => {
    setIsOpen(false);
  }

  return (
    <div className="rounded-lg overflow-hidden my-4 mx-2 bg-white text-slate-800 flex flex-col hover:bg-slate-300 shadow-lg grow w-1/5">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="bg-white w-3/4 h-3/4 mx-auto my-auto rounded-lg shadow-lg flex items-center justify-center opacity-100"
        overlayClassName="fixed inset-0 flex justify-center items-center"
        portalClassName="opacity-100 bg-black"
      >
        <div className="w-full h-full flex flex-col items-center justify-center opacity-100">
          <ClubPopUP clubName={props.data.name} clubId = {props.data._id} />
          <button className='text-slate-800 my-2 w-full bg-slate-200 rounded-md' onClick={handleCloseModal}>Close</button>
        </div>
      </Modal>
      <h1 onClick={handleOpenModal} className="px-2 text-2xl font-bold text-center self-center cursor-pointer">
        {props.data.name}
      </h1>
      <h2 className="px-2 text-sm text-gray-900 italic self-center">
        {props.data.department}
      </h2>
      <div className="px-2 py-1 mb-3 flex-col flex">
        <div className={`text-sm text-center ${isReadMore && 'line-clamp-3'}`}>
          {props.data.description}
        </div>
        <button onClick={handleReadMore} className="bg-none rounded text-sm font-bold self-center">
          {isReadMore ? 'Read More...' : 'Read Less...'}
        </button>
      </div>
    </div>
  );
}
