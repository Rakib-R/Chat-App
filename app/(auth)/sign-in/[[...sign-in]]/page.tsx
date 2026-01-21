"use client";
import { SignIn, SignUp } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function Page() {

  const pathname = usePathname();
  const isSignInPath = pathname.startsWith("/sign-in");

  return (
    <div> 
  {isSignInPath && (
  <SignIn
  appearance={{
    elements: {
      // GO TO GLOBAL.CSS
      headerTitle: "brand-title-signIn",
      // Targets the very bottom container

      rootBox: {
        display: 'flex',
        alignContent : 'center',
        height: '35rem',
        // This targets the outermost container
      },

      card: {
        '&': {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
        marginTop : '-1rem'
        }
     
      },
      footer:{
        '&': {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '8rem',
         }
      },
      
      // Targets the "Don't have an account? Sign up" area
      footerAction : {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
      },

      // Targets the "Sign up" link specifically
      footerActionLink: {
        color: "#3b82f6",
        // fontSize: "1.2rem",
        fontWeight: "bold",
        fontSize : '1rem'
      },
        formFieldRow: {
        paddingTop: '1rem',
        paddingBottom: '.5rem', // Changed from paddingDown
      },
      // Hides the "Powered by Clerk" to save space
      footerActionText: {
        fontSize: "0.8rem",
      }
    }
  }}
/> )}
</div>
  )
}


// "use client";

// import * as Clerk from "@clerk/elements/common";
// import * as SignUp from "@clerk/elements/sign-up";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function SignUpPage() {
//   return (
//     <SignUp.Root>
//       <SignUp.Step name="start">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>Create an Account</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Clerk.Field name="emailAddress">
//               <Clerk.Label asChild><Label>Email</Label></Clerk.Label>
//               <Clerk.Input asChild><Input /></Clerk.Input>
//               <Clerk.FieldError className="text-destructive text-sm" />
//             </Clerk.Field>

//             <SignUp.Action submit asChild>
//               <Button className="w-full">Sign Up</Button>
//             </SignUp.Action>
//           </CardContent>
//         </Card>
//       </SignUp.Step>
//     </SignUp.Root>
//   );
// }