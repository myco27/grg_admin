import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useAlert } from "../../contexts/alertContext";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";
import axiosClient from "../../axiosClient";
import Loading from "../../components/layout/Loading";
const EditStoreBranchesModal = ({
  open,
  handleOpen,
  userId,
  userType,
  fetchStoreBranches,
}) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessLandlineNumber, setBusinessLandlineNumber] = useState("");
  const [businessContactNumber, setBusinessContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/admin/users/${userId}`);

      if (response.status === 200) {
        setFirstName(response.data.data.first_name);
        setLastName(response.data.data.last_name);
        setEmail(response.data.data.email);
        setBusinessLandlineNumber(response.data.data.mobile_number ?? "");
        setBusinessContactNumber(response.data.data.store?.phone ?? "");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setLoading(true)
    try {
      const response = await axiosClient.post(`/admin/users/update/${userId}`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        business_landline_number: businessLandlineNumber,
        business_contact_number: businessContactNumber,
        ...(password && { password }),
        ...(confirmPassword && { password_confirmation: confirmPassword }),
      });

      if (response.status === 202) {
        fetchStoreBranches();
        showAlert('User updated successfully!', "success");
        handleOpen();
        setLoading(false);
      }
    } catch (error) {
      if (error.response.data.errors) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((errorMessage) => {
            showAlert(`${errorMessage}`, "error");
          });
        setLoading(false);
      } else {
        showAlert("An error occurred. Please try again.", "error");
      }
    } finally {
      setSaving(false);
      setLoading(false)
    }
  };

  useEffect(() => {
    if (open && userId) {
      fetchUserDetails();
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setBusinessLandlineNumber("");
      setBusinessContactNumber("");
      setPassword("");
      setConfirmPassword("");
      setPasswordVisibility({ password: false, confirmPassword: false });
    }
  }, [open, userId]);

  const toggleVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <>
   (<Dialog
        aria-hidden="true"
        size="md"
        open={open}
        handler={handleOpen}
        className="flex flex-col"
      >
        <DialogHeader>Edit Admin</DialogHeader>
        <form>
        {loading?(<Loading/>):<DialogBody className="flex flex-col gap-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              type="email"
              autoComplete="username"
            />
            <Input
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              label="Business Landline Number"
              type="text"
              value={businessLandlineNumber}
              onChange={(e) => setBusinessLandlineNumber(e.target.value)}
              autoComplete="tel"
            />
            <Input
              label="Business Contact Number"
              type="text"
              value={businessContactNumber}
              onChange={(e) => setBusinessContactNumber(e.target.value)}
              autoComplete="tel"
            />

            {/* Password Field */}
            <div className="relative">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type={passwordVisibility.password ? "text" : "password"}
                className="pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                onClick={() => toggleVisibility("password")}
              >
                {passwordVisibility.password ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm Password"
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                className="pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                onClick={() => toggleVisibility("confirmPassword")}
              >
                {passwordVisibility.confirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </DialogBody>}
          <DialogFooter>
            <div className="flex justify-end gap-2">
              <Button
                variant="gradient"
                color="gray"
                disabled={loading }
                onClick={handleOpen}
              >
                <span className="m-0 p-0">Cancel</span>
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-primary"
                type="submit"
                disabled={loading}
              >
                <span className="m-0 p-0">{saving ? "Saving..." : "Save"}</span>
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Dialog>)
    </>
  );
};

export default EditStoreBranchesModal;
