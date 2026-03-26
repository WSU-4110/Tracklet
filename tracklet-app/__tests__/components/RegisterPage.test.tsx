import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterPage from "@/app/(auth)/register/page";

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
  register: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reactDomMocks.useFormState.mockReturnValue([{}, vi.fn()]);
    reactDomMocks.useFormStatus.mockReturnValue({ pending: false });
  });

  it('renders the "Get Started" heading', () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { name: /get started/i })).toBeInTheDocument();
  });

  it("renders first name, last name, email, and password fields", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it("sets password minLength to 6", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute("minLength", "6");
  });

  it('renders a link to the login page with text "Sign in"', () => {
    render(<RegisterPage />);
    const link = screen.getByRole("link", { name: /^sign in$/i });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("displays an error message when the form state has an error", () => {
    reactDomMocks.useFormState.mockReturnValue([
      { error: "Email already in use" },
      vi.fn(),
    ]);
    render(<RegisterPage />);
    expect(screen.getByText("Email already in use")).toBeInTheDocument();
  });
});

describe("SubmitButton (register page)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reactDomMocks.useFormState.mockReturnValue([{}, vi.fn()]);
    reactDomMocks.useFormStatus.mockReturnValue({ pending: false });
  });

  it('renders a button with text "Create Account"', () => {
    render(<RegisterPage />);
    expect(screen.getByRole("button", { name: /^create account$/i })).toBeInTheDocument();
  });

  it("is not disabled initially", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("button", { name: /^create account$/i })).not.toBeDisabled();
  });
});
