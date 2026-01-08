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