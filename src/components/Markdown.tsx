import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import mermaid from 'mermaid'
import { headingToId } from '#/lib/dev-logs'

type MarkdownProps = {
  content: string
  className?: string
}

let mermaidReady = false

function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    let cancelled = false

    const run = async () => {
      if (!mermaidReady) {
        mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })
        mermaidReady = true
      }
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2)}`
        const { svg } = await mermaid.render(id, code)
        if (!cancelled && ref.current) ref.current.innerHTML = svg
      } catch {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = `<pre class="overflow-x-auto text-xs p-3 rounded bg-[var(--code-bg)]">${code}</pre>`
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [code])

  return <div ref={ref} className="my-6 overflow-x-auto" />
}

export default function Markdown({ content, className = '' }: MarkdownProps) {
  return (
    <div className={`prose prose-neutral max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const text = String(children)
            return (
              <h2
                id={headingToId(text)}
                className="mt-10 scroll-mt-20 text-xl font-semibold tracking-tight text-[var(--fg)]"
              >
                {children}
              </h2>
            )
          },
          h3: ({ children }) => {
            const text = String(children)
            return (
              <h3
                id={headingToId(text)}
                className="mt-8 scroll-mt-20 text-lg font-semibold text-[var(--fg)]"
              >
                {children}
              </h3>
            )
          },
          p: ({ children }) => (
            <p className="text-[var(--fg-muted)] leading-7">{children}</p>
          ),
          li: ({ children }) => (
            <li className="text-[var(--fg-muted)]">{children}</li>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-[var(--accent)]">
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt ?? ''}
              className="my-6 rounded-md border border-[var(--border)]"
              loading="lazy"
            />
          ),
          code: ({ className: codeClass, children }) => {
            const match = /language-(\w+)/.exec(codeClass ?? '')
            if (match?.[1] === 'mermaid') {
              return <MermaidBlock code={String(children).trim()} />
            }
            const isBlock = codeClass?.includes('language-')
            if (isBlock) {
              return (
                <code className="block overflow-x-auto rounded-md bg-[var(--code-bg)] p-4 text-sm text-[var(--fg)]">
                  {children}
                </code>
              )
            }
            return (
              <code className="rounded bg-[var(--code-bg)] px-1.5 py-0.5 text-sm">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--code-bg)] p-0">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
