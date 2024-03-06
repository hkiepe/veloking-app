import { json, redirect } from "react-router-dom";
import AuthForm from "../components/Login/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: `Mode "${mode}" unsupported.` }, { status: 422 });
  }

  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch("https://skywalker.inkontor.com/user/" + mode, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Could not authenticat user." }, { status: 500 });
  }

  const resData = await response.json();
  const token = resData.access_token;

  localStorage.setItem("token", token);

  return redirect("/");
}
