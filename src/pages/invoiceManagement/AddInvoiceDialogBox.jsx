import React, { useEffect, useState } from "react";
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
import { EyeIcon, EyeClosed } from "lucide-react";
import { useAlert } from "../../contexts/alertContext";
import Loading from "../../components/layout/Loading";
import DatePicker from "../../components/OrdersPage/DatePicker";

const AddInvoiceDialogBox = ({ open, handleOpen, fetchData }) => {
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
    invoice_image_path: null,
  });

  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (open && !submitting) {
      setLoading(true);
      setFormData({
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
        invoice_image_path: null,
      });

      fetchCompanyCategory().finally(() => setLoading(false));
    }
  }, [open]);

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

      formDataToSend.append("company", formData.company);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("sst_number", formData.sst_number);
      formDataToSend.append("petty_type", formData.petty_type);
      formDataToSend.append("sst_rate", formData.sst_rate);
      formDataToSend.append("store_reference_no", formData.store_reference_no);
      formDataToSend.append("delivery_order_no", formData.delivery_order_no);
      formDataToSend.append(
        "invoice_date",
        formData.invoice_date
          ? new Date(formData.invoice_date).toISOString()
          : ""
      );

      formDataToSend.append("price", formData.price);
      formDataToSend.append(
        "total_price_inclusive",
        formData.total_price_inclusive
      );
      formDataToSend.append("confirm_price", formData.confirm_price);
      formDataToSend.append(
        "confirm_total_price",
        formData.confirm_total_price
      );
      formDataToSend.append("payment_status", formData.payment_status);
      formDataToSend.append("notes", formData.notes);
      formDataToSend.append("is_voucher", formData.is_voucher);
      formDataToSend.append("tax_code", formData.tax_code);
      formDataToSend.append(
        "zreport_date",
        formData.zreport_date
          ? new Date(formData.zreport_date).toISOString()
          : ""
      );
      formDataToSend.append("shift_type", formData.shift_type);
      if (formData.invoice_image_path) {
        formDataToSend.append(
          "invoice_image_path",
          formData.invoice_image_path
        );
      }

      const response = await axios.post(
        "/admin/invoice/create",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchData();
      handleOpen();
      showAlert("Invoice created successfully!", "success");
    } catch (error) {
      console.log(error);
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

  // Event Listeners
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const { name } = event.target;

    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
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

      console.log(updated);

      return updated;
    });
  };

  const [value, setValue] = useState(null);
  const handleChange = (value) => {
    setValue(value);
  };

  return (
    <Dialog open={open} handler={handleOpen} dismiss={{ outsidePress: false }}>
      <DialogHeader>Add New Invoice</DialogHeader>
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
              required
              value={formData.company}
              name="company"
              label="Assign Company"
              onChange={(value) => handleSelectChange("company", value)}
            >
              {companies.map((data) => (
                <Option key={data.company_id} value={data.company_id}>
                  {data.name.toUpperCase()}
                </Option>
              ))}
            </Select>

            <Select
              className="w-full py-5"
              required
              name="category"
              label="Assign Category"
              value={formData.category}
              onChange={(value) => handleSelectChange("category", value)}
            >
              {categories.map((data) => (
                <Option
                  key={data.invoice_category_id}
                  value={data.invoice_category_id}
                >
                  {data.name.toUpperCase()}
                </Option>
              ))}
            </Select>

            <Input
              label="SST Number"
              name="sst_number"
              type="text"
              required
              value={formData.sst_number}
              onChange={handleInputChange}
            />

            <Select
              className="w-full py-5"
              name="petty_type"
              label="Petty Type"
              value={formData.petty_type}
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
                type="number"
                value={formData.sst_rate}
                onChange={handleInputChange}
                required
              />
            )}

            <Input
              className="w-full py-5"
              label="Store Reference No."
              name="store_reference_no"
              type="text"
              required
              value={formData.store_reference_no}
              onChange={handleInputChange}
            />

            <Input
              className="w-full py-5"
              label="Delivery Order No."
              name="delivery_order_no"
              type="text"
              required
              value={formData.delivery_order_no}
              onChange={handleInputChange}
            />

            <DatePicker
              className="w-full py-5"
              required
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
                type="number"
                required
                value={formData.price}
                onChange={handleInputChange}
              />
              <Select
                className="w-full py-5"
                required
                name="confirm_price"
                label="Confirm Price"
                onChange={(value) => handleSelectChange("confirm_price", value)}
              >
                <Option value="1">YES</Option>
                <Option value="0">NO</Option>
              </Select>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Input
                className="w-full py-5"
                label="Total Price (Incl. SST)"
                name="total_price_inclusive"
                type="number"
                required
                value={formData.total_price_inclusive}
                onChange={handleInputChange}
              />

              <Select
                className="w-full py-5"
                required
                name="confirm_total_price"
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
              required
              className="w-full py-5"
              name="payment_status"
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
              type="text"
              value={formData.notes}
              onChange={handleInputChange}
            />

            <Select
              className="w-full py-5"
              required
              name="is_voucher"
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
              type="text"
              required
              value={formData.tax_code}
              onChange={handleInputChange}
            />

            <DatePicker
              className="w-full py-5"
              required
              name="zreport_date"
              selected={formData.zreport_date}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, zreport_date: date }))
              }
              placeholder="Z-Report Date"
            />

            <Select
              className="w-full py-5"
              required
              name="shift_type"
              label="Shift Type"
              onChange={(value) => handleSelectChange("shift_type", value)}
            >
              <Option value="Morning">MORNING</Option>
              <Option value="Evening">EVENING</Option>
            </Select>

            <Input
              label="Invoice Image"
              name="invoice_image_path"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </>
        )}
      </DialogBody>
      <DialogFooter>
        <div className="flex justify-end gap-2">
          <Button
            variant="gradient"
            color="gray"
            onClick={handleOpen}
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

export default AddInvoiceDialogBox;
