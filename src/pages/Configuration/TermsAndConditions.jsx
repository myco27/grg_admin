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

function TermsAndConditions() {
  const [_content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("admin/terms-and-conditions/term");
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
      const response = await axiosClient.post(
        "admin/terms-and-conditions/saveTerm",
        { content: _content }
      );
      console.log(response.data);
    } catch (e) {
      console.error(e.response?.data || e.message);
    } finally {
      fetchTerms()
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
          Terms and Conditions
        </Typography>
      </CardHeader>
      {loading?<Loading/>:<CardBody className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
        <TextEditor
          value={_content}
          onChange={(e) => setContent(e)}
        ></TextEditor>
      </CardBody>}
      <CardFooter>
        <Button className="sticky" onClick={saveTerms}>
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

export default TermsAndConditions;
