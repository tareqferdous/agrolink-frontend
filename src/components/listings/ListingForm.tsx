"use client";

import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import Input from "@/components/ui/Input";
import { CATEGORIES } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const listingSchema = z.object({
  cropName: z.string().min(2, "Crop name required"),
  category: z.enum([
    "VEGETABLES",
    "FRUITS",
    "GRAINS",
    "RICE",
    "PULSES",
    "SPICES",
    "DAIRY",
    "OTHERS",
  ]),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.enum(["KG", "MON", "TON"]),
  minPricePerUnit: z.number().positive().optional(),
  description: z.string().min(10).max(500).optional(),
  harvestDate: z
    .string()
    .min(1, "Harvest date required")
    .refine((date) => date <= getTodayDateString(), {
      message: "Harvest date cannot be in the future",
    }),
  location: z.string().min(2, "Location required"),
  deliveryOptions: z
    .array(z.enum(["PICKUP", "COURIER"]))
    .min(1, "Select at least one delivery option"),
  images: z.array(z.string().url()).max(3).optional(),
});

export type TListingForm = z.infer<typeof listingSchema>;

interface ListingFormProps {
  defaultValues?: Partial<TListingForm>;
  onSubmit: (data: TListingForm) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export default function ListingForm({
  defaultValues,
  onSubmit,
  submitLabel = "Create Listing",
  isSubmitting = false,
}: ListingFormProps) {
  const maxHarvestDate = getTodayDateString();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm<TListingForm>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      unit: "KG",
      category: "OTHERS",
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

  const loading = isSubmitting || formSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      {/* Crop name + Category */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Input
          label='Crop Name'
          placeholder='e.g. আলু, ধান, টমেটো'
          error={errors.cropName?.message}
          required
          {...register("cropName")}
        />

        <div>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1'>
            Category <span className='text-red-500'>*</span>
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none ${
              errors.category
                ? "border-red-500 dark:border-red-700"
                : "border-gray-300 dark:border-gray-700"
            }`}
            {...register("category")}>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className='text-xs text-red-500 mt-1'>
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Quantity + Unit */}
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
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1'>
            Unit <span className='text-red-500'>*</span>
          </label>
          <select
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none'
            {...register("unit")}>
            <option value='KG'>KG</option>
            <option value='MON'>MON</option>
            <option value='TON'>TON</option>
          </select>
        </div>
      </div>

      {/* Min price + Harvest date */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
          max={maxHarvestDate}
          error={errors.harvestDate?.message}
          required
          {...register("harvestDate")}
        />
      </div>

      {/* Location */}
      <Input
        label='Location (District)'
        placeholder='e.g. Rajshahi, Dhaka'
        error={errors.location?.message}
        required
        {...register("location")}
      />

      {/* Description */}
      <div>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1'>
          Description
        </label>
        <textarea
          className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none ${
            errors.description
              ? "border-red-500 dark:border-red-700"
              : "border-gray-300 dark:border-gray-700"
          }`}
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
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2'>
          Delivery Options <span className='text-red-500'>*</span>
        </label>
        <div className='flex gap-3'>
          {(["PICKUP", "COURIER"] as const).map((option) => (
            <button
              key={option}
              type='button'
              onClick={() => toggleDelivery(option)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                selectedDelivery.includes(option)
                  ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
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

      {/* Image Upload */}
      <Controller
        name='images'
        control={control}
        render={({ field }) => (
          <ImageUpload
            value={field.value ?? []}
            onChange={field.onChange}
            maxImages={3}
          />
        )}
      />

      <Button type='submit' loading={loading} size='lg' className='w-full'>
        {submitLabel}
      </Button>
    </form>
  );
}
