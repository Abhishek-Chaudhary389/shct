/**
 * Utility to upload images directly to ImageKit from client-side using basic auth header
 */
export const uploadToImageKit = async (fileOrBase64, fileName = "shct_upload.jpg") => {
  try {
    const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
    const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
    const authHeader = "Basic " + btoa(privateKey + ":");

    const formData = new FormData();
    
    // ImageKit accepts binary files, blobs, or Base64 strings (with or without data URL prefix)
    formData.append("file", fileOrBase64);
    formData.append("fileName", fileName);
    formData.append("useUniqueFileName", "true");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ImageKit Upload Error: ${errText}`);
    }

    const data = await response.json();
    console.log("Successfully uploaded to ImageKit. CDN Url:", data.url);
    return data.url;
  } catch (error) {
    console.error("Error in uploadToImageKit:", error);
    throw error;
  }
};
