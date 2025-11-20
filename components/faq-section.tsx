import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What makes A-notes different from other note-taking apps?",
    answer: "A-notes combines rich text editing, visual diagramming, and file management in one seamless platform. Unlike other apps, you can create text notes, draw diagrams, and organize files all in the same notebook, making it perfect for comprehensive learning and research.",
  },
  {
    question: "Can I collaborate with others on my notebooks?",
    answer: "Yes! With Pro and Team plans, you can share notebooks with team members, collaborate on notes in real-time, and work together on learning projects. You can control who has access to your notebooks and what level of permissions they have.",
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. We use enterprise-grade encryption to protect your data, and you have full control over who can access your notebooks. Your notes are private by default, and you can choose to share them only with people you trust.",
  },
  {
    question: "Can I export my notes to other formats?",
    answer: "Yes! You can export your notebooks to PDF, Markdown, HTML, and other formats. Pro and Team plans also include advanced export options and custom formatting.",
  },
  {
    question: "Do you have a mobile app?",
    answer: "Yes, we have mobile apps for iOS and Android that sync seamlessly with your desktop experience. You can access all your notebooks, create notes, and even draw diagrams on the go.",
  },
  {
    question: "What file types can I upload?",
    answer: "You can upload PDFs, images (PNG, JPG, GIF, WebP), videos (MP4, WebM, MOV), documents (DOC, DOCX), presentations (PPT, PPTX), and text files. Free accounts have a 100MB limit per file, while Pro accounts can upload files up to 1GB.",
  },
  {
    question: "Can I use A-notes offline?",
    answer: "Yes! A-notes works offline on all platforms. Your notes sync automatically when you're back online, so you never lose your work.",
  },
  {
    question: "How does the drawing and diagramming work?",
    answer: "A-notes includes a powerful drawing canvas powered by Excalidraw. You can create flowcharts, diagrams, sketches, and technical drawings. The drawing tools are integrated directly into your notebooks, so you can mix text and visual content seamlessly.",
  },
]

export function FAQSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl divide-y divide-border">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-foreground">
          Frequently asked questions
        </h2>
        <dl className="mt-10 space-y-6 divide-y divide-border">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </dl>
      </div>
    </div>
  )
}

