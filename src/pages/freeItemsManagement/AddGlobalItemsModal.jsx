import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Loading from "../../components/layout/Loading";
import { useAlert } from "../../contexts/alertContext";
import axiosClient from "../../axiosClient";

const AddGlobalItemsModal = ({
  openGlobalItems,
  handleOpenGlobalItems,
  fetchGlobalItemsTable,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (openGlobalItems) {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [openGlobalItems]);

  // API CALLS
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await axiosClient.post("/admin/global-free-items/add", {
        name: formData.name,
        description: formData.description,
      });

      fetchGlobalItemsTable();
      handleOpenGlobalItems();
      showAlert("Global Item created successfully!", "success");
    } catch (error) {
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

  //   EVENT LISTENERS
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={openGlobalItems} handler={handleOpenGlobalItems}>
      <DialogHeader>Add New Global Item</DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        {loading ? (
          <Loading />
        ) : submitting ? (
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
            onClick={handleOpenGlobalItems}
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

export default AddGlobalItemsModal;
