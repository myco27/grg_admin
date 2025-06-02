import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { useAlert } from "../../contexts/alertContext";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import Loading from "../../components/layout/Loading";

const EditGlobalItemsModal = ({
  editOpen,
  editHandleOpen,
  globalItemId,
  fetchGlobalItemsTable,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();

  // API CALLS
  const fetchGlobalItemDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/admin/get/global-free-items/${globalItemId}`
      );

      const responseData = response.data;
      setFormData({
        name: responseData.name,
        description: responseData.description,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editOpen) {
      fetchGlobalItemDetails();
    }
  }, [editOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await axiosClient.put(
        `/admin/global-free-items/update/${globalItemId}`,
        {
          name: formData.name,
          description: formData.description,
        }
      );

      showAlert("Global Item Updated Successfully", "success");
      fetchGlobalItemsTable();
      editHandleOpen();
    } catch (error) {
      console.error("Update Error:", error);
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            messages.forEach((message) => {
              showAlert(`${message}`, "error");
            });
          }
        );
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  // EVENT LISTENERS
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Dialog open={editOpen} handler={editHandleOpen}>
        <DialogHeader>Edit Global Item</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          {loading ? (
            <Loading />
          ) : saving ? (
            <Loading />
          ) : (
            <>
              <Input
                label="Name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
              <Input
                label="Description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleInputChange}
              />
            </>
          )}
        </DialogBody>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              variant="gradient"
              color="gray"
              disabled={saving}
              onClick={editHandleOpen}
            >
              <span className="m-0 p-0">Cancel</span>
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary"
              type="submit"
              disabled={saving}
            >
              <span className="m-0 p-0">{saving ? "Saving..." : "Save"}</span>
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default EditGlobalItemsModal;
