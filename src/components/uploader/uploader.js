import { forwardRef, useState, useRef, useImperativeHandle } from "react";
import {
  Upload as AntUpload,
  Button,
  message as AntMessage,
  Progress,
} from "antd";
import { ThumbnailIcon, UploadIcon, CancelUploadIcon } from "../../svg";
import { getBase64 } from "./utils";

import "./uploader.scss";

const { Dragger } = AntUpload;

const Uploader = forwardRef((props, ref) => {
  const {
    userID,
    message,
    setMessages,
    setLoading,
    setSampleImages,
    setChat,
    updateChat,
  } = props;

  const uploadInstanceRef = useRef();

  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploading, setUploading] = useState(false);

  const customUpload = async ({ file, onSuccess, onError, onProgress }) => {
    setSampleImages(true);
    setLoading(true);
    setUploading(true);
    setUploadPercent(0);

    try {
      const base64 = await getBase64(file);

      // Simulated progress (optional)
      let simulatedPercent = 0;
      const interval = setInterval(() => {
        simulatedPercent += 10;
        setUploadPercent(simulatedPercent);
        if (onProgress) {
          onProgress({ percent: simulatedPercent });
        }
        if (simulatedPercent >= 90) clearInterval(interval);
      }, 100);

      const payload = {
        user_id: userID,
        message,
        image: [base64],
      };

      updateChat(
        [
          { type: "text", content: message },
          { type: "image", content: [base64] },
        ],
        "api"
      );

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      clearInterval(interval);
      setUploadPercent(100);

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      const finalMessages = [];

      onSuccess("ok");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line) {
            try {
              const parsed = JSON.parse(line);
              finalMessages.push({
                type: parsed.type,
                content: parsed.content,
              });
            } catch (err) {
              console.error("Failed to parse JSON:", line, err);
            }
          }
        }
      }

      // Only update messages after complete stream
      setMessages((prev) => [...prev, ...finalMessages]);
    } catch (error) {
      onError(error);
      AntMessage.error(`${file.name} upload failed.`);
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    className: "custom-file-uploader",
    customRequest: customUpload,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const triggerUploadWithFile = (file) => {
    const uploadOptions = {
      file,
      onSuccess: () => {},
      onError: () => {},
      onProgress: () => {},
    };

    uploadProps.customRequest(uploadOptions);
  };

  useImperativeHandle(ref, () => ({
    triggerSampleUpload: async (imageURL) => {
      try {
        const response = await fetch(imageURL);
        const blob = await response.blob();
        const fileName = imageURL.split("/").pop(); // extract file name from URL
        const file = new File([blob], fileName || "sample-image.png", {
          type: blob.type,
        });
        triggerUploadWithFile(file);
      } catch (error) {
        console.error("Failed to load sample image", error);
      }
    },
  }));

  return (
    <div ref={uploadInstanceRef}>
      <Dragger {...uploadProps}>
        {uploading ? (
          <section className="uploader-loading-container">
            <Progress
              type={"circle"}
              percent={uploadPercent}
              status="active"
              size={[56, 56]}
            />

            <p className="ant-upload-text">Uploading scan image. . .</p>

            <Button
              className="uploader-cancel-button"
              icon={<CancelUploadIcon />}
              style={{ width: 200, height: 36 }}
            >
              Cancel uploading
            </Button>
          </section>
        ) : (
          <>
            <p className="ant-upload-drag-icon">
              <ThumbnailIcon />
            </p>
            <p className="ant-upload-text">Drag & drop or click to upload</p>
            <p className="ant-upload-hint">
              Upload your medical scan for{" "}
              <span className="highlighted-text">AI analysis</span>
            </p>

            <Button
              className="uploader-custom-button"
              icon={<UploadIcon />}
              style={{ width: 200, height: 36 }}
            >
              Upload scan image
            </Button>
          </>
        )}
      </Dragger>
    </div>
  );
});

// const Uploader = (props) => {
//   const {
//     userID,
//     message,
//     setMessages,
//     setLoading,
//     setSampleImages,
//     setChat,
//     updateChat,
//   } = props;
//   const [uploadPercent, setUploadPercent] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   const customUpload = async ({ file, onSuccess, onError, onProgress }) => {
//     setSampleImages(true);
//     setLoading(true);
//     setUploading(true);
//     setUploadPercent(0);

//     try {
//       const base64 = await getBase64(file);

//       // Simulate progress for base64 conversion (optional)
//       let simulatedPercent = 0;
//       const interval = setInterval(() => {
//         simulatedPercent += 10;
//         setUploadPercent(simulatedPercent);
//         if (onProgress) {
//           onProgress({ percent: simulatedPercent });
//         }
//         if (simulatedPercent >= 90) clearInterval(interval);
//       }, 100);

//       const payload = {
//         user_id: userID,
//         message,
//         image: [base64],
//       };

//       updateChat(
//         [
//           {
//             type: "text",
//             content: message,
//           },
//           {
//             type: "image",
//             content: [base64],
//           },
//         ],
//         "api"
//       );

//       const response = await fetch("/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       clearInterval(interval); // Stop fake progress
//       setUploadPercent(100);
//       if (!response.ok || !response.body) {
//         throw new Error("Failed to connect to stream");
//       }

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let buffer = "";
//       onSuccess("ok");

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });

//         const lines = buffer.split("\n");
//         buffer = lines.pop();

//         for (let line of lines) {
//           if (line.trim()) {
//             try {
//               const parsed = JSON.parse(line);
//               setMessages((prev) => [
//                 ...prev,
//                 { type: parsed.type, content: parsed.content },
//               ]);
//             } catch (err) {
//               console.error("Failed to parse line", line, err);
//             }
//           }
//         }
//       }
//     } catch (error) {
//       onError(error);
//       AntMessage.error(`${file.name} upload failed.`);
//     } finally {
//       setUploading(false);
//       setLoading(false);
//     }
//   };

//   const uploadProps = {
//     name: "file",
//     multiple: false,
//     className: "custom-file-uploader",
//     customRequest: customUpload,
//     onDrop(e) {
//       console.log("Dropped files", e.dataTransfer.files);
//     },
//   };

//   return (
//     <div>
//       <Dragger {...uploadProps}>
//         {uploading ? (
//           <section className="uploader-loading-container">
//             <Progress
//               type={"circle"}
//               percent={uploadPercent}
//               status="active"
//               size={[56, 56]}
//             />

//             <p className="ant-upload-text">Uploading scan image. . .</p>

//             <Button
//               className="uploader-cancel-button"
//               icon={<CancelUploadIcon />}
//               style={{ width: 200, height: 36 }}
//             >
//               Cancel uploading
//             </Button>
//           </section>
//         ) : (
//           <>
//             <p className="ant-upload-drag-icon">
//               <ThumbnailIcon />
//             </p>
//             <p className="ant-upload-text">Drag & drop or click to upload</p>
//             <p className="ant-upload-hint">
//               Upload your medical scan for{" "}
//               <span className="highlighted-text">AI analysis</span>
//             </p>

//             <Button
//               className="uploader-custom-button"
//               icon={<UploadIcon />}
//               style={{ width: 200, height: 36 }}
//             >
//               Upload scan image
//             </Button>
//           </>
//         )}
//       </Dragger>
//     </div>
//   );
// };

export default Uploader;
