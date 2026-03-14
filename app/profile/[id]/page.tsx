async function getUser(id: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return res.json();
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);

  return (
    <main>
      <h1>{user.name}</h1>

      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>
    </main>
  );
}