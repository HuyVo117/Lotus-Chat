import { useCall } from "@/contexts/CallContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Video } from "lucide-react";

const IncomingCallDialog = () => {
  const { incomingCall, answerCall, declineCall } = useCall();

  if (!incomingCall) return null;

  return (
    <Dialog open={!!incomingCall}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {incomingCall.type === "video" ? "Cuộc gọi video đến" : "Cuộc gọi thoại đến"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center">
            {incomingCall.type === "video" ? (
              <Video className="size-12 text-primary" />
            ) : (
              <Phone className="size-12 text-primary" />
            )}
          </div>

          <p className="text-muted-foreground">Đang có cuộc gọi đến...</p>

          <div className="flex gap-4">
            <Button
              size="lg"
              variant="destructive"
              className="gap-2"
              onClick={declineCall}
            >
              <PhoneOff className="size-5" />
              Từ chối
            </Button>

            <Button
              size="lg"
              className="gap-2 bg-green-500 hover:bg-green-600"
              onClick={answerCall}
            >
              <Phone className="size-5" />
              Trả lời
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingCallDialog;