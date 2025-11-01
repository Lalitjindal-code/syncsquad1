import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "error" | "success" | "info";
}

export const MessageModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
}: MessageModalProps) => {
  if (!isOpen) return null;

  const bgColor = type === "error" ? "bg-destructive/10" : type === "success" ? "bg-accent/10" : "bg-primary/10";
  const borderColor = type === "error" ? "border-destructive" : type === "success" ? "border-accent" : "border-primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className={`bg-card border-2 ${borderColor} rounded-lg max-w-md w-full mx-4 p-6 animate-scale-in`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className={`p-4 rounded-md ${bgColor} mb-4`}>
          <p className="text-foreground">{message}</p>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} variant="default">
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
