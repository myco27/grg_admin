import React, { useEffect, useState } from "react";
import {
  Input,
  Tabs,
  Typography,
} from "@material-tailwind/react";
import { UserRoundCog, LockKeyhole } from 'lucide-react';
import { Base, Header, Body, Footer, Sidebar } from "../../components/Modal";
import axiosClient from "../../axiosClient";

const ProfileModal = ({ open, handleOpen, userId, userType, fetchUsers }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [applicantType, setApplicantType] = useState("");
    const [applicantStatus, setApplicantStatus] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [dateApplied, setDateApplied] = useState("");
    const [dateApproved, setDateApproved] = useState("");
    const [dateRejected, setDateRejected] = useState("");
    const [plateNumber, setPlateNumber] = useState("");
    const [model, setModel] = useState("");
    const [color, setColor] = useState("");
    const [disability, setDisability] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("details");
    
    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/admin/applicants/${userId}`);
            if (response.status === 200) {
                setActiveTab("details");
                
                setFirstName(response.data.applicantData.firstname);
                setLastName(response.data.applicantData.lastname);
                setEmail(response.data.applicantData.email);
                setMobileNumber(response.data.applicantData.mobile_number);
                setApplicantType(response.data.applicantData.type);
                setApplicantStatus(response.data.applicantData.status);
                setRejectionReason(response.data.applicantData.rejection_reason);
                setDateApplied(response.data.applicantData.date_created);
                setDateApproved(response.data.applicantData.date_approved);
                setDateRejected(response.data.applicantData.date_of_rejection);
                setPlateNumber(response.data.applicantData.plate_number);
                setModel(response.data.applicantData.model);
                setColor(response.data.applicantData.color);
                setDisability(response.data.applicantData.disability);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && userId) {
            fetchUserDetails();
        } else {
            setActiveTab("details");
        }
    }, [open, userId]);

    useEffect(() => {
        if (activeTab === "additional_info" && applicantType !== "rider") {
            setActiveTab("details");
        }
    }, [applicantType, activeTab]);
      
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        updateUser();
    };

   const tabs = [
    {
      value: "details",
      label: "Details",
      icon: <UserRoundCog />,
      content: (
        <>  
          <div className="flex gap-2 pb-4 border-b border-gray-300">
            <Input
              label="First Name"
              type="text"
              value={firstName}
              readOnly
            />
            <Input
              label="Last Name"
              type="text"
              value={lastName}
              readOnly
            />
          </div>
          <div className="flex gap-2 py-4 border-b border-gray-300">
            <Input
              value={email}
              readOnly
              label="Email"
              type="email"
              
            />
          </div>
          <div className="flex gap-2 py-4 border-b border-gray-300">
            <Input
              label="Mobile Number"
              type="text"
              value={mobileNumber}
              readOnly
            />
          </div>
          <div className="flex gap-2 py-4 border-b border-gray-300">
            <Input
              label="Applicant Type"
              className="capitalize"
              type="text"
              value={applicantType}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2 py-4">
            <div className="flex gap-2">
                <Typography variant="small" className="text-xs font-bold text-gray-500">
                    Applicant Status: 
                </Typography>
                <Typography variant="small" className={`text-xs capitalize font-bold ${applicantStatus === "pending" ? "text-orange-500" : applicantStatus === "approved" ? "text-green-500" : "text-red-500"}`}>
                    {applicantStatus}
                </Typography>
            </div>

            <div className="flex gap-2">
                <Typography variant="small" className="text-xs font-bold text-gray-500">
                    Date Applied: 
                </Typography>
                <Typography variant="small" className="text-xs text-gray-500">
                    {dateApplied ? new Date(dateApplied).toLocaleDateString() : "N/A"}
                </Typography>
            </div>
            {applicantStatus === "approved" && (
                <>
                    <div className="flex gap-2">
                        <Typography variant="small" className="text-xs font-bold text-gray-500">
                            Date Approved: 
                        </Typography>
                        <Typography variant="small" className="text-xs text-gray-500">
                            {dateApproved ? new Date(dateApproved).toLocaleDateString() : "N/A"}
                        </Typography>
                    </div>
                </>
            )}
            {applicantStatus === "rejected" && (
                <>
                <div className="flex gap-2">
                        <Typography variant="small" className="text-xs text-gray-500">
                            Date Rejected: 
                    </Typography>
                    <Typography variant="small" className="text-xs text-gray-500">
                        {dateRejected ? new Date(dateRejected).toLocaleDateString() : "N/A"}
                    </Typography>
                </div>
                <div className="flex gap-2">
                    <Typography variant="small" className="text-xs text-gray-500">
                        Rejection Reason: 
                    </Typography>
                    <Typography variant="small" className="text-xs text-gray-500">
                        {rejectionReason ? rejectionReason : "N/A"}
                    </Typography>
                </div>
                </>
                    
            )}
          </div>

        </>
      )
    },   
    ...(applicantType === "rider"
        ? [
            {
              value: "additional_info",
              label: "Info",
              icon: <LockKeyhole />,
              content: (
                <>
                  <div className="flex gap-2 pb-4 border-b border-gray-300">
                    <Input
                      label="Plate Number"
                      type="text"
                      value={plateNumber}
                      readOnly
                    />
                    <Input
                      label="Model"
                      type="text"
                      value={model}
                      readOnly
                    />
                  </div>
                  <div className="flex gap-2 py-4 border-b border-gray-300">
                    <Input
                      label="Color"
                      type="text"
                      value={color}
                      readOnly
                    />
                  </div>
                  <div className="flex gap-2 py-4">
                    <Typography variant="small" className="text-xs font-bold text-gray-500">
                      Disability: 
                    </Typography>
                    <Typography variant="small" className="text-xs text-gray-500">
                      {disability == 1 ? "Yes" : "No"}
                    </Typography>
                  </div>
                </>
              )
            }
          ]
        : [])
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Base open={open} handleOpen={handleOpen} aria-hidden={!open} >
        <Tabs value={activeTab} className="w-full flex rounded-lg" orientation="vertical">      
          <div className="flex w-full">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              tabs={tabs}
              sidebarTitle="APPLICATION" 
            />
            <div className="w-full">
              <Header title={tabs.find(tab => tab.value === activeTab)?.label} onClose={handleOpen} />
              <Body tabs={tabs} activeTab={activeTab} />
              <Footer 
                loading={loading} 
                onCancel={handleOpen} 
                showSubmit={false}
              />
            </div>
          </div>
        </Tabs>
      </Base>
    </form>
  );
};

export default ProfileModal;