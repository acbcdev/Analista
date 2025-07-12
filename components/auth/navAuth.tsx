import { Button } from "../ui/button";
import { SidebarMenu } from "../ui/sidebar";
import { SignInButton } from "@clerk/chrome-extension";

export default function NavAuth() {
  // const { isSignedIn, isLoading, signIn, signOut } = useAuth();
  return (
    <SidebarMenu>
      <SignInButton mode="modal">
        <Button className="w-full" size={"lg"}>
          Login
        </Button>
      </SignInButton>
    </SidebarMenu>
  );
}
