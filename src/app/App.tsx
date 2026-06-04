import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import GlobalLoader from "./components/GlobalLoader";

export default function App() {
  return (
    <>
      <GlobalLoader />
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
