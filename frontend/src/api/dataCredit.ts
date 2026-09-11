async function getDatacreditApi(schema: string) {
  //@ts-ignore
  const baseUrl = process.env.REACT_APP_API;

  const res = await fetch(
    `${baseUrl}/test-db?schema=${encodeURIComponent(schema)}`,
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? `Error en la consulta (${res.status})`);
  }

  return data;
}

export { getDatacreditApi };
