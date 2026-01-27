import * as z from "zod";

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  
  name: z.string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Name cannot exceed 30 characters." }), 

  username: z.string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Username cannot exceed 30 characters." }), 

  bio: z.string()
    .min(3, { message: "Minimum 3 characters." })
    .max(1000, { message: "Bio cannot exceed 1000 characters." }), 
});

export const FakeUserValidation = z.object({
  id: z.string().uuid(),
  username: z.string().min(3),
  email: z.string().email(),
  message: z.string().min(5),
  role: z.enum(['admin', 'user']),
});

