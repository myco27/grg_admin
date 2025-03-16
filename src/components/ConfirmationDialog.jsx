import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmation",
  message,
  isLoading,
}) => {
  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>{message}</DialogBody>
      <DialogFooter className="flex gap-x-2">
        <Button
          variant="gradient"
          color="gray"
          disabled={isLoading}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="purple"
          disabled={isLoading}
          onClick={onConfirm}
        >
          <span>{isLoading ? "Confirming..." : "Confirm"}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmationDialog;
