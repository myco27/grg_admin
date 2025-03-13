import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { useAlert } from "../../contexts/alertContext";

const RoleDialog = ({ open, onClose, fetchRoles, fetchPermissions }) => {
  const [roleName, setRoleName] = useState("");
  const { showAlert } = useAlert();

  const handleConfirm = async () => {
    try {
      const response = await axiosClient.post("/roles/create", {
        name: roleName,
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
    setRoleName("");
  }, [open]);

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Add New Role</DialogHeader>
      <DialogBody>
        <Input
          label="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </DialogBody>
      <DialogFooter className="flex gap-2">
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

export default RoleDialog;
