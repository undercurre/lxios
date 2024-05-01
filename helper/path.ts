// export function buildFullUrl(
//   urlPath: string,
//   params: Record<string, string> = {}
// ): string {
//   // Create a new URL using the baseURL and optionally the urlPath
//   const url = new URL(urlPath ?? "");

//   // Append each query parameter to the URL search params
//   Object.entries(params).forEach(([key, value]) => {
//     url.searchParams.append(key, value);
//   });

//   // Return the complete URL as a string
//   return url.toString();
// }
