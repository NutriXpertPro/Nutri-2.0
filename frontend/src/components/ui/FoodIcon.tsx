"use client"

import React from 'react'
import { 
  Beef, 
  Fish, 
  Soup, 
  Apple, 
  Banana, 
  Citrus, 
  Grape, 
  Sandwich, 
  Pizza, 
  Coffee, 
  Milk, 
  Wheat, 
  Utensils, 
  Flame,
  Egg,
  Drumstick,
  Carrot,
  Salad,
  Popcorn,
  Cookie,
  IceCream,
  GlassWater,
  Beer,
  Wine,
  Folder,
  ChefHat,
  Shell,
  Droplet,
  Sprout,
  Candy,
  Bean,
  Cherry,
  Croissant
} from 'lucide-react'
import { cn } from "@/lib/utils"

interface FoodIconProps {
  name: string
  group?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function FoodIcon({ name, group, size = 'md', className }: FoodIconProps) {
  const n = name.toLowerCase()
  const g = group ? group.toLowerCase() : ''

  // Icon mapping logic
  const getIconConfig = () => {
    // 0. Specific Fixes & High Priority
    if (n.includes('aveia') || n.includes('granola') || n.includes('cereal') || n.includes('milho')) return { Icon: Wheat, color: 'text-yellow-600', bg: 'bg-yellow-600/10' }
    if (n.includes('mel') || n.includes('melado') || n.includes('xarope')) return { Icon: Droplet, color: 'text-amber-500', bg: 'bg-amber-500/10' }
    if (n.includes('chia') || n.includes('linhaça') || n.includes('gergelim') || n.includes('semente')) return { Icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-600/10' }
    if (n.includes('cogumelo') || n.includes('shimeji') || n.includes('shitake')) return { Icon: Sprout, color: 'text-zinc-400', bg: 'bg-zinc-400/10' }
    if (n.includes('abacate')) return { Icon: Apple, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
    if (n.includes('margarina') || n.includes('manteiga')) return { Icon: Sandwich, color: 'text-amber-300', bg: 'bg-amber-300/10' }
    if (n.includes('arroz') || n.includes('risoto')) return { Icon: ChefHat, color: 'text-zinc-500', bg: 'bg-zinc-500/10' } // Arroz distinct from beans
    if (n.includes('feijão') || n.includes('feijao') || n.includes('lentilha') || n.includes('grão')) return { Icon: Soup, color: 'text-amber-800', bg: 'bg-amber-800/10' } // Beans keep Soup/Pot look
    if (n.includes('requeijão') || n.includes('cream cheese') || n.includes('creme de leite')) return { Icon: Sandwich, color: 'text-orange-300', bg: 'bg-orange-300/10' } // Spreadable
    if (n.includes('iogurte') || n.includes('yogurt')) return { Icon: Milk, color: 'text-pink-400', bg: 'bg-pink-400/10' } // Distinct from cheese
    if (n.includes('chocolate') || n.includes('bombom') || n.includes('brigadeiro')) return { Icon: Candy, color: 'text-amber-700', bg: 'bg-amber-700/10' }

    // 1. Proteins
    if (n.includes('ovo') || n.includes('omelete') || n.includes('clara') || n.includes('gema')) return { Icon: Egg, color: 'text-orange-500', bg: 'bg-orange-500/10' }
    if (n.includes('frango') || n.includes('sobrecoxa') || n.includes('peru') || (n.includes('ave') && !n.includes('aveia'))) return { Icon: Drumstick, color: 'text-amber-600', bg: 'bg-amber-600/10' }
    if (n.includes('carne') || n.includes('bife') || n.includes('bovino') || n.includes('suíno') || n.includes('steak') || n.includes('picanha') || n.includes('patinho')) return { Icon: Beef, color: 'text-red-500', bg: 'bg-red-500/10' }
    if (n.includes('peixe') || n.includes('salmão') || n.includes('atum') || n.includes('tilápia') || n.includes('bacalhau') || n.includes('merluza')) return { Icon: Fish, color: 'text-blue-500', bg: 'bg-blue-500/10' }
    if (n.includes('camarão') || n.includes('lagosta') || n.includes('siri') || n.includes('caranguejo') || n.includes('frutos do mar')) return { Icon: Shell, color: 'text-rose-400', bg: 'bg-rose-400/10' }

    // 2. Vegetables & Fruits
    if (n.includes('salada') || n.includes('alface') || n.includes('folha') || n.includes('couve') || n.includes('rúcula') || n.includes('espinafre')) return { Icon: Salad, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
    if (n.includes('cenoura') || n.includes('abóbora') || n.includes('pimentão') || n.includes('beterraba')) return { Icon: Carrot, color: 'text-orange-400', bg: 'bg-orange-400/10' }
    if (n.includes('fruta') || n.includes('maçã') || n.includes('pera') || n.includes('pêssego')) return { Icon: Apple, color: 'text-red-400', bg: 'bg-red-400/10' }
    if (n.includes('banana')) return { Icon: Banana, color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
    if (n.includes('laranja') || n.includes('limão') || n.includes('mexerica') || n.includes('abacaxi')) return { Icon: Citrus, color: 'text-orange-500', bg: 'bg-orange-500/10' }
    if (n.includes('uva') || n.includes('passa')) return { Icon: Grape, color: 'text-purple-500', bg: 'bg-purple-500/10' }
    if (n.includes('morango') || n.includes('cereja') || n.includes('framboesa')) return { Icon: Cherry, color: 'text-rose-500', bg: 'bg-rose-500/10' }

    // 3. Carbs & Grains
    if (n.includes('pão') || n.includes('baguete') || n.includes('tapioca') || n.includes('torrada')) return { Icon: Wheat, color: 'text-amber-500', bg: 'bg-amber-500/10' }
    if (n.includes('croissant') || n.includes('brioche')) return { Icon: Croissant, color: 'text-amber-600', bg: 'bg-amber-600/10' }
    if (n.includes('batata') || n.includes('mandioca') || n.includes('aipim') || n.includes('inhame')) return { Icon: Cookie, color: 'text-yellow-200', bg: 'bg-yellow-200/10' } // Root veg fallback
    if (n.includes('pizza') || n.includes('massa') || n.includes('macarrão') || n.includes('lasanha') || n.includes('espaguete')) return { Icon: Pizza, color: 'text-orange-600', bg: 'bg-orange-600/10' }
    if (n.includes('sanduíche') || n.includes('hambúrguer') || n.includes('burguer')) return { Icon: Sandwich, color: 'text-yellow-700', bg: 'bg-yellow-700/10' }

    // 4. Dairy & Drinks
    if (n.includes('leite') || n.includes('queijo') || n.includes('mussarela') || n.includes('prato') || n.includes('whey')) return { Icon: Milk, color: 'text-blue-400', bg: 'bg-blue-400/10' }
    if (n.includes('café') || n.includes('cappuccino') || n.includes('expresso')) return { Icon: Coffee, color: 'text-amber-900', bg: 'bg-amber-900/10' }
    if (n.includes('água') || n.includes('suco') || n.includes('chá') || n.includes('refrigerante')) return { Icon: GlassWater, color: 'text-sky-400', bg: 'bg-sky-400/10' }
    if (n.includes('cerveja') || n.includes('vinho') || n.includes('drink') || n.includes('álcool')) return { Icon: Beer, color: 'text-amber-500', bg: 'bg-amber-500/10' }

    // 5. Snacks & Others
    if (n.includes('pipoca') || n.includes('amendoim') || n.includes('castanha') || n.includes('noze')) return { Icon: Popcorn, color: 'text-yellow-600', bg: 'bg-yellow-600/10' }
    if (n.includes('doce') || n.includes('bolo') || n.includes('torta') || n.includes('biscoito') || n.includes('bolacha')) return { Icon: Cookie, color: 'text-amber-800', bg: 'bg-amber-800/10' }
    if (n.includes('sorvete') || n.includes('gelato') || n.includes('açaí')) return { Icon: IceCream, color: 'text-pink-400', bg: 'bg-pink-400/10' }

    // 6. Group Fallbacks
    if (g.includes('carne') || g.includes('proteína')) return { Icon: Beef, color: 'text-red-500', bg: 'bg-red-500/10' }
    if (g.includes('fruta')) return { Icon: Apple, color: 'text-red-400', bg: 'bg-red-400/10' }
    if (g.includes('vegetal') || g.includes('legume') || g.includes('verdura')) return { Icon: Salad, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
    if (g.includes('bebida')) return { Icon: GlassWater, color: 'text-sky-400', bg: 'bg-sky-400/10' }
    if (g.includes('cereal') || g.includes('pão') || g.includes('massa')) return { Icon: Wheat, color: 'text-amber-500', bg: 'bg-amber-500/10' }
    if (g.includes('leite') || g.includes('derivado')) return { Icon: Milk, color: 'text-blue-400', bg: 'bg-blue-400/10' }
    if (g.includes('doce')) return { Icon: Candy, color: 'text-pink-500', bg: 'bg-pink-500/10' }

    return { Icon: Utensils, color: 'text-primary', bg: 'bg-primary/10' }
  }

  const { Icon, color, bg } = getIconConfig()

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2',
    xl: 'w-12 h-12 p-2.5'
  }

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
    xl: 26
  }

  return (
    <div className={cn(
      "rounded-xl flex items-center justify-center transition-all shadow-sm border border-white/5",
      bg,
      sizeClasses[size],
      className
    )}>
      <Icon size={iconSizes[size]} className={cn("shrink-0", color)} />
    </div>
  )
}
