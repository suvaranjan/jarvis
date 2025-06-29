// router.jsx
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ChatInterface from "./pages/ChatInterface";
import Test from "./pages/Test";
import RootLayout from "./layout/sidebar2/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

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
