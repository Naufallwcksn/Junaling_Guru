import { Minus, Plus } from 'lucide-react'

interface Props {
  label: string
  value: number
  onChange: (val: number) => void
  colorClass: string
  btnClass: string
}

export default function AttendanceCounter({ label, value, onChange, colorClass, btnClass }: Props) {
  return (
    <div className={`rounded-xl border-2 p-4 ${colorClass}`}>
      <p className="text-base font-semibold mb-3">{label}</p>
      <div className="flex items-center gap-3 justify-center">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className={`${btnClass} text-white rounded-lg w-11 h-11 flex items-center justify-center transition-colors`}
          aria-label={`Kurangi ${label}`}
        >
          <Minus className="w-5 h-5" />
        </button>
        <input
          type="number"
          value={value}
          min={0}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-20 text-center text-3xl font-bold bg-white border-2 border-current rounded-lg py-1 focus:outline-none"
          aria-label={`Jumlah ${label}`}
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className={`${btnClass} text-white rounded-lg w-11 h-11 flex items-center justify-center transition-colors`}
          aria-label={`Tambah ${label}`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
