import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
});

export const generateImageToken = (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.status(200).json(authParams);
  } catch (error) {
    console.error("Error generating ImageKit token:", error);
    res.status(500).json({ error: "Failed to generate ImageKit token" });
  }
};
