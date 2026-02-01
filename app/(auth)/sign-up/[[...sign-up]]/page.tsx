

// "use client";
// import { SignUp } from "@clerk/nextjs";
// import { usePathname } from "next/navigation";

// export default function Page() {
  
//   const pathname = usePathname(); 
//   const isSignUpPath = pathname.startsWith("/sign-up")
  
//   return (
// <div className="flex flex-col items-center">

// {isSignUpPath && (
// <SignUp 
//   appearance={{
//     elements: {

//     rootBox: {
//     display: 'flex',
//     alignContent : 'center',
//     height: '45rem',
//     // This targets the outermost container
//   },
//     card: {
//       '&':{  // ' & ' Using This changed my Life !
//       height: '100%',
//       display: 'flex',
//       flexDirection: 'column',
//       }
//     },
//   footer:{
//         '&': {
//         display: 'flex',
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//         height: '6rem',
//          }
//       },
//         // FIELD ERROR SHOW
//       formFieldInput: {
//         '&:not(:placeholder-shown):invalid': {
//           borderColor: '#ef4444', // Red border immediately on bad email
//           color: '#ef4444',
//         },
//         '&:focus': {
//           borderColor: '#3b82f6', // Indigo on focus
//         }
//       },
//       formFieldLabelAside: {
//         '&': {
//         // Not Working
//         }
//       },
//       // FIX 2: Style the "Please Enter Your Credentials"
//       headerTitle: "brand-title-signUp",

//       // This hides the 'Powered by Clerk' branding which adds height
//       footerActionText: {
//         fontSize: "0.8rem",
//       },

//       footerAction: {
//         marginTop: '1rem',      // Pushes the box slightly lower
//         backgroundColor: '#f1f5f9', // slate-100/200
//         borderRadius: '0.5rem',
//         width: 'auto',          // or '100%' if you want it full width
//         display: 'flex',
//         justifyContent: 'center',
//       },
//       // SIGN-IN
//        footerActionLink: {
//         color: "#3b82f6",
//         fontWeight: "bold",
//         fontSize : '1rem'
//       },
//       // FIX 4: Correct Padding for Form Rows
//       formFieldRow: {
//         paddingTop: '1rem',
//         paddingBottom: '.5rem', // Changed from paddingDown
//       },
//     },
//   }}
// />
//   )} 
//   {/* Custom Footer Below the Component */}
//   <footer className="mt-6 text-center text-sm text-gray-300">
//     <p>
//       By signing up, you agree to our{" "}
//       <a href="/terms" className="underline hover:text-gray-800">Terms of Service</a>{" "}
//       and{" "}
//       <a href="/privacy" className="underline hover:text-gray-800">Privacy Policy</a>.
//     </p>
//     <p className="mt-2">© 2026 YourBrand Inc.</p>
//   </footer>

// </div>
//   )
// }
"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Check } from "lucide-react";

import { 
  PasswordStrengthMeter, 
  getPasswordStrength, 
  isValidEmail, 
  EmailStatusIndicator 
} from "@/lib/password_strength";
import { checkEmailAvailability } from "@/lib/actions/user.actions";

