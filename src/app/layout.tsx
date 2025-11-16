import './globals.css';
import type {Metadata} from 'next';

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  metadataBase: new URL('https://crai-ksa.netlify.app'),
};

export default function RootLayout({children}: Props) {
  return children;
}
