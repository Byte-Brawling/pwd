import MainPanelLayout from "@/components/layouts/main";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainPanelLayout>{children}</MainPanelLayout>;
}
