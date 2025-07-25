import Editor from "@/features/editor";

export default async function Page({
	params,
}: { params: Promise<{ id: string[] }> }) {
	const { id } = await params;
	const [sceneId] = id; // Get the first ID from the array

	return <Editor id={sceneId} />;
}
