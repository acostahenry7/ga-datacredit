function loginApi(loginData: any) {
  //@ts-ignore
  return fetch(`${process.env.REACT_APP_AUTH_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => err);
}

export { loginApi };
