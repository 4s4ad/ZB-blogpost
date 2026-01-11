export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-foreground">About Me</h1>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Welcome to my personal blog! I'm a passionate developer and writer sharing my journey in technology, design,
            and web development.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Through this platform, I aim to share insights, tutorials, and experiences that I've gathered throughout my
            career. Whether you're a fellow developer, a designer, or simply curious about technology, I hope you find
            something valuable here.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">What I Write About</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Modern web development with Next.js and React</li>
            <li>UI/UX design principles and best practices</li>
            <li>TypeScript and type-safe development</li>
            <li>Building scalable applications</li>
          </ul>
          <h2 className="text-2xl font-semibold text-foreground">Get In Touch</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Feel free to reach out to me on social media or via email. I'm always happy to connect with fellow
            developers and enthusiasts!
          </p>
        </div>
      </div>
    </div>
  )
}
