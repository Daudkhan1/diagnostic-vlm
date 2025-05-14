export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String =
        reader.result.split("data:image/tiff;base64,")[1] ||
        reader.result.split("data:image/png;base64,")[1] ||
        reader.result;
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
