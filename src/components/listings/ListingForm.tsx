"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const listingSchema = z.object({
  cropName: z.string().min(2, "Crop name required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.enum(["KG", "MON", "TON"]),
  minPricePerUnit: z.number().positive().optional(),
  description: z.string().min(10).max(500).optional(),
  harvestDate: z.string().min(1, "Harvest date required"),
  location: z.string().min(2, "Location required"),
  deliveryOptions: z
    .array(z.enum(["PICKUP", "COURIER"]))
    .min(1, "Select at least one delivery option"),
  images: z.array(z.string().url()).max(3).optional().default([]),
});

export type TListingForm = z.infer<typeof listingSchema>;

interface ListingFormProps {
  defaultValues?: Partial<TListingForm>;
  onSubmit: (data: TListingForm) => Promise<void>;
  submitLabel?: string;
}

export default function ListingForm({
  defaultValues,
  onSubmit,
  submitLabel = "Create Listing",
}: ListingFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TListingForm>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      unit: "KG",
      deliveryOptions: [],
      images: [],
      ...defaultValues,
    },
  });

  const selectedDelivery = watch("deliveryOptions") ?? [];

  const toggleDelivery = (option: "PICKUP" | "COURIER") => {
    const current = selectedDelivery;
    if (current.includes(option)) {
      setValue(
        "deliveryOptions",
        current.filter((o) => o !== option),
      );
    } else {
      setValue("deliveryOptions", [...current, option]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Input
          label='Crop Name'
          placeholder='e.g. আলু, ধান, টমেটো'
          error={errors.cropName?.message}
          required
          {...register("cropName")}
        />

        <div className='flex gap-3'>
          <div className='flex-1'>
            <Input
              label='Quantity'
              type='number'
              placeholder='e.g. 100'
              error={errors.quantity?.message}
              required
              {...register("quantity", { valueAsNumber: true })}
            />
          </div>
          <div className='w-28'>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Unit <span className='text-red-500'>*</span>
            </label>
            <select
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none'
              {...register("unit")}>
              <option value='KG'>KG</option>
              <option value='MON'>MON</option>
              <option value='TON'>TON</option>
            </select>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Input
          label='Min Price per Unit (৳)'
          type='number'
          placeholder='Optional bid floor'
          error={errors.minPricePerUnit?.message}
          {...register("minPricePerUnit", { valueAsNumber: true })}
        />

        <Input
          label='Harvest Date'
          type='date'
          error={errors.harvestDate?.message}
          required
          {...register("harvestDate")}
        />
      </div>

      <Input
        label='Location (District)'
        placeholder='e.g. Rajshahi, Dhaka'
        error={errors.location?.message}
        required
        {...register("location")}
      />

      <div>
        <label className='text-sm font-medium text-gray-700 block mb-1'>
          Description
        </label>
        <textarea
          className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none'
          rows={3}
          placeholder='Describe your crop quality, farming method, etc.'
          {...register("description")}
        />
        {errors.description && (
          <p className='text-xs text-red-500 mt-1'>
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Delivery Options */}
      <div>
        <label className='text-sm font-medium text-gray-700 block mb-2'>
          Delivery Options <span className='text-red-500'>*</span>
        </label>
        <div className='flex gap-3'>
          {(["PICKUP", "COURIER"] as const).map((option) => (
            <button
              key={option}
              type='button'
              onClick={() => toggleDelivery(option)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                selectedDelivery.includes(option)
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}>
              {option === "PICKUP" ? "🏠" : "🚚"}
              {option}
            </button>
          ))}
        </div>
        {errors.deliveryOptions && (
          <p className='text-xs text-red-500 mt-1'>
            {errors.deliveryOptions.message}
          </p>
        )}
      </div>

      <Button type='submit' loading={isSubmitting} size='lg' className='w-full'>
        {submitLabel}
      </Button>
    </form>
  );
}
