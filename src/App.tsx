import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { login } from "./api/services";

type FormField = {
  value: string;
  error?: string;
};

interface LoginForm {
  username: FormField;
  password: FormField;
}

function App() {
  const [form, setForm] = useState<LoginForm>({
    username: { value: "" },
    password: { value: "" },
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem(`access-token`, data.accessToken)
      localStorage.setItem(`refresh-token`, data.refreshToken)
    },
  });

  const handleValidation = (key: keyof LoginForm, value: string) => {
    switch (key) {
      case "username":
        if (!value) return "Username is required!";
        break;
      case "password":
        if (!value) return "Password is required!";
        if (value.length < 8) return "Password must have 8 characters.";
        break;

      default:
        break;
    }
  };

  const handleFormChange = (key: keyof LoginForm, input: HTMLInputElement) => {
    const errors = handleValidation(key, input.value);
    setForm((prev) => {
      return {
        ...prev,
        [key]: { value: input.value, error: errors },
      };
    });
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Object.values(form).some((value) => value.error))
      alert("Form has invalid values");
    else {
      loginMutation.mutate(
        JSON.stringify({ username: form.username.value, password: form.password.value }),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        You can use any user's credentials from{" "}
        <a target="_blank" href="https://dummyjson.com/users">dummyjson.com/users</a>. Tokens are returned in the
        response and set as cookies.
      </p>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="username"
          placeholder="username"
          onChange={(e) => handleFormChange("username", e.target)}
        />
        {form.username?.error && (
          <p style={{ color: "red" }}>{form.username.error}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          autoComplete="password"
          type="password"
          placeholder="password"
          onChange={(e) => handleFormChange("password", e.target)}
        />
        {form.password?.error && (
          <p style={{ color: "red" }}>{form.password.error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={
          Object.values(form).some(
            (field: FormField) => !field.value || field.error,
          ) || loginMutation.isPending
        }
      >
        Login
      </button>
      {loginMutation.isError && <p>{loginMutation.error.message}</p>}
    </form>
  );
}

export default App;
