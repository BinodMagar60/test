'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IProduct } from "@/types/product"
import { Plus, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { SetStateAction, useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"


import { z } from "zod";

const productSchema = z.object({
    id: z.string().min(1, "id is required"),
    title: z.string().min(1, "title is required").max(150, "title too long"),
    price: z.string().min(1, "price is required"),
    description: z.string().min(1, "description is required"),
    category: z.string().min(1, "category is required"),
    image: z.string().url("image must be a valid URL"),
});




const Page = () => {

    const [productData, setProductData] = useState<IProduct[]>([])
    const [isClose, setClose] = useState(false)
    const naviate = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const apiFetch = async () => {
            try {
                const response = await axios.get('https://fakestoreapi.com/products')
                if (response.status !== 200) {
                    console.log('data fetching error')
                    return
                }
                // console.log(response)
                setProductData(response.data)
                setTimeout(() => {
                    setLoading(false)
                }, 1000);
            } catch (error) {
                console.log(error)
            }

        }
        apiFetch()
    }, [])


    return (
        <div className="w-full p-8 bg-white rounded-md border border-gray-300">
           {
            loading? <>
            <div className="w-full flex justify-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
</>:
            <>
             <div className="flex justify-between">
                <div className="text-xl font-semibold">Product</div>
                <div><Button variant={'outline'} className="cursor-pointer" onClick={() => setClose(true)}><Plus />Add Product</Button></div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 xl:grid-cols-5">
                {
                    productData.map(item => (
                        <div key={item.id} className="border border-gray-300 p-2 rounded-md flex flex-col hover:shadow-sm" onClick={() => {
                            naviate.push(`/dashboard/product/${item.id}`)
                        }}>
                            <div className="relative w-full py-2">
                                <img
                                    src={item.image}
                                    alt={item.title}

                                    className="w-full h-40 object-contain border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex flex-col flex-grow">
                                <div className="mt-2 text-sm font-semibold">
                                    <div>
                                        {item.title.length > 50 ? item.title.slice(0, 50) + "..." : item.title}
                                    </div>
                                </div>
                                <div className="text-gray-500 text-xs">{item.category}</div>
                            </div>


                            <div className="flex justify-between text-sm mt-2">
                                <div className="flex gap-1 items-center">
                                    <Star
                                        strokeWidth={"1px"}
                                        size={16}
                                        fill="#F0B100"
                                        color="#F0B100"
                                    />
                                    {item.rating.rate + " (" + item.rating.count + ")"}
                                </div>
                                <div className="font-medium">$ {item.price}</div>
                            </div>
                        </div>

                    ))
                }
            </div>

            {isClose && <AddCard setClose={setClose} />}
            </>
           }

        </div>
    )
}


const AddCard = ({ setClose }: { setClose: React.Dispatch<SetStateAction<boolean>> }) => {

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        price: 0,
        description: "",
        category: "",
        image: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target
        setFormData(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()


        const result = productSchema.safeParse(formData)
        console.log(result)
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            const firstError = Object.values(errors).flat().find(Boolean);
            toast.error(firstError, { duration: 1500 });
            return
        }

        try {
            const response = await axios.post('https://fakestoreapi.com/products', formData)
            console.log(response)
            toast.success("Successfully added", { duration: 1500 })
            setClose(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-w-full h-screen bg-[#a0a0a04b] fixed top-0 -left-0 z-10">
            <div className="w-fit p-6 bg-white rounded-md mx-auto mt-30 min-w-80">
                <div className="flex justify-between">
                    <div className="w-full text-xl font-semibold ">Add Product</div>
                    <div>
                        <Button variant={'outline'} onClick={() => setClose(false)}>Close</Button>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div>Id</div>
                        <div><Input onChange={handleChange} value={formData.id} name='id' type="text" /></div>
                    </div>
                    <div>
                        <div>Title</div>
                        <div><Input onChange={handleChange} value={formData.title} name='title' type="text" /></div>
                    </div>
                    <div>
                        <div>Category</div>
                        <div><Input onChange={handleChange} value={formData.category} name='category' type="text" /></div>
                    </div>
                    <div>
                        <div>Description</div>
                        <div><Input onChange={handleChange} value={formData.description} name='description' type="text" /></div>
                    </div>
                    <div>
                        <div>Price</div>
                        <div><Input onChange={handleChange} value={formData.price} name='price' type="number" /></div>
                    </div>
                    <div>
                        <div>Image</div>
                        <div><Input onChange={handleChange} value={formData.image} name='image' type="text" /></div>
                    </div>

                    <div className="mt-6">
                        <Button className="w-full">Submit</Button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default Page