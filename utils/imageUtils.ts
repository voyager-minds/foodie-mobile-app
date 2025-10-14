export const getImageUrl = (key?: string): string => {
  return key 
    ? `https://cdn.codelabs.lk/${key}` 
    : 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60';
};