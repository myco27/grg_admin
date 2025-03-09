import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

const ConfirmationDialog = ({ open, onClose, onConfirm, title = "Confirmation", message }) => {
  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>{message}</DialogBody>
      <DialogFooter className="flex gap-x-2">
        <Button variant="text" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="gradient" color="blue" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmationDialog;
