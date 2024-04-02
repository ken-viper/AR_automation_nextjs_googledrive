export function getDayData(jsonData, year, month, day) {
  // Find the year node
  if (!jsonData || !jsonData.children) {
    console.error("Invalid JSON data format");
    return null;
  }

  // Find the year node
  const yearNode = jsonData.children.find(node => node.name === year);
  if (!yearNode) {
    console.error("Year node not found");
    return null;
  }
  if (!yearNode) {
      console.error("Year node not found");
      return null;
  }

  // Find the month node
  const monthNode = yearNode.children.find(node => node.name === month);
  if (!monthNode) {
      console.error("Month node not found");
      return null;
  }

  // Find the day node
  const dayNode = monthNode.children.find(node => node.name === day);
  if (!dayNode) {
      console.error("Day node not found");
      return null;
  }

  // return dayNode;
  console.log("dayNode",dayNode)
}
