import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Textarea,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Loading from "../../components/layout/Loading";
import { useAlert } from "../../contexts/alertContext";
import axiosClient from "../../axiosClient";

const EditSetting = ({
  editOpen,
  editHandleOpen,
  settingId,
  settingName,
  fetchSettings,
}) => {
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

  const fetchSettingDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/admin/settings/${settingName}`);

      if (response.status === 200) {
        const responseData = response.data.data;

        setFormData({
          setting_name: responseData[0].setting_name,
          setting_value1: responseData[0].setting_value1,
          setting_value2: responseData[0].setting_value2,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await axiosClient.put(`/admin/settings/${settingId}`, formData);

      if (response.status) {
        fetchSettings();
        editHandleOpen();
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
    if (editOpen) {
      fetchSettingDetails();
    }
  }, [editOpen, settingId]);

  return (
    <Dialog open={editOpen} handler={editHandleOpen}>
      <DialogHeader>Edit New Setting</DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        {loading ? (
          <Loading />
        ) : submitting ? (
          <Loading />
        ) : (
          <>
            <Input
              className="!bg-gray-100"
              label="Setting Name"
              name="setting_name"
              type="text"
              readOnly
              value={formData.setting_name}
              onChange={handleInputChange}
            />
            <Textarea
              label="Setting Value 1"
              name="setting_value1"
              required
              value={formData.setting_value1}
              onChange={handleInputChange}
            />
            <Textarea
              label="Setting Value 2"
              name="setting_value2"
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
            onClick={editHandleOpen}
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

export default EditSetting;
