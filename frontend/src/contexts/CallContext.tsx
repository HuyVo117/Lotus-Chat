import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import Peer from "simple-peer";
import { useSocketStore } from "@/stores/useSocketStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

interface CallContextType {
  isInCall: boolean;
  isCallModalOpen: boolean;
  callType: "voice" | "video" | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  callDuration: number;
  incomingCall: { from: string; signal: any; type: "voice" | "video" } | null;
  callUser: (userId: string, type: "voice" | "video") => Promise<void>;
  answerCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  declineCall: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within CallProvider");
  }
  return context;
};

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const { socket } = useSocketStore();
  const { user } = useAuthStore();
  
  const [isInCall, setIsInCall] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<"voice" | "video" | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [incomingCall, setIncomingCall] = useState<{
    from: string;
    signal: any;
    type: "voice" | "video";
  } | null>(null);

  const callStartTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup streams
  const cleanupStreams = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
    if (peer) {
      peer.destroy();
      setPeer(null);
    }
  };

  // Start call timer
  const startCallTimer = () => {
    callStartTimeRef.current = Date.now();
    timerIntervalRef.current = setInterval(() => {
      if (callStartTimeRef.current) {
        const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
        setCallDuration(elapsed);
      }
    }, 1000);
  };

  // Stop call timer
  const stopCallTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    callStartTimeRef.current = null;
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Call user
  const callUser = async (userId: string, type: "voice" | "video") => {
    try {
      const currentSocket = socket;
      
      if (!currentSocket || !currentSocket.connected) {
        toast.error("Chưa kết nối tới server");
        console.log("Socket state:", currentSocket);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });

      setLocalStream(stream);
      setCallType(type);
      setIsCallModalOpen(true);

      const newPeer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      newPeer.on("signal", (signal) => {
        console.log("Emitting call-user signal", { userToCall: userId, type });
        currentSocket.emit("call-user", {
          userToCall: userId,
          signal,
          from: user?._id,
          type,
        });
      });

      newPeer.on("stream", (currentStream) => {
        setRemoteStream(currentStream);
        setIsInCall(true);
        startCallTimer(); // Start timer when call connects
      });

      setPeer(newPeer);
    } catch (error) {
      console.error("Error calling user:", error);
      toast.error("Không thể truy cập camera/microphone");
      cleanupStreams();
    }
  };

  // Answer call
  const answerCall = async () => {
    if (!incomingCall) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: incomingCall.type === "video",
        audio: true,
      });

      setLocalStream(stream);
      setCallType(incomingCall.type);
      setIsCallModalOpen(true);

      const newPeer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      newPeer.on("signal", (signal) => {
        socket?.emit("answer-call", {
          signal,
          to: incomingCall.from,
        });
      });

      newPeer.on("stream", (currentStream) => {
        setRemoteStream(currentStream);
        setIsInCall(true);
        startCallTimer(); // Start timer when call connects
      });

      newPeer.signal(incomingCall.signal);
      setPeer(newPeer);
      setIncomingCall(null);
    } catch (error) {
      console.error("Error answering call:", error);
      toast.error("Không thể truy cập camera/microphone");
      cleanupStreams();
    }
  };

  // End call
  const endCall = () => {
    stopCallTimer();
    
    const duration = callDuration;
    const formattedDuration = formatDuration(duration);
    
    cleanupStreams();
    setIsInCall(false);
    setIsCallModalOpen(false);
    setCallType(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setCallDuration(0);

    if (socket) {
      socket.emit("end-call");
    }

    // Show call duration toast
    if (duration > 0) {
      toast.success(`Cuộc gọi kết thúc • ${formattedDuration}`);
    }
  };

  // Decline call
  const declineCall = () => {
    setIncomingCall(null);
    if (socket && incomingCall) {
      socket.emit("end-call", { to: incomingCall.from });
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream && callType === "video") {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("incoming-call", ({ from, signal, type }: { from: string; signal: any; type: "voice" | "video" }) => {
      setIncomingCall({ from, signal, type });
    });

    socket.on("call-answered", ({ signal }: { signal: any }) => {
      if (peer) {
        peer.signal(signal);
      }
    });

    socket.on("call-ended", () => {
      stopCallTimer();
      const duration = callDuration;
      const formattedDuration = formatDuration(duration);
      
      cleanupStreams();
      setIsInCall(false);
      setIsCallModalOpen(false);
      setCallType(null);
      setIncomingCall(null);
      setCallDuration(0);
      
      if (duration > 0) {
        toast.info(`Cuộc gọi đã kết thúc • ${formattedDuration}`);
      } else {
        toast.info("Cuộc gọi đã kết thúc");
      }
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-answered");
      socket.off("call-ended");
    };
  }, [socket, peer, callDuration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCallTimer();
      cleanupStreams();
    };
  }, []);

  return (
    <CallContext.Provider
      value={{
        isInCall,
        isCallModalOpen,
        callType,
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        callDuration,
        incomingCall,
        callUser,
        answerCall,
        endCall,
        toggleMute,
        toggleVideo,
        declineCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};