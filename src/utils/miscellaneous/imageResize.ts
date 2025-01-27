import sharp from "sharp";

const resizeImage = async (buffer: Buffer) => {
  const resize = await sharp(buffer)
    .resize({ width: 500, height: 500 }) // Resize by width (you can use height or both)
    .png({ quality: 90 }) // Set the output format and quality
    .toBuffer();

  return resize;
};

export default resizeImage;
