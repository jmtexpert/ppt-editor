
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
    <main>
      <h1>SSG Page (Cached)</h1>
      <p>Product Name: {data.title}</p>
      <p>Price: ${data.price}</p>
    </main>
  );
}