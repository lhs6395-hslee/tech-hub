import ChatBot from "@/components/chat/ChatBot";

export default function KubernetesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ChatBot context="kubernetes" />
    </>
  );
}
