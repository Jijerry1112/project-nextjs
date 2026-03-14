import Link from "next/link";

async function getProfiles() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json();
}

export default async function Home() {
  const profiles = await getProfiles();

  return (
    <main>
      <h1>User Profiles</h1>

      <ul>
        {profiles.map((user: any) => (
          <li key={user.id}>
            <Link href={`/profile/${user.id}`}>
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}