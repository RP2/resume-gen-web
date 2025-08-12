# Contributing to the Resume Builder Web App

Thank you for considering contributing to the AI Resume Builder Web project! We welcome contributions of all kinds, including bug fixes, feature enhancements, documentation improvements, and more.

## Getting Started

1. **Fork the Repository**
   - Navigate to the [GitHub repository](https://github.com/RP2/resume-gen-web).
   - Click the "Fork" button to create your own copy of the repository.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/resume-gen-web.git
   cd resume-gen-web
   ```

3. **Set Up the Development Environment**

   ```bash
   npm install
   ```

   ```bash
   npm run dev
   ```

4. **Sync with Upstream**

   ```bash
   git remote add upstream https://github.com/RP2/resume-gen-web.git
   ```

   ```bash
   git fetch upstream
   git merge upstream/master
   ```

## How to Contribute

### Reporting Issues

If you encounter a bug or have a feature request, please open an issue in the [GitHub Issues](https://github.com/RP2/resume-gen-web/issues) section. Provide as much detail as possible, including steps to reproduce the issue or a clear description of the feature you are requesting.

### Submitting Changes

1. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**

3. **Commit Your Changes**

   ```bash
   git commit -m "Add feature: your feature description"
   ```

4. **Push Your Changes**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Go to the original repository on GitHub.
   - Click "New Pull Request" and select your branch.
   - Provide a detailed description of your changes.

## Coding Guidelines

- **Code Style**: Follow the conventions outlined in the [Astro + React Project Guidelines](.github/copilot-instructions.md).
- **TypeScript**: Use strict typing and avoid `any` whenever possible.
- **Testing**: Ensure your changes are well-tested. Add unit tests for new features or bug fixes.
- **Documentation**: Update the README or other documentation files if your changes affect them.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). By participating, you are expected to uphold this code.

## Need Help?

If you have any questions or need assistance, feel free to open an issue or reach out to the maintainers.

Thank you for contributing!
