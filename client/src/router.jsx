// router.jsx
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ChatInterface from "./pages/ChatInterface";
import SidebarLayout from "./layout/sidebar/sidebarLayout";
import Test from "./pages/Test";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SidebarLayout />,
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
