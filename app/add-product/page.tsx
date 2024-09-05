"use client";

import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import IMask from "imask";
import { Product } from "../interfaces/product";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type FormInputs = {
  productName: string;
  sellerInfo: string;
  stockCount: number | null;
  price: number | null;
  discountedPrice?: number | null;
  category: string;
  imageUrl: string;
}

const AddProduct = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset, setError } = useForm<FormInputs>({
    defaultValues: {
      productName: "",
      sellerInfo: "",
      stockCount: null,
      price: null,
      discountedPrice: null,
      category: "",
      imageUrl: "",
    },
  });

  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);

  const applyInputMasks = () => {
    const stockCount = document.getElementById('stockCount') as HTMLInputElement;
    const price = document.getElementById('price') as HTMLInputElement;
    const discountedPrice = document.getElementById('discountedPrice') as HTMLInputElement;
    const productName = document.getElementById('productName') as HTMLInputElement;
    const sellerInfo = document.getElementById('sellerInfo') as HTMLInputElement;
    const category = document.getElementById('category') as HTMLInputElement;

    IMask(stockCount, { mask: Number, signed: true, min: 0 });
    IMask(price, { mask: Number, signed: true, min: 1 });
    IMask(discountedPrice, { mask: Number, signed: true, min: 1 });
    IMask(productName, { mask: /^[a-zA-Z]/ });
    IMask(sellerInfo, { mask: /^[a-zA-Z0-9.\- ]+$/ });
    IMask(category, { mask: /^[a-zA-Z ]+$/ });
    
  // IMask(sellerInfo, { mask: /^[a-zA-Z0-9.-]([a-zA-Z0-9.-\s]){1,}?$/ });
  // IMask(category, { mask: /^[a-zA-Z]([a-zA-Z\s]){1,}?$/ });
  };

  useEffect(() => {
    applyInputMasks();
  }, []);

  const handleAddImageUrl = () => {
    const maxImages = 3;
    const imageUrl = watch("imageUrl");
    if (!imageUrl) return;
    const currentImageCount = productImageUrls.length;

    if (currentImageCount >= maxImages) {
      toast.error("You can only add up to 3 images.");
      return;
    }
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setProductImageUrls((prevUrls) => [...prevUrls, imageUrl]);
      setValue("imageUrl", "");
      toast.success("Image added successfully!");
    };

    img.onerror = () => {
      toast.error("The provided URL does not lead to a valid image.");
    };
  };

  const handleRemoveImage = (index: number) => {
    setProductImageUrls((prevUrls) =>
      prevUrls.filter((_, i) => i !== index)
    );
    toast.info("Image removed.");
  };

  const onSubmit = (data: FormInputs) => {
    const { productName, sellerInfo, stockCount, price, discountedPrice, category } = data;
    const priceNum = parseFloat(price as unknown as string);
    const discountedPriceNum = discountedPrice ? parseFloat(discountedPrice as unknown as string) : undefined;
    const stockCountNum = parseInt(stockCount as unknown as string, 10);

    let hasError=false;
  
    if (discountedPriceNum && discountedPriceNum >= priceNum) {
      setError("discountedPrice", {
        type: "manual",
        message: "Discounted price must be lower than the regular price.",
      });
      hasError = true;
    }
    if (priceNum <= 0) {
      setError("price", {
        type: "manual",
        message: "Price must be a positive number and greater than zero.",
      });
      hasError = true;
    }
    if (stockCountNum < 0) {
      setError("stockCount", {
        type: "manual",
        message: "Stock count must be a positive number.",
      });
      hasError = true;
    }
    if (hasError) {
      return;
    }


    const product: Product = {
      id: Date.now(),
      productName,
      sellerInfo,
      stockCount,
      price,
      discountedPrice,
      category,
      productImageUrls,
    };

    const existingProducts = JSON.parse(localStorage.getItem("products") || "[]");
    existingProducts.push(product);
    localStorage.setItem("products", JSON.stringify(existingProducts));
    toast.success("Product added successfully!");
    reset({
      productName: "",
      sellerInfo: "",
      stockCount: null,
      price: null,
      discountedPrice: null,
      category: "",
      imageUrl: "",
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url(/background.jpg)" }}
    >
      <ToastContainer />
      <div className="w-full max-w-4xl my-28 bg-opacity-80 backdrop-blur-sm bg-slate-100 rounded-lg shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-3xl font-semibold text-center text-gray-800 my-4">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-7">
              <div className="relative">
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                  Product Name:
                </label>
                <input
                  id="productName"
                  value={watch("productName")}
                  tabIndex={1}
                  {...register("productName", { required: "Product name is required" })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
                {errors.productName && (
                  <p className="absolute left-0 top-15 text-red-500 text-sm">{errors.productName.message}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="sellerInfo" className="block text-sm font-medium text-gray-700">
                  Seller Info:
                </label>
                <input
                  id="sellerInfo"
                  value={watch("sellerInfo")}
                  tabIndex={3}
                  {...register("sellerInfo", { required: "Seller info is required" })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
                {errors.sellerInfo && (
                  <p className="absolute left-0 top-15 text-red-500 text-sm">{errors.sellerInfo.message}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="stockCount" className="block text-sm font-medium text-gray-700">
                  Stock Count:
                </label>
                <input
                  id="stockCount"
                  value= {watch("stockCount")??undefined}
                  type="text"
                  tabIndex={5}
                  {...register("stockCount", { required: "Stock count is required" })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
                {errors.stockCount && (
                  <p className="absolute left-0 top-15 text-red-500 text-sm">{errors.stockCount.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-7">
              <div className="relative">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price:
                </label>
                <input
                  id="price"
                  value={watch("price")??undefined}
                  type="text"
                  tabIndex={2}
                  {...register("price", { required: "Price is required" })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
                {errors.price && (
                  <p className="absolute left-0 top-15 text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700">
                  Discounted Price:
                </label>
                <input
                  id="discountedPrice"
                  value={watch("discountedPrice")??undefined}
                  type="text"
                  tabIndex={4}
                  {...register("discountedPrice")}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
                {errors.discountedPrice && (
                  <p className="absolute left-0 top-15 text-red-500 text-sm">{errors.discountedPrice.message}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category:
                </label>
                <input
                  id="category"
                  tabIndex={6}
                  {...register("category", { required: "Category is required" })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
                {errors.category && (
                  <p className="absolute left-0 top-15 text-red-500 text-sm">{errors.category.message}</p>
                )}
              </div>

            </div>
          </div>
          <div className="relative mt-6 bg-transparent border border-gray-400 rounded-md p-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium pb-4 text-gray-700">
              Image URL:
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <input
                id="imageUrl"
                tabIndex={7}
                {...register("imageUrl", { required: "Image URL is required" })}
                className="block flex-grow border border-gray-300 rounded-md shadow-sm sm:text-sm p-2 mb-4"
              />
              {errors.imageUrl && (
                  <p className="absolute left-5 top-24 text-red-500 text-sm">{errors.imageUrl.message}</p>
                )}
              <button
                type="button"
                onClick={handleAddImageUrl}
                tabIndex={8}
                className="btn px-4 py-2 sm:mb-4 bg-primaryLightColor text-white rounded-md hover:bg-primaryDarkColor"
              >
                Add Image
              </button>
            </div>

            {productImageUrls.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Images:</h3>
                <div className="flex space-x-4">
                  {productImageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img src={url} alt={`Product Image ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="btn absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                      >
                        <AiOutlineClose />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              tabIndex={9}
              className="btn w-full px-6 py-2 bg-secondaryLightColor text-white rounded-md hover:bg-secondaryDarkColor hover:transition-transform hover:duration-300 transform hover:scale-105"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
