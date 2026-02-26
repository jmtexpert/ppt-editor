// app/page.js (Ya aapka jo bhi file name hai)

export default async function Page() {
  // Fetch data directly inside the component
  const res = await fetch(`https://dummyjson.com/products/1`, {
    cache: 'no-store' // Yeh 'no-store' ise SSR banata hai (har request pe fetch karega)
  });
  
  const data = await res.json();
  console.log(data); // Yeh terminal/server log mein dikhega

  return (
    <div>
      <h1>SSR in App Router</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}