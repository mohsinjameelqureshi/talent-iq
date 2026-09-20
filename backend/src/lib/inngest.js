import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.model.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({
  id: "talent-iq-eng",
});

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: {
      event: "clerk/user.created",
    },
  },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImage: image_url,
    };

    await User.create(newUser);

    // saving user in stream io
    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });

    return {
      success: true,
    };
  },
);

const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
    triggers: {
      event: "clerk/user.deleted",
    },
  },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;

    await User.deleteOne({
      clerkId: id,
    });

    // deleting user from stream io
    await deleteStreamUser(id.toString());

    return {
      success: true,
    };
  },
);

export const functions = [syncUser, deleteUserFromDB];
