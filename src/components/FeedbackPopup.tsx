import { Dialog, DialogContent } from "@/components/ui/dialog";
import FeedbackWidget from "@/components/FeedbackWidget";
import { isPromoActive } from "@/lib/promo";

interface FeedbackPopupProps {
  open: boolean;
  onClose: () => void;
}

const FeedbackPopup = ({ open, onClose }: FeedbackPopupProps) => {
  if (!isPromoActive()) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-primary/30">
        <FeedbackWidget />
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackPopup;
