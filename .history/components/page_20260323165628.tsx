import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-20 min-h-[60vh] flex flex-col items-center justify-center text-center" dir="rtl">
      <h1 className="text-4xl font-bold mb-4 text-[#b8682b]">تواصل معنا</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        يسعدنا دائماً الاستماع إليكم وتلبية طلباتكم. يمكنكم التواصل معنا مباشرة من خلال الرابط أدناه.
      </p>
      
      <Button asChild size="lg" className="bg-[#b8682b] hover:bg-[#904a17] text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg transition-transform hover:scale-105 border-none">
        <a href="https://asercoffee.carrd.co/" target="_blank" rel="noopener noreferrer">
          تواصل معنا
        </a>
      </Button>
    </div>
  );
}