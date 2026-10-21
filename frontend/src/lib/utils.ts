import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// "folha" é o raio de 4px do panfleto (--radius-folha no index.css). Sem avisar o tailwind-merge,
// ele não sabe que rounded-folha substitui o rounded-md dos componentes do shadcn e as duas classes ficam.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["folha"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
