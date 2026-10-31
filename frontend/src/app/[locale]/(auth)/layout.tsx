export default function AuthLayout({ children }: LayoutProps<"/[locale]">) {
  return <main className="flex flex-1 items-center px-4 py-8 sm:px-6">{children}</main>;
}
