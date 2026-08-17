# Contributing to JayPDF

Thank you for your interest in contributing to JayPDF! We welcome contributions from everyone. By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs
If you find a bug, please create a new issue. Be sure to include:
- A clear description of the issue.
- Steps to reproduce.
- Expected vs. actual behavior.
- Screenshots if applicable.
- Browser and OS version.

### Suggesting Enhancements
We love new ideas! Please open an issue to discuss your feature request before working on it, so we can align on the approach.

### Pull Requests
1.  **Fork the repository** and clone it locally.
2.  Create a new branch for your feature or fix:
    ```bash
    git checkout -b feat/your-feature-name
    # or
    git checkout -b fix/your-fix-name
    ```
3.  **Make your changes**. Ensure your code follows the project's style (TypeScript, Tailwind CSS).
4.  **Run verification and tests** to ensure no regressions:
    ```bash
    ./scripts/verify-all.sh
    ```
5.  **Commit your changes** with descriptive messages.
6.  **Push to your fork** and submit a Pull Request to the `main` branch.

## Development Setup

1.  **Install dependencies**:
    ```bash
    bun install
    ```

2.  **Start development server**:
    ```bash
    bun run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Licensing of contributions

JayPDF uses a dual-licensing model: AGPL-3.0-only and a separate commercial license.

Do not submit substantial code contributions unless you are legally entitled to contribute the code and have agreed to the project's contributor licensing terms.

Because JayPDF may also be distributed under commercial licenses, the project must obtain sufficient rights to relicense accepted contributions.

Until an explicit Contributor License Agreement (CLA) process is available, substantial third-party code contributions may not be accepted for inclusion in commercially relicensable JayPDF code.

See [CLA.md](CLA.md) for further details on the contributor licensing policy.
