import styles from "./page.module.css";
import Link from "next/link";
import Filters from "@/components/Filters";
import prisma from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    title?: string;
    search?: string;
  }>;
};

type ProfileCard = {
  id: number;
  name: string;
  title: string;
  email: string;
  image_url?: string | null;
};

async function fetchTitles(): Promise<string[]> {
  const data = await prisma.profiles.findMany({
    distinct: ["title"],
    select: { title: true },
  });

  return data.map((item: { title: string }) => item.title);
}

async function getData({
  title,
  search,
}: {
  title: string;
  search: string;
}): Promise<ProfileCard[]> {
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

  return profiles;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const selectedTitle = params?.title || "";
  const search = params?.search || "";

  const [titles, profiles] = await Promise.all([
    fetchTitles(),
    getData({ title: selectedTitle, search }),
  ]);

  return (
    <main className={styles.main}>
      <div className="section">
        <div className="container">
          <h1>Profile App</h1>

          <Filters titles={titles} title={selectedTitle} search={search} />

          <Link href="/add-profile" className={styles.addLink}>
            + Add Profile
          </Link>

          {profiles.length === 0 ? (
            <p>No profiles found.</p>
          ) : (
            <div className="grid">
              {profiles.map((profile) => (
                <Link key={profile.id} href={`/profile/${profile.id}`}>
                  <div className={styles["profile-card"]}>
                    <div className={styles["profile-card__image"]}>
                      <img
                        src={profile.image_url || "/vercel.svg"}
                        alt={profile.name}
                      />
                    </div>

                    <div className={styles["profile-card__content"]}>
                      <p>{profile.name}</p>
                      <p>{profile.title}</p>
                      <p>{profile.email}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}