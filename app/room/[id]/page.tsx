'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import type Peer from 'peerjs'
import type { MediaConnection } from 'peerjs'

export default function RoomPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const roomId = params?.id as string
  const mode = searchParams?.get('mode') || 'video'
  const isAudioMode = mode === 'audio'

  const remoteGridRef = useRef<HTMLDivElement>(null)
  const localPreviewRef = useRef<HTMLDivElement>(null)

  const socketRef = useRef<Socket | null>(null)
  const peerRef = useRef<Peer | null>(null)
  const peersRef = useRef<Record<string, MediaConnection>>({})
  const myStreamRef = useRef<MediaStream | null>(null)
  const initializedRef = useRef(false)

  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(!isAudioMode)

  useEffect(() => {
    if (!roomId || initializedRef.current) return
    initializedRef.current = true

    const init = async () => {
      const PeerClass = (await import('peerjs')).default

      socketRef.current = io('http://localhost:3000', {
        transports: ['websocket'],
      })

      peerRef.current = new PeerClass()

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: !isAudioMode,
      })

      myStreamRef.current = stream
      addLocalPreview(stream)

      peerRef.current.on('call', call => {
        call.answer(stream)
        call.on('stream', remoteStream => addRemoteStream(remoteStream))
      })

      peerRef.current.on('open', id => {
        socketRef.current?.emit('join-room', roomId, id)

        socketRef.current?.on('user-connected', userId => {
          const call = peerRef.current?.call(userId, stream)
          if (!call) return
          call.on('stream', remoteStream => addRemoteStream(remoteStream))
          peersRef.current[userId] = call
        })
      })
    }

    init()
    return () => leaveCall()
  }, [roomId])

  function createVideo(stream: MediaStream, muted = false) {
    const video = document.createElement('video')
    video.srcObject = stream
    video.autoplay = true
    video.playsInline = true
    video.muted = muted
    return video
  }

  function addLocalPreview(stream: MediaStream) {
    if (!localPreviewRef.current) return
    localPreviewRef.current.innerHTML = ''

    const container = document.createElement('div')
    container.className =
      'relative w-full h-full bg-gray-900 rounded-xl overflow-hidden shadow-xl'

    const video = createVideo(stream, true)

    if (stream.getVideoTracks().length === 0) {
      video.className = 'hidden'
      const avatar = document.createElement('div')
      avatar.className =
        'w-full h-full flex items-center justify-center text-indigo-400 text-4xl'
      avatar.textContent = '🎙️'
      container.append(avatar)
    } else {
      video.className = 'w-full h-full object-cover scale-x-[-1]'
      container.append(video)
    }

    localPreviewRef.current.append(container)
  }

  function addRemoteStream(stream: MediaStream) {
    if (!remoteGridRef.current) return

    const container = document.createElement('div')
    container.className =
      'relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center'

    const video = createVideo(stream)

    if (stream.getVideoTracks().length === 0) {
      video.className = 'hidden'
      const avatar = document.createElement('div')
      avatar.className =
        'flex flex-col items-center text-gray-400 select-none'
      avatar.innerHTML = `
        <div class="p-6 rounded-full bg-indigo-500/20 text-indigo-400 mb-2">🎙️</div>
        <span class="font-semibold">User</span>
      `
      container.append(avatar)
    } else {
      video.className = 'w-full h-full object-cover'
      container.append(video)
    }

    remoteGridRef.current.append(container)
  }

  function toggleMic() {
    myStreamRef.current?.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled
      setMicOn(track.enabled)
    })
  }

  async function toggleVideo() {
    if (!myStreamRef.current) return

    const videoTracks = myStreamRef.current.getVideoTracks()

    if (camOn && videoTracks.length) {
      videoTracks.forEach(track => {
        track.stop()
        myStreamRef.current?.removeTrack(track)
      })
      setCamOn(false)
      addLocalPreview(myStreamRef.current)
      return
    }

    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
    const videoTrack = videoStream.getVideoTracks()[0]
    myStreamRef.current.addTrack(videoTrack)

    Object.values(peersRef.current).forEach(call => {
      const sender = call.peerConnection
        ?.getSenders()
        .find(s => s.track?.kind === 'video')
      sender?.replaceTrack(videoTrack)
    })

    setCamOn(true)
    addLocalPreview(myStreamRef.current)
  }

  function leaveCall() {
    socketRef.current?.disconnect()
    peerRef.current?.destroy()
    myStreamRef.current?.getTracks().forEach(t => t.stop())
    window.location.href = '/'
  }

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] p-6 text-white">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            {isAudioMode ? '🎙️ Audio Call' : '📹 Video Call'}
          </h1>
          <p className="text-gray-400 text-sm">
            Room <span className="text-indigo-400">{roomId}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleMic}
            className="rounded-full bg-slate-800 px-4 py-2 hover:bg-slate-700 transition"
          >
            {micOn ? 'Mute' : 'Unmute'}
          </button>

          <button
            onClick={toggleVideo}
            className="rounded-full bg-slate-800 px-4 py-2 hover:bg-slate-700 transition"
          >
            {camOn ? 'Video Off' : 'Video On'}
          </button>

          <button
            onClick={leaveCall}
            className="rounded-full bg-red-500/10 px-5 py-2 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
          >
            Leave
          </button>
        </div>
      </header>

      {/* Remote users (main stage) */}
      <div
        ref={remoteGridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
      />

      {/* Local self preview (floating) */}
      <div className="fixed bottom-6 right-6 w-40 h-28 sm:w-48 sm:h-32">
        <div ref={localPreviewRef} className="w-full h-full" />
      </div>
    </div>
  )
}
