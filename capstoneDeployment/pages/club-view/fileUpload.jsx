import React from "react";
import { useMutation, gql } from "@apollo/client";

const UPLOAD_FILE = gql`
mutation UploadFile($file: Upload!) {
  uploadFile(file: $file)
}
`;

const FileUPload = () => {
      const [fileUpload] = useMutation(UPLOAD_FILE, {
          onCompleted: (data) => console.log(data),
      });
      const handleFileChange = (e) => {
        const file = e.target.files;
        if (!file) return;
        fileUpload({ variables: { file } });
      };
   return (
   <>
    <input
      type="file"
      name="GraphQLUploadForMedium"
      onChange={handleFileChange}
    />
  </>
 );
};
export default FileUPload;