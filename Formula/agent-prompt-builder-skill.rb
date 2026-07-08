class AgentPromptBuilderSkill < Formula
  desc "Codex skill for building robust autonomous agent prompts"
  homepage "https://github.com/openai0229/agent-prompt-builder"
  license "MIT"
  head "https://github.com/openai0229/agent-prompt-builder.git", branch: "main"

  depends_on "node"

  def install
    libexec.install Dir["*"]
    (bin/"agent-prompt-builder-skill").write <<~EOS
      #!/bin/bash
      exec "#{Formula["node"].opt_bin}/node" "#{libexec}/bin/install.mjs" "$@"
    EOS
  end

  test do
    assert_match "Would install agent-prompt-builder", shell_output("#{bin}/agent-prompt-builder-skill --dry-run")
  end
end
