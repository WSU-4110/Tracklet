import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "mock-font" }),
  Geist_Mono: () => ({ variable: "mock-font" }),
}));

vi.mock("../app/globals.css", () => ({}));

import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it('renders an html element with lang="en"', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <span>child</span>
      </RootLayout>,
    );
    expect(markup).toMatch(/<html[^>]*\blang="en"/);
  });

  it("renders children passed to it", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <span>Hello from child</span>
      </RootLayout>,
    );
    expect(markup).toContain("Hello from child");
  });

  it("applies font CSS variable classes to the body", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <span>x</span>
      </RootLayout>,
    );
    expect(markup).toMatch(/<body[^>]*\bclass="[^"]*mock-font/);
    expect(markup).toContain("antialiased");
  });
});

describe("metadata export", () => {
  it("exports an object with title and description properties", () => {
    expect(metadata).toHaveProperty("title");
    expect(metadata).toHaveProperty("description");
    expect(metadata.title).toBeDefined();
    expect(metadata.description).toBeDefined();
  });
});
