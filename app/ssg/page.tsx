
async function getStaticData() {
  const res = await fetch('https://dummyjson.com/products/1');
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Page() {
  const data = await getStaticData();

  return (
    <div>
      <h1>SSG in App Router</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}