export default function SignUpPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const [emailTaken, setEmailTaken] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [email, setEmail] = useState("");

  const strength = getPasswordStrength(password);
  const passwordsMatch = password && password === confirmPassword;

  const [emailCheckTimeout, setEmailCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleEmailChange = (emailValue: string) => {
    setEmail(emailValue);
    setEmailTaken(null);
    setError("");

    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }

    if (isValidEmail(emailValue)) {
      const timeout = setTimeout(async () => {
        setIsCheckingEmail(true);
        try {
          const { isTaken } = await checkEmailAvailability({ email: emailValue });
          setEmailTaken(isTaken);
          if (isTaken) {
            setError("This email is already registered");
          }
        } catch (err) {
          console.error("Email check failed:", err);
        } finally {
          setIsCheckingEmail(false);
        }
      }, 500);

      setEmailCheckTimeout(timeout);
    }
  };

  const validateBeforeSubmit = () => {
    if (!passwordsMatch) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setError("Passwords do not match");
      return false;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (emailTaken) {
      setError("This email is already registered");
      return false;
    }

    if (strength === "weak") {
      setError("Please choose a stronger password");
      return false;
    }

    setError("");
    return true;
  };

  const disableSubmit =
    isCheckingEmail ||
    !isValidEmail(email) ||
    !passwordsMatch ||
    strength === "weak" ||
    emailTaken === true ||
    !email ||
    !password ||
    !confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SignUp.Root>
        <SignUp.Step name="start">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* EMAIL */}
              <Clerk.Field name="emailAddress">
                <Clerk.Label asChild>
                  <Label>Email</Label>
                </Clerk.Label>

                <Clerk.Input asChild>
                  <Input
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    autoComplete="email"
                  />
                </Clerk.Input>

                <EmailStatusIndicator
                  isValid={isValidEmail(email)}
                  isChecking={isCheckingEmail}
                  isTaken={emailTaken}
                  error={error}
                />

                <Clerk.FieldError className="text-sm text-destructive mt-1" />
              </Clerk.Field>

              {/* PASSWORD */}
              <Clerk.Field name="password">
                <Clerk.Label asChild>
                  <Label>Password</Label>
                </Clerk.Label>

                <div className="relative">
                  <motion.div
                    animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Clerk.Input asChild>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        autoComplete="new-password"
                      />
                    </Clerk.Input>
                  </motion.div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Clerk.FieldError className="text-sm text-destructive mt-1" />
              </Clerk.Field>

              {/* PASSWORD STRENGTH */}
              {password && <PasswordStrengthMeter password={password} />}

              {/* CONFIRM PASSWORD */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>

                <div className="relative">
                  <motion.div
                    animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                      autoComplete="new-password"
                    />
                  </motion.div>

                  {confirmPassword && passwordsMatch && (
                    <Check 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" 
                      size={18} 
                    />
                  )}
                </div>

                {confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-destructive">
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* CAPTCHA - Use SignUp.Captcha instead of Clerk.Captcha */}
              <SignUp.Captcha className="empty:hidden" />

              {/* ERROR MESSAGE */}
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <SignUp.Action
                submit
                asChild
              >
                <Button 
                  className="w-full" 
                  disabled={disableSubmit}
                  onClick={(e) => {
                    if (!validateBeforeSubmit()) {
                      e.preventDefault();
                    }
                  }}
                >
                  {isCheckingEmail ? "Checking email..." : "Create account"}
                </Button>
              </SignUp.Action>

              {/* SIGN IN LINK */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/sign-in" className="text-primary hover:underline font-medium">
                  Sign in
                </a>
              </p>
            </CardContent>
          </Card>
        </SignUp.Step>

        {/* VERIFICATION STEP */}
        <SignUp.Step name="verifications">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Verify your email</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                We sent a verification code to <strong>{email}</strong>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <SignUp.Strategy name="email_code">
                <Clerk.Field name="code">
                  <Clerk.Label asChild>
                    <Label>Verification Code</Label>
                  </Clerk.Label>
                  <Clerk.Input asChild>
                    <Input 
                      placeholder="Enter 6-digit code" 
                      className="text-center text-lg tracking-widest"
                    />
                  </Clerk.Input>
                  <Clerk.FieldError className="text-sm text-destructive mt-1" />
                </Clerk.Field>
                
                <SignUp.Action submit asChild>
                  <Button className="w-full mt-4">Verify Email</Button>
                </SignUp.Action>

                <SignUp.Action 
                  resend 
                  asChild
                  fallback={({ resendableAfter }) => (
                    <Button variant="ghost" className="w-full mt-2" disabled>
                      Resend code in {resendableAfter}s
                    </Button>
                  )}
                >
                  <Button variant="ghost" className="w-full mt-2">
                    Resend code
                  </Button>
                </SignUp.Action>
              </SignUp.Strategy>
            </CardContent>
          </Card>
        </SignUp.Step>

        {/* CONTINUE STEP */}
        <SignUp.Step name="continue">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Complete your profile</CardTitle>
            </CardHeader>
            <CardContent>
              <SignUp.Action submit asChild>
                <Button className="w-full">Continue</Button>
              </SignUp.Action>
            </CardContent>
          </Card>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  );
}