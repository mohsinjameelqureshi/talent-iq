import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    // We need Clerk ID to generate token from the getstream.io It should match with the ID we have in the stream.
    const token = chatClient.createToken(req.user.clerkId);

    res.status(200).json({
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.image,
    });
  } catch (error) {
    console.error("Error in getStreamToken Controller: ", error.message);
    res.status(500).json({ msg: "internal server error" });
  }
}
