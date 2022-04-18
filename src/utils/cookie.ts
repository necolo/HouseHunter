interface EditThisCookieExport {
  domain: string;
  expirationDate?: number;
  hostOnly: boolean;
  httpOnly: boolean;
  name: string;
  path: string;
  sameSite: string;
  secure: boolean;
  session: boolean;
  storeId: string;
  value: string;
  id: number;
}

export type EditThisCookieExports = EditThisCookieExport[];

/**
 * Stringify the exported cookie from Chrome extension 'EditThisCookie'
 * @param cookieJson 
 */
export function stringifyCookieJson(cookieJson: EditThisCookieExports) {
  return cookieJson.map(item => `${item.name}=${item.value}`).join('; ');
}