import React, { useState } from "react";
import { Icon } from "@shopify/polaris";
import { DeleteIcon, PlusIcon } from "@shopify/polaris-icons";
import "../styles.css";
import {
  Page,
  FormLayout,
  TextField,
  Button,
  Card,
  Select,
  InlineStack,
  Banner,
  DataTable,
  Text,
} from "@shopify/polaris";
import { useForm, Controller, useFieldArray } from "react-hook-form";

const discountTypes = [
  { label: "None", value: "none" },
  { label: "% Discount", value: "percent" },
  { label: "Discount / Each", value: "fixed" },
];

export default function DiscountForm() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      campaignName: "Volume Discount #2",
      title: "Buy more and save",
      description: "Apply for all products in store",
      options: [
        { title: "Single", subtitle: "Standard price", quantity: 1, discountType: "none", amount: "", label: "" },
        { title: "Duo", subtitle: "Save 10%", quantity: 2, discountType: "percent", amount: "10", label: "Popular" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "options" });
  const options = watch("options");

  const onSubmit = (data) => {
    if (!data.campaignName || !data.title || data.options.length === 0) {
      alert("Please fill all required fields and have at least one option.");
      return;
    }
    console.log("Valid form submitted:", data);
    alert("Form submitted successfully!");
  };

  return (
<Page title="Create volume discount">
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
    <Card sectioned title="General" className="shadow-lg rounded-lg">
    <h2 className="text-xl font-bold text-gray-900 mb-4">General</h2>
      <FormLayout>
        <Controller
          control={control}
          name="campaignName"
          rules={{ required: "Campaign is required" }}
          render={({ field }) => (
            <TextField label="Campaign" {...field} error={errors.campaignName?.message} className="w-full" />
          )}
        />
        <Controller
          control={control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <TextField label="Title" {...field} error={errors.title?.message} className="w-full" />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextField label="Description" {...field} className="w-full" multiline />
          )}
        />
      </FormLayout>
    </Card>

    <Card sectioned title="Volume discount rule" className="shadow-lg rounded-lg">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Volume discount rule</h2>
      {fields.map((field, index) => (
        <Card key={field.id} sectioned className="bg-gray-100 rounded-lg p-4">
          <div className="option-header bg-red-500 text-white p-2 mb-3 rounded-lg w-20">OPTION {index + 1}</div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name={`options.${index}.title`}
              rules={{ required: "Title is required" }}
              render={({ field }) => <TextField label="Title" {...field} className="w-full" />}
            />
            <Controller
              control={control}
              name={`options.${index}.subtitle`}
              render={({ field }) => <TextField label="Subtitle" {...field} className="w-full" />}
            />
            <Controller
                  control={control}
                  name={`options.${index}.label`}
                  render={({ field }) => <TextField label="Label (optional)" {...field} />}
            />
            <Controller
              control={control}
              name={`options.${index}.quantity`}
              rules={{ required: "Quantity is required", valueAsNumber: true }}
              render={({ field }) => <TextField label="Quantity" type="number" {...field} className="w-full" />}
            />
            <Controller
              control={control}
              name={`options.${index}.discountType`}
              render={({ field }) => <Select label="Discount Type" options={discountTypes} {...field} />}
            />
            {watch(`options.${index}.discountType`) !== "none" && (
              <Controller
                control={control}
                name={`options.${index}.amount`}
                rules={{ required: "Amount is required", valueAsNumber: true }}
                render={({ field }) => (
                  <TextField
                    label="Amount"
                    type="number"
                    {...field}
                    className="w-full"
                    suffix={options[index].discountType === "percent" ? "%" : "$"}
                  />
                )}
              />
            )}
          </div>
          
          <button destructive onClick={() => remove(index)} className="mt-4 rounded-xl p-2 hover:bg-gray-500 hover:text-white" >
          <Icon source={DeleteIcon} />
          Remove
          </button>
        </Card>
      ))}

          <button
            type="button"
            className="add-option-button flex bg-red-500 w-9/12 justify-center items-center mt-3 mx-auto mx-9 h-9 text-white rounded-lg gap-2"
            onClick={() =>
              append({
                title: `Option ${fields.length + 1}`,
                subtitle: "",
                label: "",
                quantity: fields.length > 0 ? Number(options[fields.length - 1].quantity) + 1 : 1,
                discountType: "none",
                amount: "",
              })
            }
            primary
          >
            <InlineStack align="center">
              <Icon source={PlusIcon} />
              <span>Add option</span>
            </InlineStack>
          </button>
    </Card>

    <Card sectioned title="Preview" className="shadow-lg rounded-lg">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
      <h2 className="text-xl font-bold text-center">{watch("title")}</h2>
      <h3 className="font-bold">{watch("description")}</h3>
      <DataTable
        columnContentTypes={["text", "text", "numeric", "text"]}
        headings={["Title", "Discount Type", "Quantity", "Amount"]}
        rows={options.map((opt) => [
          opt.title || "N/A",
          opt.discountType || "None",
          opt.quantity || 1,
          opt.amount ? `${opt.amount} ${opt.discountType === "percent" ? "%" : "$"}` : "",
        ])}
      />
    </Card>

    <button
      submit
      primary
      className="w-11/12 flex m-auto justify-center items-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
    >
      Save
    </button>
  </form>
</Page>
  );
}
