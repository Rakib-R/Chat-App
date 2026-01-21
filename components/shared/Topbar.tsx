import Link from 'next/link'
import Image from 'next/image'
import React from 'react'


const Topbar = () => { 

  const isUserLoggedIn = true;
  
  return (
      <nav className=' h-24 text-xl'>
      <Link href='/' className='flex items-center h-full gap-4'>
        <Image src='/logo.svg' alt='logo' width={28} height={28} />
        <p className='text-heading3-bold text-light-1 max-xs:hidden'> ChatApp (topbar)</p>
      </Link>
    </nav>
  )
}

export default Topbar