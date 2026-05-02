import { notFound } from "next/navigation";
import AddProfileForm from "@/components/AddProfileForm";
import prisma from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EditProfilePage({ params }) {
  const { id } = await params;
  const profileId = Number(id);

  if (!profileId) {
    notFound();
  }

  const profile = await prisma.profiles.findUnique({
    where: { id: profileId },
  });

  if (!profile) {
    notFound();
  }

  const plainProfile = {
    id: profile.id,
    name: profile.name,
    title: profile.title,
    email: profile.email,
    bio: profile.bio,
    image_url: profile.image_url,
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <AddProfileForm existingProfile={plainProfile} />
    </div>
  );
}