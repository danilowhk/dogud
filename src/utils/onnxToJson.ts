export const onnxToTxt = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return base64;
};
