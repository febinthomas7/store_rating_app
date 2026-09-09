export const getRoleDefaultPath = (role?: string) => {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "STORE_OWNER":
      return "/store/owner";
    default:
      return "/store";
  }
};
