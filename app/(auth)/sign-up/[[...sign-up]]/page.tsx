
import { SignUp } from '@clerk/nextjs'
import { dark , neobrutalism} from '@clerk/themes'


export default function Page() {
  return (
<div className="flex flex-col items-center">
<SignUp 
  appearance={{
    elements: {
      formFieldLabelAside: {
      display: 'none',
    },
      // FIX 2: Style the "Please Enter Your Credentials"
      headerTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: 'indigo',
      },

      // FIX 3: Control the Footer Layout
      footer: {
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column', // Stack children vertically
        alignItems: 'center',    // Center children horizontally
      },

      footerAction: {
        marginTop: '1rem',      // Pushes the box slightly lower
        backgroundColor: '#f1f5f9', // slate-100/200
        borderRadius: '0.5rem',
        width: 'auto',          // or '100%' if you want it full width
        display: 'flex',
        justifyContent: 'center',
      },

      // FIX 4: Correct Padding for Form Rows
      formFieldRow: {
        paddingTop: '0.5rem',
        paddingBottom: '1rem', // Changed from paddingDown
      },
    },
  }}
/>
  
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