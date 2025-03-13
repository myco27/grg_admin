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

const PermissionDialog = ({ open, onClose, fetchRoles, fetchPermissions }) => {
  const [permissionName, setPermissionName] = useState("");
  const { showAlert } = useAlert();

  const handleConfirm = async () => {
    try {
      const response = await axiosClient.post("/permissions/create", {
        name: permissionName,
      });
      if (response.status === 201) {
        showAlert(response.data.message, "success");
        fetchRoles();
        fetchPermissions();
        onClose();
      }
    } catch (error) {
      console.error("Error creating role:", error);
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
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="gradient" color="blue" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default PermissionDialog;
