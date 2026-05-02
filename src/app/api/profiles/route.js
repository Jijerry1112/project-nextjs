import prisma from "@/app/lib/prisma";
import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get("title") || "";
    const search = searchParams.get("search") || "";

    const profiles = await prisma.profiles.findMany({
      where: {
        ...(title && {
          title: { contains: title, mode: "insensitive" },
        }),
        ...(search && {
          name: { contains: search, mode: "insensitive" },
        }),
      },
      orderBy: {
        id: "desc",
      },
    });

    return Response.json({ data: profiles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return Response.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return Response.json(
        {
          error:
            "Missing BLOB_READ_WRITE_TOKEN. Please set up Vercel Blob and add the token to .env.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const title = formData.get("title");
    const email = formData.get("email");
    const bio = formData.get("bio");
    const imgFile = formData.get("img");

    if (!name || name.trim() === "") {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    if (!title || title.trim() === "") {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    if (!email || email.trim() === "" || !email.includes("@")) {
      return Response.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!bio || bio.trim() === "") {
      return Response.json({ error: "Bio is required" }, { status: 400 });
    }

    if (!imgFile || imgFile.size === 0) {
      return Response.json({ error: "Image is required" }, { status: 400 });
    }

    if (imgFile.size > 1024 * 1024) {
      return Response.json(
        { error: "Image must be less than 1MB" },
        { status: 400 }
      );
    }

    const safeFileName = imgFile.name.replace(/\s+/g, "-");
    const blobPath = `profiles/${Date.now()}-${safeFileName}`;

    const blob = await put(blobPath, imgFile, {
      access: "public",
      allowOverwrite: false,
    });

    const created = await prisma.profiles.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        bio: bio.trim(),
        image_url: blob.url,
      },
    });

    return Response.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);

    if (error?.code === "P2002") {
      return Response.json(
        { error: "Email already exists. Please use a different email." },
        { status: 409 }
      );
    }

    return Response.json(
      { error: error?.message || "Failed to create profile" },
      { status: 500 }
    );
  }
}