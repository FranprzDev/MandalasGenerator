import { createElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { MandalaStudio } from "@/components/MandalaStudio";

vi.mock("@/lib/export/pdf", () => ({
  exportAndDownload: vi.fn().mockResolvedValue(undefined),
}));

describe("MandalaStudio", () => {
  it("renders and can generate and export", async () => {
    render(createElement(MandalaStudio));

    await waitFor(() => expect(screen.getByRole("img", { name: "Mandala generada" })).toBeInTheDocument());

    const generateButton = screen.getByRole("button", { name: /generar nueva mandala/i });
    await userEvent.click(generateButton);

    const downloadButton = screen.getByRole("button", { name: /descargar pdf/i });
    await userEvent.click(downloadButton);

    expect(screen.getByText(/seed:/i)).toBeInTheDocument();
  });
});
