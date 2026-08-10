'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Users, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { SearchBar } from '@/components/ui/SearchBar'
import { Pagination } from '@/components/ui/Pagination'
import { StudentForm, StudentFormData } from './StudentForm'
import { createStudent, updateStudent, deleteStudent } from '@/lib/students/actions'
import { Student } from '@/types/student'

const PAGE_SIZE = 8

export function StudentsClient({ initialStudents }: { initialStudents: Student[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return initialStudents
    return initialStudents.filter(
      (s) => s.full_name.toLowerCase().includes(term) || s.matric_number.toLowerCase().includes(term)
    )
  }, [initialStudents, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openCreate = () => { setEditingStudent(null); setIsFormOpen(true) }
  const openEdit = (student: Student) => { setEditingStudent(student); setIsFormOpen(true) }

  const handleSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true)
    const result = editingStudent
      ? await updateStudent({ id: editingStudent.id, fullName: data.fullName, matricNumber: data.matricNumber, phone: data.phone })
      : await createStudent({ fullName: data.fullName, matricNumber: data.matricNumber, phone: data.phone, password: data.password })
    setIsSubmitting(false)

    if (result.error) { toast.error(result.error); return }
    toast.success(editingStudent ? 'Student updated' : 'Student added')
    setIsFormOpen(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!deletingStudent) return
    setIsSubmitting(true)
    const result = await deleteStudent(deletingStudent.id)
    setIsSubmitting(false)

    if (result.error) { toast.error(result.error); return }
    toast.success('Student removed')
    setDeletingStudent(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Students</h1>
          <p className="mt-1 text-sm text-slate-500">{initialStudents.length} total students</p>
        </div>
        <Button onClick={openCreate} className="sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search by name or matric number..." />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? 'No matching students' : 'No students yet'}
          description={search ? 'Try a different search term.' : 'Add your first student to get started.'}
          action={!search && <Button onClick={openCreate} className="sm:w-auto">Add Student</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-slate-200/50 ring-1 ring-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="px-5 py-3 font-medium text-slate-500">Name</th>
                <th className="px-5 py-3 font-medium text-slate-500">Matric No.</th>
                <th className="hidden px-5 py-3 font-medium text-slate-500 sm:table-cell">Phone</th>
                <th className="px-5 py-3 text-right font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-900">{student.full_name}</td>
                  <td className="px-5 py-3 text-slate-600">{student.matric_number}</td>
                  <td className="hidden px-5 py-3 text-slate-600 sm:table-cell">{student.phone || '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(student)} className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeletingStudent(student)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 pb-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingStudent ? 'Edit Student' : 'Add Student'}>
        <StudentForm
          mode={editingStudent ? 'edit' : 'create'}
          defaultValues={editingStudent ? { fullName: editingStudent.full_name, matricNumber: editingStudent.matric_number, phone: editingStudent.phone ?? '' } : undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDelete}
        title="Delete Student"
        description={`Are you sure you want to remove ${deletingStudent?.full_name}? This will permanently delete their account and cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  )
}