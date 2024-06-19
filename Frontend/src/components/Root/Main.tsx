// Main.tsx
import { Router } from "~/components/Router/Router";

import { useEffect } from "react";
import { setupFirebase } from "~/lib/firebase";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useSignIn, useSignOut } from "~/components/contexts/UserContext";

function Main() {
  const { signIn } = useSignIn();
  const { signOut } = useSignOut();

  useEffect(() => {
    setupFirebase();

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        signIn(user);
      } else {
        signOut();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main>
      <Router />
    </main>
  );
}

export default Main;
