import { useEffect, useState } from "react";
import axios from "../../axiosClient";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";
import Loading from "../../components/layout/Loading";
import DatePicker from "../../components/OrdersPage/DatePicker";
import { useAlert } from "../../contexts/alertContext";
import { meta } from "@eslint/js";
import axiosClient from "../../axiosClient";
import { X } from "lucide-react";

const EditInvoiceDialogBox = ({
  editOpen,
  editHandleOpen,
  fetchData,
  selectedId,
}) => {
  const [formData, setFormData] = useState({
    company: "",
    category: "",
    sst_number: "",
    petty_type: "",
    sst_rate: "",
    store_reference_no: "",
    delivery_order_no: "",
    invoice_date: "",
    price: "",
    total_price_inclusive: "",
    confirm_price: "",
    confirm_total_price: "",
    payment_status: "",
    notes: "",
    is_voucher: "",
    tax_code: "",
    zreport_date: "",
    shift_type: "",
    invoice_files: [], // was: null
    attachments: [],
  });
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState([]);

  useEffect(() => {
    if (editOpen) {
      setRemovedAttachmentIds([]);
      setLoading(true);
      fetchDetails();
      fetchCompanyCategory().finally(() => setLoading(false));
    }
  }, [editOpen]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/admin/invoice/details/${selectedId}`);
      const data = response.data.data;

      setFormData({
        company: String(data.company?.company_id) || "",
        category: String(data.invoice_category?.invoice_category_id) || "",
        sst_number: data.sst_number || "",
        petty_type: data.petty_type || "",
        sst_rate: data.sst_rate || "",
        store_reference_no: data.store_reference_no || "",
        delivery_order_no: data.delivery_order_no || "",
        invoice_date: data.invoice_date || "",
        price: data.price || "",
        total_price_inclusive: data.total_price_inclusive || "",
        confirm_price: String(data.confirm_price) || "",
        confirm_total_price: String(data.confirm_total_price) || "",
        payment_status: data.payment_status || "",
        notes: data.notes || "",
        is_voucher: String(data.is_voucher) || "",
        tax_code: data.tax_code || "",
        zreport_date: data.zreport_date || "",
        shift_type: data.shift_type || "",
        invoice_files: null,
        attachments: data.attachments || [],
      });
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyCategory = async () => {
    try {
      const response = await axios.get("/admin/invoice/company/category");
      setCompanies(response.data.companyData);
      setCategories(response.data.categoryData);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "invoice_files" && value) {
          value.forEach((file) => {
            formDataToSend.append("invoice_files[]", file);
          });
        } else if (key !== "attachments") {
          formDataToSend.append(key, value);
        }
      });

      if (removedAttachmentIds.length > 0) {
        removedAttachmentIds.forEach((id) => {
          formDataToSend.append("removed_attachments[]", id);
        });
      }

      const response = await axiosClient.post(
        `/admin/invoice/update/${selectedId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchData();
      editHandleOpen();
      showAlert("Invoice updated successfully!", "success");
    } catch (error) {
      if (error.response?.data?.errors) {
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

  //   Event Listeners
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (
        (name === "confirm_price" || name === "confirm_total_price") &&
        value === "0"
      ) {
        updated[name] = "";
        showAlert(
          `You selected NO for ${
            name === "confirm_price" ? "Confirm Price" : "Confirm Total Price"
          }. Please double-check.`,
          "warning"
        );
      }

      if (name === "petty_type" && value === "Without SST") {
        updated.sst_rate = "";
      }

      return updated;
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        invoice_files: [...(prev.invoice_files ?? []), ...files],
      }));

      e.target.value = "";
    }
  };

  const handleRemoveAttachment = (idToRemove) => {
    setRemovedAttachmentIds((prev) => [...prev, idToRemove]);
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((file) => file.id !== idToRemove),
    }));
  };

  return (
    <Dialog
      open={editOpen}
      handler={editHandleOpen}
      dismiss={{ outsidePress: false }}
    >
      <DialogHeader>Edit Invoice</DialogHeader>
      <DialogBody
        divider
        className="flex flex-col gap-4 max-h-[75dvh] overflow-y-scroll"
      >
        {loading ||
        submitting ||
        companies.length === 0 ||
        categories.length === 0 ? (
          <Loading />
        ) : (
          <>
            <Select
              className="w-full py-5"
              value={String(formData.company)}
              label="Assign Company"
              onChange={(value) => handleSelectChange("company", value)}
            >
              {companies.map((data) => (
                <Option key={data.company_id} value={String(data.company_id)}>
                  {data.name.toUpperCase()}
                </Option>
              ))}
            </Select>

            <Select
              className="w-full py-5"
              value={String(formData.category)}
              label="Assign Category"
              onChange={(value) => handleSelectChange("category", value)}
            >
              {categories.map((data) => (
                <Option
                  key={data.invoice_category_id}
                  value={String(data.invoice_category_id)}
                >
                  {data.name.toUpperCase()}
                </Option>
              ))}
            </Select>

            <Input
              className="w-full py-5"
              label="SST Number"
              name="sst_number"
              value={formData.sst_number}
              onChange={handleInputChange}
            />

            <Select
              className="w-full py-5"
              value={formData.petty_type}
              label="Petty Type"
              onChange={(value) => handleSelectChange("petty_type", value)}
            >
              <Option value="With SST">WITH SST</Option>
              <Option value="Without SST">WITHOUT SST</Option>
            </Select>

            {formData.petty_type === "With SST" && (
              <Input
                className="w-full py-5"
                label="SST Rate (%)"
                name="sst_rate"
                value={formData.sst_rate}
                onChange={handleInputChange}
              />
            )}

            <Input
              className="w-full py-5"
              label="Store Reference No."
              name="store_reference_no"
              value={formData.store_reference_no}
              onChange={handleInputChange}
            />
            <Input
              className="w-full py-5"
              label="Delivery Order No."
              name="delivery_order_no"
              value={formData.delivery_order_no}
              onChange={handleInputChange}
            />

            <DatePicker
              className="w-full py-5"
              name="invoice_date"
              selected={formData.invoice_date}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, invoice_date: date }))
              }
              placeholder="Invoice Date"
            />

            <div className="flex flex-col md:flex-row gap-4">
              <Input
                className="w-full py-5"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
              <Select
                className="w-full py-5"
                value={formData.confirm_price}
                label="Confirm Price"
                onChange={(value) => handleSelectChange("confirm_price", value)}
              >
                <Option value="1">YES</Option>
                <Option value="0">NO</Option>
              </Select>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Input
                label="Total Price (Incl. SST)"
                name="total_price_inclusive"
                value={formData.total_price_inclusive}
                onChange={handleInputChange}
              />
              <Select
                value={formData.confirm_total_price}
                label="Confirm Total Price"
                onChange={(value) =>
                  handleSelectChange("confirm_total_price", value)
                }
              >
                <Option value="1">YES</Option>
                <Option value="0">NO</Option>
              </Select>
            </div>

            <Select
              className="w-full py-5"
              value={formData.payment_status}
              label="Payment Status"
              onChange={(value) => handleSelectChange("payment_status", value)}
            >
              <Option value="Paid">PAID</Option>
              <Option value="Partial">PARTIAL</Option>
              <Option value="Unpaid">UNPAID</Option>
            </Select>

            <Input
              className="w-full py-5"
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
            />

            <Select
              className="w-full py-5"
              value={formData.is_voucher}
              label="Is Voucher"
              onChange={(value) => handleSelectChange("is_voucher", value)}
            >
              <Option value="1">YES</Option>
              <Option value="0">NO</Option>
            </Select>

            <Input
              className="w-full py-5"
              label="Tax Code"
              name="tax_code"
              value={formData.tax_code}
              onChange={handleInputChange}
            />

            <DatePicker
              className="w-full py-5"
              name="zreport_date"
              selected={formData.zreport_date}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, zreport_date: date }))
              }
              placeholder="Z-Report Date"
            />

            <Select
              className="w-full py-5"
              value={formData.shift_type}
              label="Shift Type"
              onChange={(value) => handleSelectChange("shift_type", value)}
            >
              <Option value="Morning">MORNING</Option>
              <Option value="Evening">EVENING</Option>
            </Select>

            <div className="space-y-2">
              <Typography variant="small" className="font-semibold">
                Attachments:
              </Typography>

              {formData.attachments.map((file, idx) => (
                <div
                  key={`existing-${file.id}`}
                  className="flex items-center justify-between bg-green-100 rounded p-2 w-full"
                >
                  <a
                    href={`${import.meta.env.VITE_APP_IMAGE_PATH}${
                      file.file_path
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    {file.file_path.split("/").pop()}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(file.id)}
                    className="text-red-500 hover:underline"
                  >
                    <X />
                  </button>
                </div>
              ))}

              {(formData.invoice_files ?? []).map((file, idx) => (
                <div
                  key={`new-${idx}`}
                  className="flex items-center justify-between bg-green-100 rounded p-2 w-full"
                >
                  <span className="text-sm text-gray-800">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => {
                        const updatedFiles = [...prev.invoice_files];

                        updatedFiles.splice(idx, 1);
                        return { ...prev, invoice_files: updatedFiles };
                      });
                    }}
                    className="text-red-500 hover:underline"
                  >
                    <X />
                  </button>
                </div>
              ))}

              <label className="text-md text-blue-500 underline cursor-pointer block w-fit">
                + Add Attachment
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
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

export default EditInvoiceDialogBox;
