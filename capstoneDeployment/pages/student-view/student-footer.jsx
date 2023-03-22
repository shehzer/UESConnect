import React from 'react'
import Link from 'next/link'

const StudentFooter = () => {
  return (
    <footer className="bg-white w-full absolute bottom-0 left-0 h-12 flex justify-center text-slate-700 text-md">
      <div className='w-4/5 flex justify-between '>
        <div className="flex items-center font-bold">
          <p className="mr-1 font-bold">Built by:</p>
          <Link href="https://github.com/bagshawc1" className='mr-1 hover:text-slate-500'>
            Cole Bagshaw,
          </Link>
          <Link href="https://github.com/desposto" className='mr-1 hover:text-slate-500'>
            David Esposto,
          </Link>
          <Link href="https://github.com/gsimon321" className='mr-1 hover:text-slate-500'>
            Gabor Simon,
          </Link>
          <Link href="https://github.com/jsing287" className='mr-1 hover:text-slate-500'>
            Jasdeep Singh,
          </Link>
          <Link href="https://github.com/shehzer" className='mr-1 hover:text-slate-500'>
            Shehzer Naumani
          </Link>
        </div>
        <div className='flex items-center font-bold ml-2'>
          @2023
        </div>
      </div>
    </footer>
  )
}

export default StudentFooter
