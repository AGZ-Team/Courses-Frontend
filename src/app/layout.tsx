import './globals.css';

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({children}: Props) {
  // A root layout is still required, even though the HTML shell lives
  // inside the locale-specific layout.
  return children;
}
