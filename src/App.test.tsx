import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe(`login form tests`, () => {
  it(`renders login form`, () => {
    render(<App />);
    const login = screen.getByRole(`textbox`, { name: /email/i });
    const password = screen.getByLabelText(/password/i);

    expect(login).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });

  it(`disables the submit button when form is incomplete or invalid`, async () => {
    render(<App />);
    const login = screen.getByRole(`textbox`, { name: /email/i });
    const password = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole(`button`, { name: /login/i });

    expect(submitButton).toBeDisabled();
    await userEvent.type(login, "test");
    expect(submitButton).toBeDisabled();
    await userEvent.clear(login);
    await userEvent.type(login, "test@test.com");
    expect(submitButton).toBeDisabled();
    await userEvent.type(password, "1234");
    await userEvent.clear(password);
    expect(submitButton).toBeDisabled();
    await userEvent.type(password, "12345678");

    expect(submitButton).toBeEnabled();
  });

  it(`should show error message when fields have validation error`, async () => {
    render(<App />);
    const login = screen.getByRole(`textbox`, { name: /email/i });
    const password = screen.getByLabelText(/password/i);

    await userEvent.type(login, "test");
    expect(screen.getByText(/email must be valid/i)).toBeInTheDocument();
    await userEvent.clear(login);
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    await userEvent.type(login, "test@test.com");
    expect(login).toBeValid();

    await userEvent.type(password, "1234");
    expect(
      screen.getByText(/password must have 8 characters/i),
    ).toBeInTheDocument();
    await userEvent.clear(password);
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    await userEvent.type(password, "12345678");
    expect(password).toBeValid();
  });
});
