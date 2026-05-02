import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import prisma from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProfileDetailPage({ params }) {
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

  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "24px",
          fontWeight: "600",
        }}
      >
        ← Back to Home
      </Link>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e5e5",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <img
          src={profile.image_url}
          alt={profile.name}
          style={{
            width: "260px",
            height: "260px",
            objectFit: "cover",
            borderRadius: "50%",
            display: "block",
            margin: "0 auto 24px",
            border: "4px solid #f2f2f2",
          }}
        />

        <h1
          style={{
            marginBottom: "20px",
            fontSize: "2rem",
          }}
        >
          {profile.name}
        </h1>

        <div
          style={{
            textAlign: "left",
            maxWidth: "460px",
            margin: "0 auto",
            lineHeight: "1.7",
            fontSize: "1.05rem",
          }}
        >
          <p>
            <strong>Title:</strong> {profile.title}
          </p>

          <p>
            <strong>Email:</strong> {profile.email}
          </p>

          <p>
            <strong>Bio:</strong> {profile.bio}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "14px",
            marginTop: "28px",
          }}
        >
          <Link
            href={`/profile/${profile.id}/edit`}
            style={{
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: "#5f66ff",
              color: "white",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Edit Profile
          </Link>

          <DeleteButton id={profile.id} />
        </div>
      </div>
    </div>
  );
}