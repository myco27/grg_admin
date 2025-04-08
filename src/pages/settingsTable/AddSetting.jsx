import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Select,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Loading from "../../components/layout/Loading";
import axiosClient from "../../axiosClient";
import { useAlert } from "../../contexts/alertContext";

const AddSetting = ({ open, handleOpen, fetchSettings }) => {
  const [formData, setFormData] = useState({
    setting_name: "",
    setting_value1: "",
    setting_value2: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showAlert } = useAlert();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await axiosClient.post("/admin/settings/add", formData);

      if (response.status) {
        fetchSettings();
        handleOpen();
        showAlert("Setting created successfully!", "success");
      }
    } catch (error) {
      console.log(error);

      if (error.response.data.errors) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((errorMessage) => {
            showAlert(`${errorMessage}`, "error");
          });
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (open) {
      setFormData({
        setting_name: "",
        setting_value1: "",
        setting_value2: "",
      });
    }
  }, [open]);

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Add New Setting</DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        {loading ? (
          <Loading />
        ) : submitting ? (
          <Loading />
        ) : (
          <>
            <Input
              label="Setting Name"
              name="setting_name"
              type="text"
              required
              value={formData.setting_name}
              onChange={handleInputChange}
            />
            <Input
              label="Setting Value 1"
              name="setting_value1"
              type="text"
              required
              value={formData.setting_value1}
              onChange={handleInputChange}
            />
            <Input
              label="Setting Value 2"
              name="setting_value2"
              type="text"
              required
              value={formData.setting_value2}
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
            onClick={handleOpen}
            disabled={submitting}
          >
            <span>Cancel</span>
          </Button>
          <Button
            type="submit"
            className="bg-primary"
            disabled={submitting}
            onClick={handleSubmit}
          >
            <span>{submitting ? "Saving..." : "Save"}</span>
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default AddSetting;
