import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "script",
  "sub",
  "super",
  "list",
  "bullet",
  "indent",
  "direction",
  "size",
  "color",
  "background",
  "font",
  "align",
  "link",
  "image",
  "video",
  "formula",
  "clean",
];

const TextEditor = ({ value = "", onChange }) => {
  return (
    <div className="overflow-y-auto rounded-md border border-gray-300 bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="min-h-[30rem] w-full break-words"
      />
    </div>
  );
};

export default TextEditor;
