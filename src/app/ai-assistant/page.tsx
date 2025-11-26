// Redirect old path to new MedResearch AI Lab path
import { redirect } from "next/navigation";

export default function AIAssistantRedirect() {
  redirect("/medresearch-ai");
}
