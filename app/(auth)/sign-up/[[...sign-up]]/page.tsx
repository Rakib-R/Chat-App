

"use client";
import { SignIn, SignUp } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function Page() {
  
  const pathname = usePathname(); 
  const isSignUpPath = pathname.startsWith("/sign-up")
  
  return (
<div className="flex flex-col items-center">

{isSignUpPath && (
<SignUp 
  appearance={{
    elements: {

    rootBox: {
    display: 'flex',
    alignContent : 'center',
    height: '45rem',
    // This targets the outermost container
  },
    card: {
      '&':{  // ' & ' Using This changed my Life !
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      }
    },
  footer:{
        '&': {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '6rem',
         }
      },
      formFieldLabelAside: {
        '&': {
        // Not Working
        }
      },
      // FIX 2: Style the "Please Enter Your Credentials"
      headerTitle: "brand-title-signUp",

      // This hides the 'Powered by Clerk' branding which adds height
      footerActionText: {
        fontSize: "0.8rem",
      },

      footerAction: {
        marginTop: '1rem',      // Pushes the box slightly lower
        backgroundColor: '#f1f5f9', // slate-100/200
        borderRadius: '0.5rem',
        width: 'auto',          // or '100%' if you want it full width
        display: 'flex',
        justifyContent: 'center',
      },
      // SIGN-IN
       footerActionLink: {
        color: "#3b82f6",
        fontWeight: "bold",
        fontSize : '1rem'
      },
      // FIX 4: Correct Padding for Form Rows
      formFieldRow: {
        paddingTop: '1rem',
        paddingBottom: '.5rem', // Changed from paddingDown
      },
    },
  }}
/>
  )} 
  {/* Custom Footer Below the Component */}
  <footer className="mt-6 text-center text-sm text-gray-300">
    <p>
      By signing up, you agree to our{" "}
      <a href="/terms" className="underline hover:text-gray-800">Terms of Service</a>{" "}
      and{" "}
      <a href="/privacy" className="underline hover:text-gray-800">Privacy Policy</a>.
    </p>
    <p className="mt-2">© 2026 YourBrand Inc.</p>
  </footer>


</div>
  )
}