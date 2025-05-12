import { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import axiosClient from "../../axiosClient";
import { useAlert } from "../../contexts/alertContext";

const PermissionDialog = ({ open, onClose, fetchRoles, fetchPermissions, fetchPermissionsTable }) => {
  const [permissionName, setPermissionName] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.post("/permissions/create", {
        name: permissionName,
      });
      if (response.status === 201) {
        showAlert(response.data.message, "success");
        fetchRoles();
        fetchPermissions();
        fetchPermissionsTable();
        onClose();
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((errorMessage) => showAlert(errorMessage, "error"));
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPermissionName("");
  }, [open]);

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Add New Permission</DialogHeader>
      <DialogBody>
        <Input
          label="Permission Name"
          value={permissionName}
          onChange={(e) => setPermissionName(e.target.value)}
        />
      </DialogBody>
      <DialogFooter className="flex gap-2">
        <Button
          variant="gradient"
          color="gray"
          disabled={loading}
          onClick={onClose}
        >
          <span>Cancel</span>
        </Button>
        <Button
          type="submit"
          variant="gradient"
          color="purple"
          disabled={loading}
          onClick={handleConfirm}
        >
          <span>{loading ? "Saving..." : "Save"}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default PermissionDialog;
