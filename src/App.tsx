import { useState } from "react";

type FormField = {
  value: string;
  error?: string;
};

interface LoginForm {
  email: FormField;
  password: FormField;
}

function App() {
  const [form, setForm] = useState<LoginForm>({
    email: { value: "" },
    password: { value: "" },
  });

  const handleValidation = (key: keyof LoginForm, value: string) => {
    switch (key) {
      case "email":
        if (!value) return "Email is required!";
        if (value.indexOf("@") === -1) return "Email must be valid.";
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
    else alert("Submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder="email"
          onChange={(e) => handleFormChange("email", e.target)}
        />
        {form.email?.error && (
          <p style={{ color: "red" }}>{form.email.error}</p>
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
        disabled={Object.values(form).some(
          (field: FormField) => !field.value || field.error,
        )}
      >
        Login
      </button>
    </form>
  );
}

export default App;
