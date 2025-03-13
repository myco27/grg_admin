import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Typography } from "@material-tailwind/react";
import { Lock } from "lucide-react";
import { useAlert } from "../../contexts/alertContext";
import axiosClient from "../../axiosClient";

export default function EmailCode() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(30);
  const {showAlert} = useAlert();
  const resendCode = async (e) => {
    e.preventDefault();
    handleResubmit(e);
    setSeconds(30); 
  };
  
  useEffect(() => {
    if (seconds === 0) return;

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const handleResubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/forgot-password", {
        email: localStorage.getItem("email")
      });
      showAlert("Code sent to your email", "success")
      navigate("/admin/emailcode");
    } catch (error) {
      console.log(error);
      showAlert("Code was not sent", "error")
    }finally{

    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/verify-code", { code });
      showAlert("Code is Verified!", "success")
      localStorage.setItem("confirmation_code", code);
      navigate("/admin/resetpassword");
    } catch (error) {
      showAlert("Your code was invalid", "error")
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-2 text-center">
      <form
        className="flex w-[500px] flex-col items-center justify-center gap-5 rounded-md border-2 border-white bg-white p-10 drop-shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex min-w-full items-center justify-center rounded bg-purple-600">
          <img className="scale-50" src="/rockygo_logo.png" />
        </div>

        <Typography variant="h6" color="black" className="font-normal">
          Enter the code sent to your email
        </Typography>

        <Typography>
          <Button
            onClick={(e) => resendCode(e)}
            disabled={seconds > 0}
            variant="text"
            color="blue-gray"
          >
            Didn't receive an email? {seconds > 0 ? `Resend in ${seconds}s` : "Resend Now"}
          </Button>
        </Typography>

        <Input
          icon={<Lock />}
          placeholder="Code Here"
          color="purple"
          label="Enter Code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <Button
          type="submit"
          className="min-w-full bg-purple-600 hover:bg-purple-400"
        >
          Verify Code
        </Button>
      </form>
    </div>
  );
}
