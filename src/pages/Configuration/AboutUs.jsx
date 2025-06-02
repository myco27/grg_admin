import React, { useEffect, useState } from "react";
import TextEditor from "../../components/Editor/TextEditor";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import axiosClient from "../../axiosClient";
import Loading from "../../components/layout/Loading";
import { useAlert } from "../../contexts/alertContext";

function AboutUs() {
  const [_content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("admin/config/about_us");
      setContent(response.data.content);
    } catch (e) {
      console.error(e.error);
    } finally {
      setLoading(false);
    }
  };

  const saveTerms = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.post("admin/config/about_us", {
        content: _content,
      });
      console.log(response.data);
    } catch (e) {
      console.error(e.response?.data || e.message);
    } finally {
      showAlert("Succesfully Saved!", "success");
      fetchTerms();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <Card className="h-full w-full rounded-none shadow-none">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography className="text-black" variant="h3">
          About Us
        </Typography>
      </CardHeader>
      {loading ? (
        <Loading />
      ) : (
        <CardBody className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
          <div className="relative h-[70vh] overflow-y-auto rounded">
            <TextEditor
              value={_content}
              onChange={(e) => setContent(e)}
            ></TextEditor>
          </div>
        </CardBody>
      )}
      <CardFooter className="flex justify-end">
        <Button className="sticky bg-primary" onClick={saveTerms}>
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AboutUs;
