// app/api/upload/route.ts
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Read file into a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Example: log file info
    console.log('Received file:', file.name, file.type, file.size);

    // Optionally: Save to disk (Node.js only)
    // import { writeFile } from 'fs/promises';
    // await writeFile(`/tmp/${file.name}`, buffer);

    return NextResponse.json({ success: true, filename: file.name , message: 'JUST FOR FUNSY"s ' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
