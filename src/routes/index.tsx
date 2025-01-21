import { createFileRoute } from "@tanstack/react-router";
import Upload from "../screens/Upload";

export const Route = createFileRoute("/")({
  component: Upload,
});
