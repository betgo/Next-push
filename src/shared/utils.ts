export const IsMobile = (userAgent: string) => {
  const isMobile = /Mobile|Android|iPhone|iPod|BlackBerry/i.test(userAgent);
  return isMobile;
};
