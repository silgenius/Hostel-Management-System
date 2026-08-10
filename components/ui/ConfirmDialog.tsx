'use client'

import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  isLoading?: boolean
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, isLoading }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading} type="button">Delete</Button>
      </div>
    </Modal>
  )
}