import ImageUploader from '@/components/imageUploader';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#112240] flex items-center justify-center w-full">
      <ImageUploader />
    </div>
  );
}