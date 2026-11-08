import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "@/i18n/context";
import { askAgent } from "@/lib/ai/agent.functions";
import { AgentConsole } from "@/components/site/AgentConsole";

vi.mock("@/lib/ai/agent.functions", () => ({
  askAgent: vi.fn(),
}));

const askAgentMock = vi.mocked(askAgent);

function renderConsole() {
  return render(
    <I18nProvider>
      <AgentConsole />
    </I18nProvider>,
  );
}

function submitQuestion(question: string) {
  fireEvent.change(screen.getByPlaceholderText("Ask Agent PRSL-AI…"), {
    target: { value: question },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
}

describe("Agent remote-inference consent", () => {
  beforeEach(() => {
    askAgentMock.mockReset();
    askAgentMock.mockResolvedValue({ ok: true, text: "Remote answer" });
  });

  it("does not send an unmatched question before explicit approval", () => {
    renderConsole();

    submitQuestion("Tell me a bedtime story");

    expect(askAgentMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        "I don't have a local answer for this question. Would you like me to send only the question text to the remote AI service?",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Lovable AI Gateway/)).toBeInTheDocument();
  });

  it("sends only after the user explicitly approves", async () => {
    renderConsole();

    submitQuestion("Tell me a bedtime story");
    fireEvent.click(screen.getByRole("button", { name: "Send question to remote AI" }));

    await waitFor(() => {
      expect(askAgentMock).toHaveBeenCalledTimes(1);
      expect(askAgentMock).toHaveBeenCalledWith({
        data: { question: "Tell me a bedtime story", consent: true },
      });
    });
    expect(await screen.findByText("Remote answer")).toBeInTheDocument();
  });

  it("does not send when the user declines remote inference", () => {
    renderConsole();

    submitQuestion("Tell me a bedtime story");
    fireEvent.click(screen.getByRole("button", { name: "Do not send" }));

    expect(askAgentMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        "No information was sent. I can answer only from the local knowledge topics available in this session.",
      ),
    ).toBeInTheDocument();
  });
});
