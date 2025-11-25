import { permanentRedirect } from "next/navigation";

export default function LegacyHomeRedirect() {
  // Redirect legacy /home path to the default English locale
  permanentRedirect("/en");
}
