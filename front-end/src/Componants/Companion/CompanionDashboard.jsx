import React, { useEffect, useState } from "react";
import CompanionShareLocation from "./CompanionShareLocation"; // Import location sharing
import axios from "axios";

function CompanionDashboard() {
  const [companionId, setCompanionId] = useState(null);

  useEffect(() => {
    // Get Companion ID from localStorage after login
    const storedCompanion = JSON.parse(localStorage.getItem("companionObj"));
    if (storedCompanion) {
      setCompanionId(storedCompanion._id);
    }
  }, []);

  return (
    <div>
      <h2>Welcome, Companion</h2>

      {companionId && <CompanionShareLocation companionId={companionId} />}
    </div>
  );
}

export default CompanionDashboard;
