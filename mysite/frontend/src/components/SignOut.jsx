import { Auth, DataStore } from "aws-amplify";
import { useNavigate } from "react-router-dom";

import { Analytics } from "aws-amplify";
export default function SignOut() {
  Analytics.record({ name: "signOutVisit" });
  const navigate = useNavigate();
  Auth.signOut().then(() => {
    navigate("/");
  });
}
