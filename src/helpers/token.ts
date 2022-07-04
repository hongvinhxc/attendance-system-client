function getCookie(name: string | null) {
  const value = `; ${document.cookie}`;
  const parts: string[] = value.split(`; ${name}=`);
  if (parts.length === 2) return (parts.pop() || "").split(";").shift() || "";
  return "";
}

export { getCookie };