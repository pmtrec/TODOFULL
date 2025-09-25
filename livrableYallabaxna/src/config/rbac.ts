export const RBAC: Record<string, Record<string, string[]>> = {
   User: {
    users: ["GET", "POST", "PUT", "DELETE"],
    taskFadil: ["GET", "POST", "PATCH"]
  }
  
};
