'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IProduct } from "@/types/product"
import axios from "axios"
import { Star } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

const productValidation = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }),
  category: z.string().min(1, { message: "Category cannot be empty" }),
  description: z.string().min(1, { message: "Description cannot be empty" }),
  price: z
    .string()
    .min(1, { message: "Price cannot be empty" })
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, { message: "Price must be a valid number greater than 0" }),
  image: z.string().url({ message: "Image must be a valid URL" }),
});

const Page = () => {
  const { id } = useParams()
  const navigate = useRouter()
  const [productData, setProductData] = useState<IProduct>({
    id: 1,
    title: "",
    category: "",
    description: "",
    price: 0,
    image: "",
    rating: {
      count: 0,
      rate: 0,
    },
  });

  useEffect(() => {
    const apiFetch = async () => {
      const response = await axios.get('https://fakestoreapi.com/products/' + id)
      setProductData(response.data)
    }
    apiFetch()
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setProductData(prev => ({
      ...prev, [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = productValidation.safeParse({
      ...productData,
      price: String(productData.price), 
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      const firstError = Object.values(errors).flat().find(Boolean)
      toast.error(firstError, { duration: 1500 })
      return
    }

    const newData = {
      id: productData.id,
      title: productData.title,
      price: Number(productData.price),
      description: productData.description,
      category: productData.category,
      image: productData.image,
    }

    try {
      const response = await axios.put(`https://fakestoreapi.com/products/${id}`, newData)
      if (response.status !== 200) {
        toast.error("Update failed", { duration: 1500 })
        return
      }
      toast.success("Successfully Updated", { duration: 1500 })
    } catch (error) {
      toast.error("Something went wrong", { duration: 1500 })
    }
  }

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://fakestoreapi.com/products/${id}`)
      if (response.status !== 200) {
        toast.error("Failed to delete", { duration: 1500 })
        return
      }
      toast.success("Product Deleted Successfully", { duration: 1500 })
      setTimeout(() => {
        navigate.push('/')
      }, 1500);
    } catch (error) {
      toast.error("Something went wrong", { duration: 1500 })
    }
  }

  return (
    <div className='w-full flex justify-center'>
      <div className='w-fit min-w-140 rounded-md p-8 bg-white border-gray-300 '>
        <div className="w-full text-center text-xl font-semibold">Product Detail</div>

        <div>
          <div className="w-full flex justify-center">
            <img src={productData?.image} alt={productData?.title} className="w-40 h-40 object-contain" />
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <div>Title</div>
              <Input onChange={handleChange} value={productData?.title} name='title' type="text" />
            </div>
            <div>
              <div>Category</div>
              <Input onChange={handleChange} value={productData?.category} name='category' type="text" />
            </div>
            <div>
              <div>Description</div>
              <Input onChange={handleChange} value={productData?.description} name='description' type="text" />
            </div>
            <div>
              <div>Price</div>
              <Input onChange={handleChange} value={productData?.price} name='price' type="number" />
            </div>
            <div>
              <div>Image</div>
              <Input onChange={handleChange} value={productData?.image} name='image' type="text" />
            </div>
            <div>
              <div>Rating</div>
              <div className="flex gap-1 items-center">
                <Star
                  strokeWidth={"1px"}
                  size={16}
                  fill="#F0B100"
                  color="#F0B100"
                />
                {productData.rating.rate + " (" + productData.rating.count + ")"}
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full">Submit</Button>
            </div>
          </form>
          <div>
            <Button className="w-full bg-red-500 mt-3" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
