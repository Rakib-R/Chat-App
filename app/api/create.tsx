import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { io, Socket } from 'socket.io-client';
import type Peer from 'peerjs'; 
import type { MediaConnection } from 'peerjs';

export default function Room() {
  const router = useRouter();
  const { id: roomId } = router.query;

  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  
  // Refs
  const videoGridRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  
  // Corrected type: This stores connections (calls), not the Peer instance itself
  const peersRef = useRef<Record<string, MediaConnection>>({}); 

  useEffect(() => {
    if (!roomId) return;

    const init = async () => {
      // Dynamic import 
      const PeerClass = (await import('peerjs')).default;
      
      socketRef.current = io();

      // Fix: Cast undefined to string to satisfy TypeScript
      peerRef.current = new PeerClass(undefined as unknown as string, {
        path: '/peerjs', 
        host: '/',
        port: 3000
      });

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        setMyStream(stream);
        
        // Strict null check for videoGridRef
        const myVideo = document.createElement('video');
        addVideoStream(myVideo, stream, true);

        // Answer incoming calls
        peerRef.current?.on('call', (call: MediaConnection) => {
            call.answer(stream);
            const video = document.createElement('video');
            call.on('stream', (userVideoStream: MediaStream) => {
                addVideoStream(video, userVideoStream);
            });
        });

        // Listen for socket events
        socketRef.current?.on('user-connected', (userId: string) => {
            connectToNewUser(userId, stream);
        });

      } catch (err) {
        console.error("Failed to get local stream", err);
      }

      // Join room on Peer open
      peerRef.current?.on('open', (id: string) => {
        // Handle string | string[] type for roomId
        const room = Array.isArray(roomId) ? roomId[0] : roomId;
        socketRef.current?.emit('join-room', room, id);
      });
    };

    init();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (peerRef.current) peerRef.current.destroy();
      
      // Stop all tracks to turn off camera light
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId]);

  function connectToNewUser(userId: string, stream: MediaStream) {
    if (!peerRef.current) return;

    const call = peerRef.current.call(userId, stream);
    const video = document.createElement('video');
    
    call.on('stream', (userVideoStream: MediaStream) => {
      addVideoStream(video, userVideoStream);
    });

    call.on('close', () => {
      video.remove();
    });

    peersRef.current[userId] = call;
  }

  function addVideoStream(video: HTMLVideoElement, stream: MediaStream, isMine: boolean = false) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    
    if (isMine) video.muted = true;
    
    // Strict null check before appending
    if (videoGridRef.current) {
        videoGridRef.current.append(video);
    }
  }

  return (
    <div className="room-container">
      <h1>Room: {roomId}</h1>
      <div 
        ref={videoGridRef} 
        style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, 300px)',
            gap: '10px'
        }}
      ></div>
    </div>
  );
}