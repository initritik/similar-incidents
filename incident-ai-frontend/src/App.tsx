import { AppLayout } from "@/layouts/app-layout";
import { ChatPage } from "@/pages/chat-page";

// App.tsx remains lightweight and focuses on top-level layout orchestration.
// It imports the active feature page (ChatPage) but doesn't need to know about
// internal component hierarchies, state management, or API integration details.
//
// In development, placeholder screens like HomePage are commonly replaced with
// real feature pages like this. Each page owns its own workflows, state, and
// business logic, making the application modular and easy to test in isolation.

export default function App() {
  return (
    <AppLayout>
      <ChatPage />
    </AppLayout>
  );
}
