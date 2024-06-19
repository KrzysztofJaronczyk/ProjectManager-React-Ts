import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { useAuth } from "~/lib/firebase";

export const SignInButton = () => {
  const handleClick = () => {
    const provider = new GoogleAuthProvider();
    const auth = useAuth();
    auth.languageCode = "ja";
    signInWithRedirect(auth, provider);
  };

  return (
    <button onClick={handleClick} type="button" className="btn normal-case w-full">
      Sign In With Google
    </button>
  );
};
