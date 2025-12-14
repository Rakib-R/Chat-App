// "use client";
// import { experimental } from './experimental'
// import { useRef } from 'react';


// const page = () => {

//     const formRef = useRef<any>('');

//   return (
//     <form action={experimental} className="flex flex-col gap-4">
//       <label>
//         <span>Upload a file</span>
//         <input type="file" name="file" ref={formRef} />
//       </label>
//       <button type="submit">Submit</button>
//     </form>
//   )
// }

// export default page

"use client";
import { useRef } from "react";


export default function UploadForm() {
  const fileInput = useRef<HTMLInputElement>(null);

  async function uploadFile(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    evt.preventDefault();
    console.log('Wayyy Earlier ERROR OR SUCCESSS ', 'REF -> ', fileInput);

    const formData = new FormData();
    formData.append("file", fileInput?.current?.files?.[0]!);

    console.log('Earlier ERROR OR SUCCESSS ',formData ,  'REF -> ', fileInput);

    const response = await fetch("../api/uploadImage", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    console.log('LATER ERROR OR SUCCESSS', result);
  }

  return (
    <form className="flex flex-col gap-4">
      <label>
        <span>Upload a file</span>
        <input type="file" name="file" ref={fileInput} />
      </label>
      <button type="submit" onClick={uploadFile}>
        Submit
      </button>
    </form>
  );
}