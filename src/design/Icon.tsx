import {
  Add,
  ArrowLeft2,
  ArrowRight2,
  Calendar2,
  Chart2,
  ClipboardTick,
  CloseCircle,
  Copy,
  DocumentText,
  DocumentUpload,
  Drop,
  Element3,
  EmptyWallet,
  Folder2,
  Global,
  Google,
  Home2,
  InfoCircle,
  Link21,
  Location,
  Lock1,
  Logout,
  MessageQuestion,
  Messages2,
  Minus,
  MoneyRecive,
  MoneySend,
  Notification,
  Personalcard,
  Radar2,
  Reserve,
  Scanning,
  SearchNormal1,
  Setting2,
  Ship,
  ShieldTick,
  Sun1,
  TickCircle,
  Tree,
  User,
  Verify,
  Warning2,
  Whatsapp,
  type Icon as IconsaxIcon,
} from 'iconsax-react'

/**
 * Satu pintu untuk semua ikon — paket Iconsax (MIT), gaya garis membulat sesuai referensi.
 * Nama dipertahankan agar layar tidak perlu diubah; ganti entri di peta ini untuk menukar ikon.
 */
const registry = {
  home: Home2,
  folder: Folder2,
  wallet: EmptyWallet,
  help: MessageQuestion,
  user: User,
  chats: Messages2,
  radar: Radar2,
  'clipboard-check': ClipboardTick,
  link: Link21,
  plus: Add,
  minus: Minus,
  plant: Tree,
  fish: Ship,
  boat: Ship,
  'cooking-pot': Reserve,
  drop: Sun1,
  upload: DocumentUpload,
  'chart-bar': Chart2,
  calendar: Calendar2,
  'arrow-down-left': MoneyRecive,
  'arrow-up-right': MoneySend,
  'identification-card': Personalcard,
  'scan-face': Scanning,
  'shield-check': ShieldTick,
  lock: Lock1,
  'map-pin': Location,
  warning: Warning2,
  bell: Notification,
  search: SearchNormal1,
  'caret-left': ArrowLeft2,
  'caret-right': ArrowRight2,
  whatsapp: Whatsapp,
  google: Google,
  'sign-out': Logout,
  gear: Setting2,
  'file-text': DocumentText,
  copy: Copy,
  check: TickCircle,
  close: CloseCircle,
  info: InfoCircle,
  verified: Verify,
  waves: Global,
  anchor: Drop,
  more: Element3,
} satisfies Record<string, IconsaxIcon>

export type IconName = keyof typeof registry

type Props = {
  name: IconName
  size?: 16 | 18 | 20 | 22 | 24 | 28 | 32
  filled?: boolean
  className?: string
  label?: string
}

export function Icon({ name, size = 20, filled = false, className, label }: Props) {
  const Cmp = registry[name]
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', lineHeight: 0 }}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      <Cmp size={size} color="currentColor" variant={filled ? 'Bold' : 'Linear'} />
    </span>
  )
}

export const iconNames = Object.keys(registry) as IconName[]
