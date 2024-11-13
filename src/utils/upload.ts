import { generateId } from "@designcombo/timeline";

const BASE_URL = "https://transcribe.designcombo.dev/presigned-url";

interface IUploadDetails {
  uploadUrl: string;
  url: string;
  name: string;
  id: string;
}
export const createUploadsDetails = async (
  fileName: string,
): Promise<IUploadDetails> => {
  const currentFormat = fileName.split(".").pop();
  const uniqueFileName = `${generateId()}`;
  const updatedFileName = `${uniqueFileName}.${currentFormat}`;
  const response = await fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({ fileName: updatedFileName }),
  });

  const data = await response.json();
  return {
    uploadUrl: data.presigned_url as string,
    url: data.url as string,
    name: updatedFileName,
    id: uniqueFileName,
  };
};
