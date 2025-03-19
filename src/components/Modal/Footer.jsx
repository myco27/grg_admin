import React from "react";
import { DialogFooter, Button } from "@material-tailwind/react";

const Footer = ({
  children,
  className = "",
  cancelText = "Cancel",
  submitText = "Save",
  loading = false,
  onCancel,
  onSubmit,
  showCancel = true,
  showSubmit = true,
  cancelButtonProps = {},
  submitButtonProps = {}
}) => {
  return (
    <DialogFooter className={`flex justify-end gap-2 bg-white p-2 border-t border-gray-300 ${className}`}>
      {children || (
        <>
          {showCancel && (
            <Button
              color="gray"
              disabled={loading}
              onClick={onCancel}
              {...cancelButtonProps}
            >
              <span>{cancelText}</span>
            </Button>
          )}
          {showSubmit && (
            <Button
              className="bg-primary"
              type="submit"
              disabled={loading}
              onClick={onSubmit}
              {...submitButtonProps}
            >
              <span className="m-0 p-0">{loading ? "Saving..." : submitText}</span>
            </Button>
          )}
        </>
      )}
    </DialogFooter>
  );
};

export default Footer;
