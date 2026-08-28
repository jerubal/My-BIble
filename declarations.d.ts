declare module 'next/server' {
  export class NextRequest extends Request {
    readonly nextUrl: URL;
    readonly ip?: string;
    readonly geo?: {
      city?: string;
      country?: string;
      region?: string;
      latitude?: string;
      longitude?: string;
    };
  }
  export class NextResponse<Body = any> extends Response {
    static json<JsonBody>(body: JsonBody, init?: ResponseInit): NextResponse<JsonBody>;
    static redirect(url: string | URL, status?: number): NextResponse;
    static rewrite(destination: string | URL): NextResponse;
    static next(): NextResponse;
  }
  export function userAgent(request: any): any;
  export class ImageResponse extends Response {}
}

declare module 'next/server.js' {
  export * from 'next/server';
}

declare module 'next/navigation' {
  export function useRouter(): any;
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams(): Record<string, string | string[]>;
  export function notFound(): never;
  export function redirect(url: string, type?: any): never;
  export function permanentRedirect(url: string, type?: any): never;
}

declare module 'next/navigation.js' {
  export * from 'next/navigation';
}

declare module 'next/link' {
  import React from 'react';
  const Link: React.ForwardRefExoticComponent<any>;
  export default Link;
}

declare module 'next/link.js' {
  import Link from 'next/link';
  export default Link;
}

declare module 'next/image' {
  import React from 'react';
  const Image: React.FC<any>;
  export default Image;
}

declare module 'next/image.js' {
  import Image from 'next/image';
  export default Image;
}

declare module 'next' {
  export type Metadata = any;
  export type Viewport = any;
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
}

declare module 'next/dist/lib/metadata/types/metadata-interface.js' {
  export type Metadata = any;
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
  export type Viewport = any;
}
