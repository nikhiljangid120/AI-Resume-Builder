# AI Resume Builder

**Build your professional resume in minutes with the power of AI.**

This project is a modern, feature-rich Resume Builder built with **Next.js**, **Tailwind CSS**, and **Groq AI**. It offers a seamless experience for creating, customizing, and exporting ATS-optimized resumes.

## ✨ Key Features

- **AI-Powered Generation**: Utilize the **Groq API** (Llama 3 70B) to generate professional summaries, enhance bullet points, and check for ATS compatibility.
- **Real-Time Preview**: See your changes instantly with a dynamic, split-screen editor.
- **Multiple Professional Templates**: Choose from a variety of distinct templates including Modern, Minimal, ATS-Friendly, Creative, Executive, and more.
- **ATS Optimization**: Built-in checker analyzes your resume against job descriptions to ensure high parseability by Applicant Tracking Systems.
- **Smart Customization**: drag-and-drop section reordering, custom theme colors, font selection, and adjustable spacing.
- **Local Data Privacy**: Your resume data is stored locally in your browser (LocalStorage). No sign-up required, and your personal data stays with you.
- **PDF Export**: High-quality, print-ready PDF export functionality.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Groq SDK](https://console.groq.com/) (Llama 3 models)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: [html2canvas](https://html2canvas.hertzen.com/) & [jspdf](https://parall.ax/products/jspdf)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nikhiljangid120/AI-Resume-Builder.git
    cd AI-Resume-Builder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**
    
    > [!IMPORTANT]
    > This project requires a Groq API key for AI features.

    Create a `.env.local` file in the root directory and add your key:
    
    ```env
    NEXT_PUBLIC_GROQ_API_KEY=your_gsk_key_here
    ```
    
    You can get a free API key from the [Groq Console](https://console.groq.com/keys).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components and feature-specific logic.
    - `templates/`: Definition of resume templates (Modern, Minimal, etc.).
    - `ui/`: Core design system components.
- `lib/`: Utility functions, types, and AI service configurations.
    - `ai-services/`: Logic for interacting with the Groq API.
- `hooks/`: Custom React hooks (e.g., `use-resume-builder`).
- `public/`: Static assets like images and template thumbnails.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).