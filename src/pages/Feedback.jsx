import { Navigate } from "react-router-dom";

// Feedback is intentionally lightweight (Section O): it reuses the Contact
// form rather than existing as a separate page/template.
export default function Feedback() {
  return <Navigate to="/contact" replace />;
}
