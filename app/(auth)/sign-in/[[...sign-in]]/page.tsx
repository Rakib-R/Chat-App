import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <SignIn 
  appearance={{
    elements: {
      socialButtonsBlockButton: {
        // 1. Make the background solid black
       backgroundColor: 'black !important',
        backgroundImage: 'none !important',
        // 2. Add the white border
        border: '1px solid white !important',
        '&:hover': {
          backgroundColor: '#111111 !important', // Slightly lighter black on hover
        }
      },
      socialButtonsBlockButton__google: {
        backgroundColor: 'black !important',
      },
      socialButtonsBlockButton__github: {
        backgroundColor: 'black !important',
      },
      socialButtonsProviderIcon: {
        // 3. This flips the icon colors: 
        // brightness(0) makes it black, invert(1) makes it white.
        filter: 'brightness(1) invert(0) !important',
      },
     
    }
  }}
/>
  )
}