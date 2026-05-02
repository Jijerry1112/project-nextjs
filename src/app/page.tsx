import styles from "./page.module.css";
import Link from "next/link";
import prisma from "@/app/lib/prisma";

export const runtime = "nodejs";

// 获取所有 title（用于 filter dropdown）
async function fetchTitles() {
  const data = await prisma.profiles.findMany({
    distinct: ["title"],
    select: { title: true },
  });
  return data ? data.map((t) => t.title) : [];
}

// 获取 profiles（带 filter）
async function getData({ title, search }) {
  const profiles = await prisma.profiles.findMany({
    where: {
      ...(title && {
        title: { contains: title, mode: "insensitive" },
      }),
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    },
  });

  return profiles;
}

export default async function Home({ searchParams }) {
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

          <form style={{ marginBottom: "10px" }}>
            <input
              name="search"
              placeholder="Search name"
              defaultValue={search}
            />

            <input
              name="title"
              placeholder="Title"
              defaultValue={selectedTitle}
            />

            <button type="submit">Filter</button>
          </form>

          <Link href="/add">+ Add Profile</Link>

          {profiles.length === 0 ? (
            <p>No profiles found.</p>
          ) : (
            <div className="grid">
              {profiles.map((profile) => (
                <Link key={profile.id} href={`/profile/${profile.id}`}>
                  <div className={styles["profile-card"]}>
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