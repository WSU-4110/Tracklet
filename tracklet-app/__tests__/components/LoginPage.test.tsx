import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "@/app/(auth)/login/page";

const reactDomMocks = vi.hoisted(() => ({
  useFormState: vi.fn(() => [{}, vi.fn()] as const),
  useFormStatus: vi.fn(() => ({ pending: false })),
}));

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return {
    ...actual,
    useFormState: reactDomMocks.useFormState,
    useFormStatus: reactDomMocks.useFormStatus,
  };
});

vi.mock("@/app/actions/auth", () => ({
  login: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reactDomMocks.useFormState.mockReturnValue([{}, vi.fn()]);
    reactDomMocks.useFormStatus.mockReturnValue({ pending: false });
  });

  it('renders the "Welcome Back" heading', () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute("type", "password");
  });

  it('renders a link to the register page with text "Create one"', () => {
    render(<LoginPage />);
    const link = screen.getByRole("link", { name: /create one/i });
    expect(link).toHaveAttribute("href", "/register");
  });

  it("displays an error message when the form state has an error", () => {
    reactDomMocks.useFormState.mockReturnValue([
      { error: "Invalid credentials" },
      vi.fn(),
    ]);
    render(<LoginPage />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });
});

describe("SubmitButton (login page)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reactDomMocks.useFormState.mockReturnValue([{}, vi.fn()]);
    reactDomMocks.useFormStatus.mockReturnValue({ pending: false });
  });

  it('renders a button with text "Sign In"', () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
  });

  it("is not disabled initially", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /^sign in$/i })).not.toBeDisabled();
  });
});
