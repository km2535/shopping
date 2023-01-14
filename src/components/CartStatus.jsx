import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCarts } from "../hook/useCarts";

export default function CartStatus() {
  const {
    cartQuery: { data: products },
  } = useCarts();
  return (
    <div className="relative">
      <AiOutlineShoppingCart className="text-4xl" />
      {products && (
        <p className="w-6 h-6 text-center bg-brand text-white font-bold rounded-full absolute -top-1 -right-2">
          {products.length}
        </p>
      )}
    </div>
  );
}
