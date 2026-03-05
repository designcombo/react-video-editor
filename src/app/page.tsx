"use client";
import Editor from "@/features/editor";
import { InvitationModal } from "@/components/invitation-modal";

export default function Home() {
  return (
    <>
      <Editor />
      <InvitationModal />
    </>
  );
}