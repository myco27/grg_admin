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
  Typography,
} from "@material-tailwind/react";
import { Tabs } from "@material-tailwind/react";
import { Body, Base, Footer, Header, Sidebar } from "../../components/Modal";
import { UserRoundCog } from "lucide-react";
const ViewAdminModal = ({ viewOpen, viewHandleOpen, adminId, fetchUsers}) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    permissions: "",
  });
  const [activeTab, setActiveTab] = useState("User Details")
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false)

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/roles");
      if (response.status == 200) {
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }finally{
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
        });
      
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewOpen) {
      fetchAdminDetails();
    }
  }, [viewOpen, adminId]);

const tabs = [{
value: "User Details",
label: "User Details",
icon: <UserRoundCog/>,
content: (
  <>

  <div className="flex h-full w-full flex-col gap-5 overflow-auto">
            <div className="flex flex-row gap-x-20">
              <div className="flex flex-col">
                <Typography variant="h6">First Name</Typography>
                <Typography className="max-h-[50px] min-w-[200px] rounded border border-gray-500 bg-gray-300 p-3" >{formData.first_name}</Typography>
              </div>
              <div className="flex flex-col">
                <Typography variant="h6">Last Name</Typography>
                <Typography className="max-h-[50px] min-w-[200px] rounded border border-gray-500 bg-gray-300 p-3">{formData.last_name}</Typography>
              </div>
            </div>
            <div>
              <Typography variant="h6">Email</Typography>
              <Typography className="mr-2 rounded border border-gray-500 bg-gray-300 p-3">{formData.email}</Typography>
            </div>
            <div className="flex flex-wrap">
              <Typography variant="h5">Roles:</Typography>
              <Chip
                className="m-1 max-w-fit bg-purple-50 text-purple-900"
                color="purple"
                value={formData.role}
              ></Chip>
            </div>
            <div className="flex flex-wrap">
              <Typography variant="h5">Permissions: </Typography>
              {Object.entries(formData.permissions).map(([index, value]) => (
                <div key={index}>
                  <Chip
                    color="purple"
                    className="m-1 max-w-fit bg-purple-50 text-purple-900"
                    value={value}
                  ></Chip>
                </div>
              ))}
            </div>
          </div> 
  </>
)
}
]

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
                  <Header
                    title={
                     activeTab
                    
                    }
                    onClose={viewHandleOpen}

                  />
                  <Body className="flex"
                    tabs={tabs
                    }
                    activeTab={activeTab}
                    loading={loading}
                  />
                  <Footer
                    loading={saving}
                    showSubmit={false}
                    onCancel={viewHandleOpen}
                  />
                </div>
              </div>
            </Tabs>
          </Base>
        </form>
    </>

  )
    
  
};

export default ViewAdminModal;
