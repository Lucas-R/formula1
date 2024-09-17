export type ListProps = [ExamProps];

interface ExamProps {
    id: string,
    patient: string
    service: string
    price: string
    doctor: string
    status: boolean
    created_at: string
}