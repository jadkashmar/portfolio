import { motion } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const ease = [0.16, 1, 0.3, 1] as const

type WordRevealProps = {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
}

/* Headline whose words rise out of a mask, one after another, on entering view. */
export function WordReveal({ text, className, as: Tag = 'h2' }: WordRevealProps) {
  const reducedMotion = useReducedMotion()
  if (reducedMotion) return <Tag className={className}>{text}</Tag>

  return (
    <Tag className={className} aria-label={text}>
      {text.split(' ').map((word, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.12em] align-top"
        >
          <motion.span
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.8, delay: index * 0.07, ease }}
            className="inline-block"
          >
            {word}
            {' '}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
