import { useCall } from "@/contexts/CallContext";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useEffect, useRef } from "react";

const CallModal = () => {
  const {
    isCallModalOpen,
    callType,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    callDuration,
    endCall,
    toggleMute,
    toggleVideo,
  } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isCallModalOpen} onOpenChange={() => endCall()}>
      <DialogContent className="max-w-4xl h-[600px] p-0" aria-describedby="call-description">
        <DialogTitle className="sr-only">
          {callType === "video" ? "Video Call" : "Voice Call"}
        </DialogTitle>
        <DialogDescription className="sr-only" id="call-description">
          {callType === "video" ? "Active video call window" : "Active voice call window"}
        </DialogDescription>
        
        <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden">
          {/* Call duration timer */}
          {callDuration > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <p className="text-white text-sm font-medium">{formatDuration(callDuration)}</p>
            </div>
          )}

          {/* Remote video */}
          {callType === "video" && remoteStream && (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}

          {/* Audio only placeholder */}
          {callType === "voice" && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="size-32 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Mic className="size-16 text-primary" />
                </div>
                <p className="text-white text-lg">Cuộc gọi thoại</p>
              </div>
            </div>
          )}

          {/* Local video (picture in picture) */}
          {callType === "video" && localStream && (
            <div className="absolute top-4 right-4 w-48 h-36 bg-slate-800 rounded-lg overflow-hidden border-2 border-white/20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <Button
              size="icon"
              variant={isMuted ? "destructive" : "secondary"}
              className="size-14 rounded-full"
              onClick={toggleMute}
            >
              {isMuted ? (
                <MicOff className="size-6" />
              ) : (
                <Mic className="size-6" />
              )}
            </Button>

            {callType === "video" && (
              <Button
                size="icon"
                variant={isVideoOff ? "destructive" : "secondary"}
                className="size-14 rounded-full"
                onClick={toggleVideo}
              >
                {isVideoOff ? (
                  <VideoOff className="size-6" />
                ) : (
                  <Video className="size-6" />
                )}
              </Button>
            )}

            <Button
              size="icon"
              variant="destructive"
              className="size-14 rounded-full"
              onClick={endCall}
            >
              <PhoneOff className="size-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallModal;