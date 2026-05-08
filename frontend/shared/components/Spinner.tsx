import React from 'react'

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  label?: string
  fullScreen?: boolean
  overlay?: boolean
}

const sizeMap = {
  xs: 'w-4 h-4 border-2',
  sm: 'w-6 h-6 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4'
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label, fullScreen = false, overlay = false }) => {
  const spinnerClass = sizeMap[size]

  const container = fullScreen ? (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${overlay ? 'bg-black/30' : ''}`}>
      <div className="flex flex-col items-center gap-3">
        <div className={`${spinnerClass} border-cyan-600 border-t-transparent rounded-full animate-spin`} />
        {label && <p className="text-sm font-medium text-slate-300">{label}</p>}
      </div>
    </div>
  ) : (
    <div className="flex w-full h-full items-center justify-center gap-2">
      <div className={`${spinnerClass} border-cyan-600 border-t-transparent rounded-full animate-spin`} />
      {label && <p className="text-sm font-medium text-slate-300">{label}</p>}
    </div>
  )

  return container
}

export default Spinner
