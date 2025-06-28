// router.jsx
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ChatInterface from "./pages/ChatInterface";
import SidebarLayout from "./layout/sidebar/sidebarLayout";
import Test from "./pages/Test";
import RootLayout from "./layout/sidebar2/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "chat/:chatId",
        element: <ChatInterface />,
      },
      {
        path: "test",
        element: <Test />,
      },
    ],
  },
]);
