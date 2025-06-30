import "./App.css";
import { Button } from "@/components/ui/button";
import { Cog, Maximize2, Power } from "lucide-react";

function App() {
  return (
    <>
      <header className="flex items-center justify-between ">
        <Button variant="ghost" size={"icon"}>
          <Power />
        </Button>
        <div className="flex items-center gap-x-2">
          <Button variant="ghost" size={"icon"}>
            <Maximize2 />
          </Button>
          <Button variant="ghost" size={"icon"}>
            <Cog />
          </Button>
        </div>
      </header>
    </>
  );
}

export default App;
