// "use server";

// import fs from "node:fs/promises";
// import { revalidatePath } from "next/cache";
// import Image from "next/image";


// export async function experimental (formData: FormData) {

// const file = formData.get("file") as File;
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = new Uint8Array(arrayBuffer);

//   await fs.writeFile(`./public/uploads/${file.name}`, buffer);

//   revalidatePath("/");


// }


