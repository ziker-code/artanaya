import {
  AnchorIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BellIcon,
  BoatIcon,
  CalendarDotsIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ChartBarIcon,
  ChatsCircleIcon,
  CheckIcon,
  ClipboardTextIcon,
  CookingPotIcon,
  CopyIcon,
  CrosshairSimpleIcon,
  DropIcon,
  FileTextIcon,
  FishIcon,
  FolderSimpleIcon,
  GearSixIcon,
  GoogleLogoIcon,
  HouseIcon,
  IdentificationCardIcon,
  InfoIcon,
  LinkSimpleIcon,
  LockSimpleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MinusIcon,
  PlantIcon,
  PlusIcon,
  QuestionIcon,
  ScanSmileyIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  SignOutIcon,
  UploadSimpleIcon,
  UserIcon,
  WalletIcon,
  WarningCircleIcon,
  WavesIcon,
  WhatsappLogoIcon,
  XIcon,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react'

/**
 * Satu pintu untuk semua ikon. Nama mengikuti PRD Lampiran A.
 * Untuk mengganti dengan SVG unduhan sendiri: ubah entri di peta ini saja.
 */
const registry = {
  home: HouseIcon,
  folder: FolderSimpleIcon,
  wallet: WalletIcon,
  help: QuestionIcon,
  user: UserIcon,
  chats: ChatsCircleIcon,
  radar: CrosshairSimpleIcon,
  'clipboard-check': ClipboardTextIcon,
  link: LinkSimpleIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  plant: PlantIcon,
  fish: FishIcon,
  boat: BoatIcon,
  'cooking-pot': CookingPotIcon,
  drop: DropIcon,
  upload: UploadSimpleIcon,
  'chart-bar': ChartBarIcon,
  calendar: CalendarDotsIcon,
  'arrow-down-left': ArrowDownLeftIcon,
  'arrow-up-right': ArrowUpRightIcon,
  'identification-card': IdentificationCardIcon,
  'scan-face': ScanSmileyIcon,
  'shield-check': ShieldCheckIcon,
  lock: LockSimpleIcon,
  'map-pin': MapPinIcon,
  warning: WarningCircleIcon,
  bell: BellIcon,
  search: MagnifyingGlassIcon,
  'caret-left': CaretLeftIcon,
  'caret-right': CaretRightIcon,
  whatsapp: WhatsappLogoIcon,
  google: GoogleLogoIcon,
  'sign-out': SignOutIcon,
  gear: GearSixIcon,
  'file-text': FileTextIcon,
  copy: CopyIcon,
  check: CheckIcon,
  close: XIcon,
  info: InfoIcon,
  verified: SealCheckIcon,
  waves: WavesIcon,
  anchor: AnchorIcon,
} satisfies Record<string, PhosphorIcon>

export type IconName = keyof typeof registry

type Props = {
  name: IconName
  size?: 16 | 20 | 24 | 28 | 32
  filled?: boolean
  className?: string
  label?: string
}

export function Icon({ name, size = 20, filled = false, className, label }: Props) {
  const Cmp = registry[name]
  return (
    <Cmp
      size={size}
      weight={filled ? 'fill' : 'regular'}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  )
}

export const iconNames = Object.keys(registry) as IconName[]
