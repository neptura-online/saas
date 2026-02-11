// export function formatDate(d: Date): string {
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");

//   let hours = d.getHours();
//   const minutes = String(d.getMinutes()).padStart(2, "0");
//   const seconds = String(d.getSeconds()).padStart(2, "0");

//   const ampm = hours >= 12 ? "pm" : "am";

//   hours = hours % 12 || 12;

//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
// }

//for sql
export function formatDate(d: Date): string {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");

  let hours = d.getUTCHours();
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  const seconds = String(d.getUTCSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
}
