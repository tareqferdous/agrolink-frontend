import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { TRejectForm } from "./types";

interface RejectListingModalProps {
  rejectModal: string | null;
  isSubmitting: boolean;
  errors: FieldErrors<TRejectForm>;
  register: UseFormRegister<TRejectForm>;
  handleSubmit: UseFormHandleSubmit<TRejectForm>;
  onSubmit: (data: TRejectForm) => void;
  onClose: () => void;
}

export default function RejectListingModal({
  rejectModal,
  isSubmitting,
  errors,
  register,
  handleSubmit,
  onSubmit,
  onClose,
}: RejectListingModalProps) {
  return (
    <Modal isOpen={!!rejectModal} onClose={onClose} title='Reject Listing'>
      <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-100 dark:border-red-800'>
        <p className='text-sm text-red-700 dark:text-red-300 font-medium'>
          ⚠️ The farmer will be notified with your reason
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5'>
            Rejection Reason <span className='text-red-500'>*</span>
          </label>
          <textarea
            className={`w-full px-3 py-2.5 border rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none transition-colors ${
              errors.adminNote
                ? "border-red-300 dark:border-red-700"
                : "border-gray-200 dark:border-gray-700"
            }`}
            rows={4}
            placeholder='Explain clearly why this listing is being rejected so the farmer can improve...'
            {...register("adminNote")}
          />
          {errors.adminNote && (
            <p className='text-xs text-red-500 mt-1.5 flex items-center gap-1'>
              <span>⚠️</span> {errors.adminNote.message}
            </p>
          )}
        </div>

        <div className='flex gap-3 pt-1'>
          <Button
            type='button'
            variant='secondary'
            className='flex-1'
            onClick={onClose}>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='danger'
            loading={isSubmitting}
            className='flex-1'>
            Reject Listing
          </Button>
        </div>
      </form>
    </Modal>
  );
}
