import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";

const AddUserModal = ({ open, handleOpen }) => {
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
    handleOpen(); // Close modal after submission
  };
  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Add New User</DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="First Name" type="text" required />
            <Input label="Last Name" type="text" required />
            <Input label="Email" type="email" required autoComplete="username"/>

            {/* Password Field */}
            <div className="relative">
              <Input
                label="Password"
                type={passwordVisibility.password ? "text" : "password"}
                required
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
                label="Confirm Password"
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                required
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

            <div className="flex justify-end gap-2">
              <Button variant="gradient" color="gray" onClick={handleOpen}>
                <span>Cancel</span>
              </Button>
              <Button type="submit" variant="gradient" color="purple">
                <span>Save</span>
              </Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default AddUserModal;
