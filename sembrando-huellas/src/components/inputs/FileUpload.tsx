import { forwardRef, useState, useRef, useCallback, type InputHTMLAttributes } from 'react'
import { Upload, X, File } from 'lucide-react'
import { cn } from '@/lib/cn'

interface FileUploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string
  error?: string
  multiple?: boolean
  maxSize?: number
  onChange: (files: File[]) => void
  value?: File[]
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      error,
      multiple = false,
      maxSize,
      onChange,
      value = [],
      accept,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [dragOver, setDragOver] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const resolvedRef = (ref || inputRef) as React.RefObject<HTMLInputElement | null>

    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = inputId ? `${inputId}-error` : undefined

    const processFiles = useCallback(
      (fileList: FileList) => {
        const files = Array.from(fileList)
        if (!multiple) {
          onChange(files.slice(0, 1))
        } else {
          onChange(files)
        }
      },
      [multiple, onChange]
    )

    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(false)
        if (e.dataTransfer.files.length > 0) {
          processFiles(e.dataTransfer.files)
        }
      },
      [processFiles]
    )

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(true)
    }

    const handleDragLeave = () => setDragOver(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files)
      }
    }

    const removeFile = (index: number) => {
      const updated = value.filter((_, i) => i !== index)
      onChange(updated)
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
          </label>
        )}
        <div
          role="button"
          tabIndex={0}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => resolvedRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') resolvedRef.current?.click()
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors',
            dragOver
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500',
            error && 'border-red-500',
            className
          )}
        >
          <Upload
            size={28}
            className={dragOver ? 'text-primary-500' : 'text-neutral-400'}
          />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Arrastra y suelta archivos aquí o haz clic para seleccionar
          </p>
          {accept && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Formatos permitidos: {accept.replace(/\./g, '').replace(/,/g, ', ')}
            </p>
          )}
          {maxSize && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Tamaño máximo: {formatSize(maxSize)}
            </p>
          )}
        </div>
        <input
          ref={resolvedRef}
          id={inputId}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {value.length > 0 && (
          <ul className="mt-2 flex flex-col gap-2">
            {value.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800/50"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <File size={16} className="shrink-0 text-neutral-400" />
                  <span className="truncate text-sm text-neutral-700 dark:text-neutral-300">
                    {file.name}
                  </span>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {formatSize(file.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-2 text-neutral-400 hover:text-red-500"
                  aria-label={`Eliminar ${file.name}`}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'
export default FileUpload
