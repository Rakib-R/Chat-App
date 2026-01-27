
import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";

import { IncomingHttpHeaders } from "http";
import { NextResponse } from "next/server";
import { createClerkClient } from '@clerk/nextjs/server'


import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.actions";
import { fetchUser, updateUser } from "@/lib/actions/user.actions";

type EventType =
  | "organization.created"
  | "organization.updated"
  | "organization.deleted"
  | "organizationInvitation.created"
  | "organizationMembership.created"
  | "user.created"
  | "organizationInvitation.accepted"
  | "organizationMembership.deleted"
  | "organizationMembership.updated"

type Event = {
  data: Record<string, string | number | Record<string, string>[]>;
  object: "event";
  type: EventType;
};



  export const POST = async (request: Request) => {
  //const payload = await request.json(); // THIS WILL NEVER WORK BECAUSE RAAWW TEXT 
  const payloadString = await request.text(); // Get raw text
  const header = await headers();
  const heads = {
      "svix-id": header.get("svix-id"),
      "svix-timestamp": header.get("svix-timestamp"),
      "svix-signature": header.get("svix-signature"),
  };

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
  
  let evnt: Event | null = null;

  try {
    evnt = wh.verify(
      payloadString,
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;

    } catch (err) {
        return NextResponse.json({ message: err }, { status: 400 });
    }

    const eventType: EventType = evnt?.type!;

  if (eventType === "user.created") {
    
    const { id, first_name, last_name, image_url,bio, email_addresses, username } = evnt?.data;
    try {
      const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
      await clerkClient.users.updateUserMetadata(id as string, {
        publicMetadata: {
          isFirstTimeUser: true,
          onboarding: true,
        },
      });
      
    console.log(`USER CLERK ${id} tagged as first-time user`);
      await updateUser({
        userId: id as string,
        username: 'Testing by webhook BY Golly' as string,
        name: `${first_name} ${last_name || ""}`,
        image: image_url as string,
        bio : bio as string,
        path: "/profile"
      });
      console.log(`✅%cUser ${id} created/updated successfully`,'font-size:14px;color:green',username );

      return NextResponse.json({ message: "User synced" }, { status: 201 });
    } catch (err) {

      console.error("Error Syncing User: 💥", err);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  }

    if (eventType === "organization.created") {
    const { id, name, slug, image_url, created_by  } =
      evnt?.data ?? {};

    const user_created = await fetchUser(created_by);

    try {
      await createCommunity({id: id as string,
        name: name as string,
        // slug: slug as string,
        image: (image_url) as string, // Added a key 'image'
        description: "org bio",      
        createdById: user_created,
        members: [user_created]
        });

      console.log('✅%cSuccess New Organization ->', 'font-size:14px;color:darkgreen' , evnt.data )
      return NextResponse.json({ message: "User created" }, { status: 201 });
    }   
      catch (err) {
      console.log('💥',err);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

   // Listen organization deletion event
  if (eventType === "organization.deleted") {
    try {
      const { id } = evnt?.data;
      console.log("deleted", evnt?.data);

      // @ts-ignore
      await deleteCommunity(id);

      return NextResponse.json(
        { message: "Organization deleted" },
        { status: 201 }
      );
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  if (eventType === "organizationInvitation.created") {
    try {
      console.log("Invitation created", evnt?.data);

      return NextResponse.json(
        { message: "Invitation created" },
        { status: 201 }
      );
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  // Listen organization membership (member invite & accepted) creation
  if (eventType === "organizationMembership.created") {
    try {
      const { organization, public_user_data } = evnt?.data;

      // @ts-ignore
      await addMemberToCommunity(organization.id, public_user_data.user_id);

      return NextResponse.json(
        { message: "Invitation accepted" },
        { status: 201 }
      );
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  
  // Listen organization updation event
  if (eventType === "organization.updated") {
    try {

      const { id, logo_url, name, slug } = evnt?.data;
      console.log("updated", evnt?.data);

      // @ts-ignore
      await updateCommunityInfo(id, name, slug, logo_url);

      return NextResponse.json({ message: "Member removed" }, { status: 201 });
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

    // CHAT GPT TESTING 
  return NextResponse.json(
  { message: "Event received but not handled" },
  { status: 200 }
);

};