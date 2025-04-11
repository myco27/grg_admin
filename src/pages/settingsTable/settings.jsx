import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Input,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { ArrowLeftRight, Search, UserPlusIcon } from "lucide-react";
import { PencilIcon } from "@heroicons/react/24/solid";
import Loading from "../../components/layout/Loading";
import Pagination from "../../components/OrdersPage/Pagination";
import UseDebounce from "../../components/UseDebounce";

import AddSetting from "./AddSetting";
import EditSetting from "./EditSetting";

const settings = () => {
  const [settingData, setSettingData] = useState([]);
  const [settingType, setSettingType] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = UseDebounce({ value: searchTerm });
  const [open, setOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedSettingId, setSelectedSettingId] = useState(null);
  const [selectedSettingName, setSelectedSettingName] = useState(null);

  const [isColumnReversed, setisColumnReversed] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    links: [],
    itemsPerPage: 10,
    isLoading: false,
  });

  const TABLE_HEAD = [
    "Setting Name",
    "Setting Value 1",
    "Setting Value 2",
    "Action",
  ];

  const reversedThead = isColumnReversed
    ? (() => {
        const reversedHead = [
          TABLE_HEAD[TABLE_HEAD.length - 1],
          ...TABLE_HEAD.slice(0, -1),
        ];
        return reversedHead;
      })()
    : TABLE_HEAD;

  const fetchSettings = async () => {
    setPagination({ ...pagination, isLoading: true });

    try {
      const response = await axiosClient.get(`/admin/settings/${settingType}`, {
        params: {
          search: debounceSearch,
          page: pagination.page,
          page_size: pagination.itemsPerPage,
        },
      });
      const responseData = response.data.data.data;

      if (response.status === 200) {
        setSettingData(responseData);
        const { current_page, last_page, total, links, per_page } =
          response.data.data;

        const newPagination = {
          page: current_page,
          totalPages: last_page,
          totalItems: total,
          links: links,
          itemsPerPage: per_page,
          isLoading: false,
        };

        setPagination(newPagination);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [debounceSearch, pagination.page, pagination.itemsPerPage]);

  // EVENT LISTENERS START
  const handleSearchInput = (event) => {
    const { value } = event.target;

    setSearchTerm(value);
    setPagination({
      ...pagination,
      page: 1,
      itemsPerPage: 10,
    });
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleEditOpen = (settingId, settingName) => {
    setSelectedSettingId(settingId);
    setSelectedSettingName(settingName);
    setEditOpen(!editOpen);
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  const handlePageSizeChange = (newSize) => {
    setPagination({
      ...pagination,
      page: 1,
      itemsPerPage: Number(newSize),
    });
  };

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Setting list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all Settings
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 rounded-md sm:flex-row">
              <Button
                className="flex items-center gap-3 rounded-md"
                size="sm"
                onClick={handleOpen}
              >
                <UserPlusIcon strokeWidth={2} className="w-5" /> Add setting
              </Button>
            </div>
          </div>
          <div className="rounded-none md:flex-row">
            <div className="float-end m-1 flex flex-row gap-1 md:w-72">
              <button onClick={() => setisColumnReversed(!isColumnReversed)}>
                <ArrowLeftRight className="text-gray-500 hover:text-gray-700" />
              </button>
              <Input
                label="Search User"
                icon={
                  pagination.isLoading ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )
                }
                size="md"
                className="bg-white"
                value={searchTerm}
                onChange={(e) => handleSearchInput(e)}
              />
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-scroll p-4">
          {pagination.isLoading ? (
            <Loading />
          ) : (
            <table className="w-full min-w-max table-auto rounded-md text-left">
              <thead>
                <tr>
                  {reversedThead.map((head, index) => (
                    <th
                      key={head}
                      className={`bg-tableHeaderBg p-4 ${
                        index === 0 ? "rounded-tl-md rounded-bl-md" : ""
                      } ${
                        index === reversedThead.length - 1
                          ? "rounded-tr-md rounded-br-md"
                          : ""
                      }`}
                    >
                      <Typography
                        variant="small"
                        color="black"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {settingData.map((setting) => {
                  const columns = [
                    {
                      key: "setting_name",
                      value: (
                        <>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {setting.setting_name}
                          </Typography>
                        </>
                      ),
                      className: "p-4",
                    },
                    {
                      key: "setting_value1",
                      value: (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal max-w-[500px]"
                        >
                          {setting.setting_value1}
                        </Typography>
                      ),
                      className: "p-4",
                    },
                    {
                      key: "setting_value2",
                      value: (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal max-w-[500px]"
                        >
                          {setting.setting_value2 || "None"}
                        </Typography>
                      ),
                      className: "p-4",
                    },
                    {
                      key: "actions",
                      value: (
                        <Tooltip content="Edit Setting">
                          <IconButton
                            variant="text"
                            onClick={() =>
                              handleEditOpen(
                                setting.setting_id,
                                setting.setting_name
                              )
                            }
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      ),
                      className: "p-4",
                    },
                  ];

                  const displayColumns = isColumnReversed
                    ? (() => {
                        const reversedCol = [
                          columns[columns.length - 1],
                          ...columns.slice(0, -1),
                        ];
                        return reversedCol;
                      })()
                    : columns;

                  return (
                    <tr
                      key={setting.setting_id}
                      className="border-b border-gray-300 hover:bg-gray-100"
                    >
                      {displayColumns.map((col) => (
                        <td key={col.key} className={col.className}>
                          {col.value}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>

        <CardFooter className="">
          <Pagination
            currentPage={pagination.page}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) => handlePageChange(newPage)}
            isLoading={pagination.isLoading}
            onPageSizeChange={(newSize) => handlePageSizeChange(newSize)}
          />
        </CardFooter>
      </Card>

      {/* Dialog Boxes */}
      <AddSetting
        open={open}
        handleOpen={handleOpen}
        fetchSettings={fetchSettings}
      />

      <EditSetting
        editOpen={editOpen}
        editHandleOpen={handleEditOpen}
        settingId={selectedSettingId}
        settingName={selectedSettingName}
        fetchSettings={fetchSettings}
      />
    </>
  );
};

export default settings;
