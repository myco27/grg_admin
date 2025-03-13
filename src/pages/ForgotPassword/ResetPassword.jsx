import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Eye, EyeOff} from "lucide-react";
import { useAlert } from "../../contexts/alertContext";
import axiosClient from "../../axiosClient"; 

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {showAlert} = useAlert();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showAlert("PASSWORDS DO NOT MATCH!", "error");
      return;
    }

    if(password.length === 0 || confirmPassword.length === 0){
      showAlert("PASSWORD FIELD IS EMPTY!", "error")
      return;
    }

    try {
      await axiosClient.post("/reset-password", {
        email: localStorage.getItem("email"),
        code: localStorage.getItem("confirmation_code"),
        password
      });

      showAlert("Password reset successful :)", "success");
      localStorage.clear()
      navigate("/admin/login");
    } catch (error) {
      showAlert("Something went wrong","error");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-2 text-center">
      <div className="flex w-[500px] flex-col items-center justify-center gap-5 rounded-md border-2 border-white bg-white p-10 drop-shadow-lg">
        <div className="flex min-w-full items-center justify-center rounded bg-purple-600">
          <img className="scale-50" src="/rockygo_logo.png"></img>
        </div>
        <Typography variant="h5" className='font-normal' color="black">
          Reset Password
        </Typography>
        <form
          className="flex min-w-full flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <Input
            color="purple"
            className="min-w-full"
            type={showNewPassword ? "text" : "password"}
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={
              <div
              className="cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? <EyeOff /> : <Eye />}
              </div>
            }
          />

          <Input
            color="purple"
            className="min-w-full"
            label="Confirm Password"
            value={confirmPassword}
            type={showConfirmPassword ? 'text' : 'password'}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={
              <div
              className="cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </div>
            }
          />
          <Button className="bg-purple-600 hover:bg-purple-400" type="submit">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
