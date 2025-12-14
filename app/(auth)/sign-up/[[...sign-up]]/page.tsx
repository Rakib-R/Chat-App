
import { SignUp } from '@clerk/nextjs'
import { dark , neobrutalism} from '@clerk/themes'


export default function Page() {
  return (
  <div className='bg-black'> 

  <SignUp
      appearance={{
        baseTheme: neobrutalism,
      }}
  />
  
  </div>)
}