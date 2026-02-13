import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="bg-[url('./src/assets/bg-1.png')] bg-no-repeat bg-cover">
      <Toaster />
      <AppRoutes />
    </div>
  );
}

export default App;
