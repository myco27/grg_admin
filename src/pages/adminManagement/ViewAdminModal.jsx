import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import {
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Spinner,
  tabs,
  Input,
  Typography,
} from "@material-tailwind/react";
import { Tabs } from "@material-tailwind/react";
import { Body, Base, Footer, Header, Sidebar } from "../../components/Modal";
import { UserRoundCog } from "lucide-react";

const ViewAdminModal = ({ viewOpen, viewHandleOpen, adminId, fetchUsers }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    permissions: "",
    profile_picture: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [activeTab, setActiveTab] = useState("User Details");
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/roles");
      if (response.status == 200) {
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchAdminDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/admin/users/${adminId}/roles`);
      if (response.status === 200) {
        const responseData = response.data.user;

        setFormData({
          first_name: responseData.first_name,
          last_name: responseData.last_name,
          email: responseData.email,
          role: responseData.roles?.[0]?.name || "",
          permissions: responseData.all_permissions,
          profile_picture: responseData.profile_picture || "",
        });
        if (responseData.profile_picture) {
          setProfileImage(
            `${import.meta.env.VITE_APP_IMAGE_PATH}/profileImage/${
              responseData.profile_picture
            }`
          );
        } else {
          setProfileImage("/rocky_go_logo.png");
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewOpen) {
      fetchAdminDetails();
    } else {
      setProfileImage(null);
    }
  }, [viewOpen, adminId]);

  const tabs = [
    {
      value: "User Details",
      label: "User Details",
      icon: <UserRoundCog />,
      content: (
        <>
          <div className="flex h-full w-full flex-col gap-5 overflow-auto p-2">
            <div className="flex items-center gap-5 px-4">
              <div className="w-[4rem] h-[4rem] rounded-full bg-gray-300 flex items-center justify-center">
                <img
                  src={profileImage || "/rocky_go_logo.png"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = "/rocky_go_logo.png";
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div>
                <Typography
                  variant="small"
                  className="text-xs font-semibold text-blue-gray-700"
                >
                  Profile Picture
                </Typography>
              </div>
            </div>
            <div className="flex gap-5">
              <Input
                readOnly={true}
                label="First Name"
                value={formData.first_name}
                className="rounded-md border border-gray-500 bg-gray-300 p-3"
              />
              <Input
                readOnly={true}
                label="Last Name"
                value={formData.last_name}
                className="rounded-md border border-gray-500 bg-gray-300 p-3"
              />
            </div>
            <div>
              <Input
                readOnly={true}
                label="Email"
                value={formData.email}
                className="over bg-gray rounded-md border border-gray-500"
              />
            </div>
            <div className="flex flex-wrap">
              <Typography variant="h6">Roles:</Typography>
              <Chip
                className="m-1 max-w-fit bg-purple-50 text-purple-900"
                color="purple"
                value={formData.role}
              ></Chip>
            </div>
            <div className="flex flex-wrap">
              <Typography variant="h6">Permissions: </Typography>
              {Object.entries(formData.permissions).map(([index, value]) => (
                <div key={index}>
                  <Chip
                    color="purple"
                    className="m-1 max-w-fit bg-purple-50 text-purple-900"
                    value={value.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <form>
        <Base open={viewOpen} handleOpen={viewHandleOpen} size="lg">
          <Tabs
            value={activeTab}
            className="flex w-full rounded-lg"
            orientation="horizontal"
          >
            <div className="flex w-full flex-col sm:flex-row">
              <Sidebar
                className="py-5"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
                sidebarTitle="VIEW USER"
              />
              <div className="w-full">
                <Header title={activeTab} onClose={viewHandleOpen} />
                <Body
                  className="flex"
                  tabs={tabs}
                  activeTab={activeTab}
                  loading={loading}
                />
                <Footer
                  loading={loading}
                  showSubmit={false}
                  onCancel={viewHandleOpen}
                />
              </div>
            </div>
          </Tabs>
        </Base>
      </form>
    </>
  );
};

export default ViewAdminModal;
